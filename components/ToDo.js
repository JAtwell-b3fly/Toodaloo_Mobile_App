import React, {useState, useContext, useEffect} from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "./AppNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ToDo = () => {
    const navigation = useNavigation();

    const {todolist, dispatch} = useAppContext();

    const [task, setTask] = useState("");
    const [importance, setImportance] = useState("General");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTask, setFilteredTask] = useState(null);
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({ task: "", importance: "General"});
    
    const chooseImportance = () => {
        const newImportance = importance === "General" ? "Urgent" : "General";

    setImportance(newImportance);

    setUpdatedTask({ ...updatedTask, importance: newImportance });
    }

    useEffect(() => {
        const loadTasksFromStorage = async () => {
            try {
                const storedTasks = await AsyncStorage.getItem("tasks");
                if (storedTasks) {
                    const parsedTasks = JSON.parse(storedTasks);
                    dispatch({ type: "SET_TASK", payload: parsedTasks });
                }
            } catch (error) {
                console.error("Error loading tasks from AsyncStorage: ", error);
            }
        };
    
        loadTasksFromStorage();
    }, [dispatch]);

    useEffect(() => {
        if (searchTerm) {
          const foundTask = todolist.find(
            (task) => task.task.toLowerCase() === searchTerm.toLowerCase()
          );
    
          setFilteredTask(foundTask);
        } else {
          setFilteredTask(null);
        }
      }, [searchTerm, todolist]);

    const searchTask = (search) => {
        setSearchTerm(search);
    }

    const removeTask = (index) => {
        // Get the task ID to be removed
        const taskId = todolist[index].id;

        //Dispatch the "REMOVE_TASK" action to remove the image with the given id
        dispatch({type: "REMOVE_TASK", payload: {id: taskId}})

        //Get the updated task list from the state
        const updatedTaskList = todolist.filter((task, i) => i !== index);

        //Save the updated task list data to AsyncStorage
        AsyncStorage.setItem("tasks", JSON.stringify(updatedTaskList))
            .then(() => {
                console.log("Task removed and updated in AsyncStorage");
            })
            .catch(() => {
                console.error("Error updating AsyncStorage: ", error);
            })
    }

    const editTask = (index) => {
        setEditTaskIndex(index);

        setUpdatedTask({
            task: todolist[index].task,
            importance: todolist[index].importance,
        })
    }

    const addTask = async() => {
        if(task) {
            const newTask = {
                id: Date.now(),
                task: task,
                importance: importance,
                date: new Date().toLocaleString(),
            }

            try {
                //Get the current tasks from AsyncStorage
                const storedTasks = await AsyncStorage.getItem("tasks");
                const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

                //Update the tasks with the new task
                const updatedTasks = [...parsedTasks, newTask];

                //Save the updated tasks back to AsyncStorage
                await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

                //Update your global state using dispatch
                dispatch({type: "SET_TASK", payload: updatedTasks});

                //Reset state and show a success message
                setTask("")
                setImportance("General")

                Alert.alert("Task Successfully Added");
            } catch (error) {
                console.error("Error in saving task to AsyncStorage: ", error);
                Alert.alert("Failed to save task");
            }
        } else {
            Alert.alert("Error Adding Task To To Do List")
        }
    }

    const UpdateTheTask = async () => {
        if (editTaskIndex !== null) {
            if (updatedTask.task) {
                const updatedTaskList = [...todolist];
                updatedTaskList[editTaskIndex] = {
                    ...updatedTaskList[editTaskIndex],
                    task: updatedTask.task,
                    importance: updatedTask.importance,
                };
    
                try {
                    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTaskList));
                    dispatch({ type: "SET_TASK", payload: updatedTaskList });
    
                    // Reset the edit state
                    setEditTaskIndex(null);
                    setUpdatedTask({ task: "", importance: "General" });
    
                    Alert.alert("Task Successfully Updated");
                } catch (error) {
                    console.error("Error in updating task in AsyncStorage: ", error);
                    Alert.alert("Failed to update task");
                }
            } else {
                Alert.alert("Error Updating Task in To Do List");
            }
        }
    };
    

    return(
        <View style={styles.main}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding": null}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text style={styles.app_name}>..TOODALOO...</Text>
            </TouchableOpacity>
            
            <View style={styles.avatar_searchbar}>
                
                    <TextInput placeholder="Search for a task..." placeholderTextColor="black" style={styles.search} onChangeText={searchTask} value ={searchTerm} />

                <Image style={styles.avatar} source={require("../assets/lofi_girl.jpg")} resizeMode="cover" />
            </View>

            <View style={styles.form}>
                <Image style={styles.form_image} source={require("../assets/logo2.jpg")} resizeMode="contain" />

                <View style={{flexDirection: "column"}}>
                    <Text style={styles.heading}>Form</Text>

                    {editTaskIndex !== null ? (
                        <>
                        <TextInput style={styles.form_input} placeholder={task.task} placeholderTextColor="brown" value={updatedTask.task} onChangeText={(task) => setUpdatedTask({...updatedTask, task: task})} />

                        <View style={{flexDirection: "row"}}>
    
                            <TouchableOpacity onPress={(chooseImportance)}>
                            {importance === "General" ? (<View style={styles.general}></View>):
                                   (<View style={styles.urgent}></View>)}
                            </TouchableOpacity>
    
                            <TouchableOpacity style={styles.add_btn} onPress={UpdateTheTask}>
                                <Text style={styles.add_btn_text}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                    ) : (
                        <>
                        <TextInput style={styles.form_input} placeholder="Type your task here..." placeholderTextColor="brown" value={task} onChangeText={(text) => setTask(text)} />

                        <View style={{flexDirection: "row"}}>
    
                            <TouchableOpacity onPress={chooseImportance}>
                                    {importance === "General" ? (<View style={styles.general}></View>):
                                   (<View style={styles.urgent}></View>)}
                                
                            </TouchableOpacity>
    
                            <TouchableOpacity style={styles.add_btn} onPress={addTask}>
                                <Text style={styles.add_btn_text}>Add</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                    )}

                    
                </View>
            </View>

            <View style={styles.list}>
                <Image style={styles.list_image} source={require("../assets/list.jpg")} resizeMode="contain" />
                <Text style={styles.heading2}>List</Text>


                {filteredTask ? (
                    <View style={{marginBottom: 10, marginTop: 10, zIndex: 1, position: "absolute", top: 40, maxHeight: 330}}>
                        <View key={filteredTask.id} style={styles.task_card}>
                        <Text style={styles.task_text}>{filteredTask.task}</Text>

                        {filteredTask.importance === "Urgent" ? (<View style={styles.urgent}></View>): (<View style={styles.general}></View>)  }

                        <TouchableOpacity style={{marginLeft: 20, marginRight: 10}} onPress={() => editTask(index)}>
                            <Image style={styles.task_btn} source={require("../assets/edit.jpg")} resizeMode="contain" /> 
                        </TouchableOpacity>

                        <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={() => removeTask(index)}>
                            <Image style={styles.task_btn} source={require("../assets/trash.png")} resizeMode="contain" /> 
                        </TouchableOpacity>
                    </View>
                    </View>
                    ): (
                        <>
                        <ScrollView style={{marginBottom: 10, marginTop: 10, zIndex: 1, position: "absolute", top: 40, maxHeight: 330}}>
                

                {todolist.map((task, index) => (
                    <View key={task.id} style={styles.task_card}>
                    <Text style={styles.task_text}>{task.task}</Text>

                    {task.importance === "Urgent" ? (<View style={styles.urgent}></View>): (<View style={styles.general}></View>)  }

                    <TouchableOpacity style={{marginLeft: 20, marginRight: 10}} onPress={() => editTask(index)}>
                        <Image style={styles.task_btn} source={require("../assets/edit.jpg")} resizeMode="contain" /> 
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginLeft: 10, marginRight: 10}} onPress={() => removeTask(index)}>
                        <Image style={styles.task_btn} source={require("../assets/trash.png")} resizeMode="contain" /> 
                    </TouchableOpacity>
                </View>
                ))}
            </ScrollView>
                        </>
                    )}
            </View>

            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        marginTop: 20,
    },
    app_name: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "900",
        marginTop: 20,
        color: "pink",
        marginBottom: 10,
    },
    avatar: {
        width: "auto",
        height: 200,
        position: "relative",
    },
    avatar_searchbar: {
        width: "auto",
        height: 200,
    },
    search: {
        position: "absolute",
        backgroundColor: "white",
        color: "black",
        width: 300,
        height: 40,
        top: 2,
        zIndex: 1,
        borderRadius: 50,
        padding: 10,
        justifyContent: "center",
        fontSize: 16,
        fontWeight: "300",
        paddingLeft: 20,
    },
    form: {
        marginTop: 10,
        borderColor: "pink",
        borderStyle: "solid",
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 50,
        justifyContent: "center",
        padding: 10,
        flexDirection: "row",
    },
    list: {
        marginTop: 10,
        borderColor: "pink",
        borderStyle: "solid",
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 50,
        justifyContent: "center",
        padding: 10,
        flexDirection: "column",
        height: 400,
        marginBottom: 20,
    },
    form_image: {
        width: "25%",
        height: 90,
        borderRadius: 80,
        marginTop: 15,
    },
    form_input: {
        width: 250,
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 18,
        height: 40,
    },
    general: {
        backgroundColor: "green",
        height: 30,
        width: 30,
        borderRadius: 50,
        padding: 20,
        marginLeft: 15,
    },
    urgent: {
        backgroundColor: "red",
        height: 30,
        width: 30,
        borderRadius: 50,
        padding: 20,
        marginLeft: 15,
    },
    add_btn: {
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "brown",
        borderRadius: 50,
        padding: 10,
        justifyContent: "center",
        marginLeft: 50,
    },
    add_btn_text: {
        color: "brown",
        fontWeight: "700",
        fontSize: 16,
    },
    heading: {
        fontSize: 16,
        color: "brown",
        fontWeight: "800",
        textAlign: "center",
        justifyContent: "center",
    },
    heading2: {
        fontSize: 18,
        color: "white",
        fontWeight: "800",
        textAlign: "center",
        justifyContent: "center",
        zIndex: 1,
        position: "absolute",
        top: 10,
        left: 170,
    },
    task_card: {
        flexDirection: "row",
        borderWidth: 3,
        borderColor: "pink",
        borderRadius: 20,
        padding: 10,
        backgroundColor: "white",
        marginBottom: 10,
        marginLeft: 10,
    },
    task_btn: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    task_text: {
        fontSize: 16,
        width: 140,
        padding: 8,
        height: "auto",
        marginRight: 5,
    },
    list_image: {
        width: "100%",
        height: "102%",
        borderRadius: 50,
        position: "relative",
    }
});

export default ToDo;