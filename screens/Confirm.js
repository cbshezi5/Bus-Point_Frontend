import React,{useState} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ToastAndroid,Vibration,LogBox, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectDestination,selectOrigin,selectTime,selectStNumber,selectFirstName,selectLastName,setMusic } from '../slices/navSlice';
import { UploadingImg_Modal } from './components/UploadModal'
import { useDispatch } from 'react-redux';
import { POSTRequest } from './../Request'
import { HOSTNAME } from '../globals'
import AsyncStorage from '@react-native-async-storage/async-storage';


const message = "By Confirming you will be"+
" booking the bus and you will be able to book 2 times"+
" again until you have used your trip token if its" +
" expires also you will be unlocked to book again."+
" You can ask your admin for a change of potrait "

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
    const [modalVisible,setModalVisible] = useState(false)
    const [Studentid,setStudentid] = useState(false)
   
   

 

    const  qrScreen = async ()  =>
    {
        let formdata = new FormData();
        let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))
        setStudentid(userdata[0].Studentid)

        let y 
        formdata.append("Studentid", userdata[0].Studentid)
        //-------------------------FORM DATA REQ -------------------------------
       await fetch(`${HOSTNAME}/Student/Upload`,{method: 'post',headers: { Accept: "application/json",'Content-Type': 'multipart/form-data'},body: formdata})
       .then((response) => response.json())
             .then((responseJson) => {
              y = responseJson
        })   
       .catch((err) => {
              console.log(err)
        })  
       
            
        if(y.error)
        {
            Vibration.vibrate(70)
            setModalVisible(true)
        }

        if(!y.error)
        {
          let day =  String(time.date).substring(0,String(time.date).indexOf('-'))
          let mon = String(time.date).substring(String(time.date).indexOf('-')+1,String(time.date).lastIndexOf('-'))
          let yr = String(time.date).substring(String(time.date).lastIndexOf('-')+1,String(time.date).length)
         
          
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
            <UploadingImg_Modal setModalVisible={setModalVisible} modalVisible={modalVisible} Studentid={Studentid}/>
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
