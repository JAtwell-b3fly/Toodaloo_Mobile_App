import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
    const navigation = useNavigation();

    return(
        <View style={styles.main}>
            <Text style={styles.app_name}>...TOODALOO...</Text>

            <Image style={styles.logo} source={require("../assets/logo.jpg")} resizeMode="contain" />

            <View style={styles.options}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ToDo")}>
                    <Text style={styles.btn_text}>Lets Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    app_name: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "900",
        marginTop: 20,
        color: "pink",
    },
    logo: {
        width: "100%",
        height: 470,
    },
    options: {
        width: "auto",
        height: 150,
        marginTop: 50,
        marginBottom: 50,
        justifyContent: "center",
    },
    btn: {
        borderStyle: "solid",
        borderWidth: 4,
        borderColor: "pink",
        borderRadius: 50,
        width: 300,
        height: 100,
        padding: 10,
        marginBottom: 30,
        justifyContent: "center",
        marginLeft: 50,
    },
    btn_text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "orange",
        textAlign: "center",
    }
});

export default Splash;