import React,{useState ,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,LogBox,ToastAndroid,Alert } from 'react-native'
import Parse from "parse/react-native";
import { useNavigation } from '@react-navigation/core'
import { useDispatch } from 'react-redux';
import { setOrigin } from '../slices/navSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


async function logout(navigation)
{ 
    await Parse.User.logOut().catch((error)=>{console.log(error.message)})
    navigation.navigate("Login")
}


const Route = () => {
    LogBox.ignoreLogs(['Setting a timer'])

    
    const dispatch = useDispatch()
    const [userDetails, setUserDetails] = useState(String())
    const [userEmail, setEmail] = useState(String())
    const navigation = useNavigation()
  
    useEffect(async ()=>{
        let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))
        setUserDetails(userdata[0].Firstname +" "+userdata[0].Lastname)
        setEmail(userdata[0].Email)
    },[])



    //Back button blocking
    React.useEffect(
        () => 
            navigation.addListener('beforeRemove', (e) => {
            const action = e.data.action;
          
           if(action?.type === "GO_BACK")
           {
            e.preventDefault();
            
            Alert.alert(
              'Exit?',
              'Are you sure you would like to exit the application?',
              [
                { text: "Logout", style: 'default', onPress: () => {logout(navigation)} },
                { text: "Cancel", style: 'cancel', onPress: () => {} },
                { text: 'Exit',style: 'destructive',onPress: () => BackHandler.exitApp() },
              ]
            );
           }
           
          }),
        [navigation]
      );

    return (
        <View style={{justifyContent:"center",flex:1}}>
             <View style={styles.icon}>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Scan")}}>
                            <Image source={require('../assets/bus_wh48px.png')} style = {styles.iconProp}/>
                        </TouchableOpacity> 
            </View>
            <Text style={{alignSelf:"center",fontSize:25}}>Welcome {userDetails}</Text>
            <Text style={{alignSelf:"center",fontSize:18,marginTop:20}}>Let's start </Text>
            <Text style={{alignSelf:"center",fontSize:14,marginTop:1}}>Click the icon above </Text>
            <Text style={{alignSelf:"center",fontSize:22,marginTop:80}}>{userEmail} </Text>
        </View>
    )
}

export default Route

const styles = StyleSheet.create({
    iconProp:{
        alignSelf:"center",
    },
    icon:{
        backgroundColor:"black",
        width:200,
        height:200,
        alignSelf:"center",
        marginTop:0,
        justifyContent:"center",
        borderRadius:100,
        marginBottom:70
    },
})
