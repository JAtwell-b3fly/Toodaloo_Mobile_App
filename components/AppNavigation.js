import React from "react";
import {createContext, useReducer, useContext} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

//Components
import Splash from "./Splash";
import ToDo from "./ToDo";

//Creating the app context containing the containers used to store the states
const AppContext = createContext({
    todolist: [{
        id: 12345,
        task: "This is the first task",
        importance: "General",
        date: "today",
    },
    {
        id: 23456,
        task: "This is the second task",
        importance: "Urgent",
        date: "yesterday",
    },
],
    dispatch: () => {},
});

//Creating the app reducer where we define the actions and cases we will use to update the global state
const appReducer = (state, action) => {
    switch (action.type) {
        case "SET_TASK":
            return {...state, todolist: action.payload};
        case "ADD_TASK":
            return {...state, todolist: [...state.todolist, action.payload]};
        case "REMOVE_TASK":
            return {
                ...state,
                todolist: state.todolist.filter((task) => task.id !== action.payload.id)
            }
        default:
            return state;
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, {
        todolist: [
            {
                id: 12345,
                task: "This is the first task",
                importance: "General",
                date: "today",
            },
            {
                id: 23456,
                task: "This is the second task",
                importance: "Urgent",
                date: "yesterday",
            },
        ]
    });

    return (
        <AppContext.Provider value={{todolist: state.todolist, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}

const AppNavigation = () => {
    return(
        <AppProvider>
       <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={Splash} />
                <Stack.Screen name="ToDo" component={ToDo} />
            </Stack.Navigator>
       </NavigationContainer>
       </AppProvider>
    )
};

export default AppNavigation;

