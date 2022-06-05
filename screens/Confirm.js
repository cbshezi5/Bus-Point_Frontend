import React,{useState,useEffect, useRef} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ToastAndroid,Vibration,LogBox, Platform,Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectDestination,selectOrigin,selectTime,setStNumber,selectStNumber,selectFirstName,selectLastName,setMusic } from '../slices/navSlice';
import { onSnapshot,collection,query,where,addDoc,updateDoc,doc,getDocs } from "firebase/firestore"
import { useDispatch } from 'react-redux';
import { db } from '../firebase-config';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { POSTRequest } from './../Request'
import { HOSTNAME } from '../globals'
import AsyncStorage from '@react-native-async-storage/async-storage';


const message = "By Confirming you will be"+
" booking the bus and you won't be able to book"+
" again until you have used your trip token if its" +
" expires also you will be unlocked to book again."+
" If your have a temp trip your can book "

//Notification Handler settings
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

//Funtion for registration of notification expo token
async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Token substribed successfully");
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
}

   //Trigger the notification
async function schedulePushNotification(fname,lname,schedule) {
    let tripDateTimeStamp = schedule.date.split("-")[2]+"-"+schedule.date.split("-")[1]+"-"+schedule.date.split("-")[0]+" "+schedule.time+":00"
    
    let toTimeDate = calculateTimeNotifcation(tripDateTimeStamp)
    let message =""

    //check for the day
    if(toTimeDate.dy != 0)
    {
        if(toTimeDate.dy == 1)
        {
            message += toTimeDate.dy+" day "
        }
        else
        {
            message += toTimeDate.dy+" days "
        }   
    }
    //check for the hours
    if(toTimeDate.hr != 0)
    {
        if(toTimeDate.hr == 1)
        {
            message += toTimeDate.hr+" hour "
        }
        else
        {
            message += toTimeDate.hr+" hours "
        } 
    }
    //check for the mins
    if(toTimeDate.mn != 0)
    {
        if(toTimeDate.mn == 1)
        {
            message += toTimeDate.mn+" minute "
        }
        else
        {
            message += toTimeDate.mn+" minutes "
        } 
    }

    const notificationOne = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Arrive in time",
          body: ''+fname+' '+lname+' your bus will depater in '+message,
        },
        trigger:  {seconds:5},
      });
      
    //

      const notificationTwo = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Arrive in time",
        body: ''+fname+' '+lname+' your bus will depater in 10 minutes from now',
      },
      trigger:  {seconds:((toTimeDate.dy * 86400) + (toTimeDate.hr * 3600) + (toTimeDate.mn * 60)) - (60 * 10)},
    });
    

    //
    const notificationThree = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Arrive in time",
          body: ''+fname+' '+lname+' your bus will depater in 30 minutes from now',
        },
        trigger:  {seconds:((toTimeDate.dy * 86400) + (toTimeDate.hr * 3600) + (toTimeDate.mn * 60)) - (60 * 30)},
      });
    

    //
    const notificationFour = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Arrive in time",
          body: ''+fname+' '+lname+' your bus will depater in a hour from now',
        },
        trigger:  {seconds:((toTimeDate.dy * 86400) + (toTimeDate.hr * 3600) + (toTimeDate.mn * 60)) - (60 * 60)},
      });
     
      //
      return [notificationOne,notificationTwo,notificationThree,notificationFour]
}

function calculateTimeNotifcation(tripTime)
{
    let dateStr = tripTime

    let date_diff = new Date(new Date(dateStr.replace(/-/g,'/')) - new Date())
    let hours = (date_diff.getHours() - 2)
    let minutes = date_diff.getMinutes()
    let days = (date_diff.getDay() - 4)
    
    return ({dy:days,hr:hours,mn:minutes})
}

const Confirm = () => {
    LogBox.ignoreLogs(["TypeError: undefined is not a function (near '...Slots...')"])
    const navigation = useNavigation()

    //Selectors
    const time = useSelector(selectTime)
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const FirstName = useSelector(selectFirstName)
    const LastName = useSelector(selectLastName)

    //Notification sub value
    

    const [trip, setTrip] = useState([]);
    const[tripTemp, setTripTemp] = useState([])
    const [loadingShow, setLoadingShow] = useState(false)
    const dispatch = useDispatch()
    let loadState = "undone"
    const studentNum = useSelector(selectStNumber)

    //Notification Handle Variable
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    //

    //Notification Token Registration
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);
      //Notifi end
    
   

 

    const  qrScreen = async ()  =>
    {
        let day =  String(time.date).substring(0,String(time.date).indexOf('-'))
        let mon = String(time.date).substring(String(time.date).indexOf('-')+1,String(time.date).lastIndexOf('-'))
        let yr = String(time.date).substring(String(time.date).lastIndexOf('-')+1,String(time.date).length)
        console.log(time.id)
        let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))
        let x = await POSTRequest(`${HOSTNAME}/Student/Book`,{
            "Studentid":userdata[0].Studentid,
            "Scheduleid":time.id,
            "ori":origin,
            "dest":destination,
            "time":time.time,
            "date":`${yr}-${mon}-${day}`
        })
        
        if(x?.error)
        {
            Vibration.vibrate(70)
            ToastAndroid.show(x.message,ToastAndroid.LONG)
            return
        }
        dispatch(setMusic(time.id))
        navigation.navigate("QRCode")
    }

    return (
        <View style={{backgroundColor:"white",flex:1}}>
            <Text style={styles.tittle}>Confirm</Text>
            <Text style={[styles.tittle,{marginTop:23,fontSize:19,paddingRight:50,paddingLeft:50}]}>Are you sure you would like to book the bus ?</Text>
            <Text style={styles.details}>Depurting at {time.time}</Text>
            <Text style={[styles.details,{marginTop:7,marginBottom:50}]}> {time.date}</Text>
            <View style={styles.trip}>
                <Text style={styles.road}>From : {origin}</Text>
                <Text style={styles.road}>To : {destination}</Text>
            </View>
            <Text style={styles.road2}>{message}</Text>
            
            { loadingShow ?
                (
                    <Image style={{width:80,height:80,alignSelf:"center",marginTop:40}} source={require("../assets/loader.gif")}/>
                )
                :
                <View>
                    <Text style={{alignSelf:"center",marginTop:80,marginBottom:-53}}>Double click to cornfirm</Text>
                        <TouchableOpacity style={[styles.btnYes,{}]} onPress={()=>{qrScreen()}}>
                            <Text style={{alignSelf:"center",fontSize:19}}>Yes</Text>
                        </TouchableOpacity>
                </View>
            }
            
        </View>
    )
}

export default Confirm

const styles = StyleSheet.create({
    tittle:{
        alignSelf:"center",
        marginTop:100,
        fontSize:50,
    },
    details:{
        marginTop:23,
        alignSelf:"center",
        fontSize:17
    },
    road:{
        alignSelf:"center",
        fontSize:20,
        color:"white",
        fontWeight:"700"
    },
    road2:{
        marginTop:100,
        paddingLeft:40,
        paddingRight:40
    },
    trip:{
        backgroundColor:"black",
        height:70,
        justifyContent:"center",
        width:360,
        alignSelf:"center"
    },
    btnYes:{
        alignSelf:"center",
        marginTop:60,
        borderColor:"black",
        borderWidth:2,
        width:200,
        height:50,
        justifyContent:"center",
        borderRadius:23
    }
})
