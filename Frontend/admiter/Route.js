import React,{useState ,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,LogBox,ToastAndroid,Alert } from 'react-native'
import Parse from "parse/react-native";
import { useNavigation } from '@react-navigation/core'
import { db } from '../firebase-config';
import { collection,query,getDocs } from "firebase/firestore"
import { useDispatch } from 'react-redux';
import { setOrigin } from '../slices/navSlice';

async function getUserDet(setUserDetails) {
    await Parse.User.currentAsync()

    .then((loggedInUser)=>{
        setUserDetails(loggedInUser.get("firstName")+" "+loggedInUser.get("lastName"))   
    })
    .catch((error)=>{
        console.log(error.message)
        ToastAndroid.show("Sorry we couldn't get your details",500)
    }) 
}

async function logout(navigation)
{ 
    await Parse.User.logOut().catch((error)=>{console.log(error.message)})
    navigation.navigate("Login")
}


const Route = ({ route }) => {
    LogBox.ignoreLogs(['Setting a timer'])

    
    const dispatch = useDispatch()
    const [userDetails, setUserDetails] = useState(String())
    const [userRouteWay, setRouteWay] = useState()
    
    const navigation = useNavigation()
    const { username } = route.params;
    let driverDet;

    getUserDet(setUserDetails)
    

    
    
    useEffect( async () =>
            await getDocs(
                query(collection(db,"Driver")))
                .then((data)=>
                {   
                    driverDet = data.docs 
                        .filter((doc) => doc.get("StuffNumber") == String(username))
                        .map(doc=> ({
                            To : doc.get('To'),
                            From : doc.get('From')
                    }))
                    setRouteWay({"From":driverDet[0]?.From,"To":driverDet[0]?.To})
                    dispatch(setOrigin({From:driverDet[0]?.From,To:driverDet[0]?.To}))
                   
                }).catch((error)=>{
                    console.log(error.message)
                }) 
    , [])

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
            <Text style={{alignSelf:"center",fontSize:22,marginTop:80}}>You are driving the route </Text>
            <Text style={{alignSelf:"center",fontSize:18,marginTop:5,marginBottom:-19}}>{userRouteWay?.From}</Text>
            <Text style={{alignSelf:"center",fontSize:40,marginTop:5}}>•</Text>
            <Text style={{alignSelf:"center",fontSize:18,marginTop:-15}}>{userRouteWay?.To}</Text>
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
