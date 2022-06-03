import React from 'react'
import { StyleSheet, Text, View,Image } from 'react-native'
import Parse from "parse/react-native";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core'



async function checkFile(navigation) {
    let creds = "";
    
   await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'myDirectory/myFile')
        .then((file) => {
            if(file[0] != "user.txt")
            {
                navigation.navigate("Login")
                return
            }
  
        })
        .catch((error) => {
            console.log("File Dire catch "+error.message) 
            navigation.navigate("Login")
            return
        })
    
    
    await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'myDirectory/myFile/user.txt')
        .then((data)=>{
            creds = JSON.parse(data)
            if(creds[0] == null || creds[1] == null)
            {
                navigation.navigate("Login")  
                return
            }
        
        })
        .catch((error)=>{
            navigation.navigate("Login")
            console.log("File string catch : "+error.message)
            return
        })
  
    if(creds[0] != "" || creds[1] != "")
    {
        await Parse.User.logIn(creds[0],creds[1])
            .then((logged)=>{
                console.log(logged.getEmail()+" : logged from file")
                navigation.navigate("HomeScreen")
            })
            .catch((error)=>{
                navigation.navigate("Login")
                if(error.message == 'XMLHttpRequest failed: "Unable to connect to the Parse API"')
                    console.log("Parse catch : "+"Connection problem")
                else
                    console.log("Parse catch : "+error.message)
                return
            })
    }

        
}

const Loading = () => {

    const navigation = useNavigation()

    Parse.setAsyncStorage(AsyncStorage);
    
    Parse.initialize('CtexUXpN7npKFkplH1zHEcskBqils5xjLNNQb3js', 'p6AiKgNxO5OEV4L9ELw8ug9EEzp60KEN6G0BNCkY');
    Parse.serverURL = 'https://parseapi.back4app.com'

    checkFile(navigation)


    return (
        <View style={{justifyContent:"center",flex:1,backgroundColor:"black"}}>
             <View style={styles.icon}>
                            <Image source={require('../assets/bus_bl48px.png')} style = {styles.iconProp}/>      
            </View>
            <Text style={{alignSelf:"center",color:"white"}}>•</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    iconProp:{
        alignSelf:"center",
        width:40,
        height:40,
    },
    icon:{
        backgroundColor:"white",
        width:130,
        height:130,
        alignSelf:"center",
        marginTop:0,
        justifyContent:"center",
        borderRadius:100,
        marginBottom:325
    },
})
