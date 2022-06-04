import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Alert,Vibration,ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { setTime } from '../../slices/navSlice';

import * as Notifications from 'expo-notifications';
import { DELETERequest} from './../../Request'
import { HOSTNAME } from '../../globals'





async function deleteTrip(id,setStatus)
{
    
    Vibration.vibrate(70)
    Alert.alert(
        'Warning',
        'Are you sure you would like to delete the Trip?',
        [
          { text: "Cancel", style: 'cancel', onPress: () => {return} },
          { text: 'Yes',style: 'destructive',onPress: () => {delConfirmed(id,setStatus)} },
        ]
      );   
}

async function delConfirmed(id,setStatus)
{
    let notifKeys
   
    let x = await DELETERequest(`${HOSTNAME}/Student/GetBooked?Busid=${id}`)

   
    if(!x.error)
    {
        setStatus("Deleted")
        ToastAndroid.show("Trip deleted successfully",500)
    }
        
}


const Trip = (props) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [status,setStatus] = useState(props.Status)

    async function currentTripPress()
    {
        
        navigation.navigate("QRCode")
        if(props.temp == 'T')
        {
            dispatch(setTime({"time" : props.time,"type" : "temp"}))
        }else{
            dispatch(setTime({"time" : props.time,"type" : "perm"}))
        }
        
    }
    const day = new Date().getDate();
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const busHr = String(props.time).substring(0,String(props.time).indexOf(":"))
    const busMin = String(props.time).substring(String(props.time).indexOf(":")+1,String(props.time).length)

    if((new Date(props.date).getDate()) < day || (new Date(props.date).getMonth()+1) < month || (new Date(props.date).getFullYear()) < year)
    {
        useEffect(()=>setStatus("Expired"))
    }

    if((new Date(props.date).getDate()) == day || (new Date(props.date).getMonth()+1) == month || (new Date(props.date).getFullYear()) == year)
    {
        if(Number(busHr) < hour)
        {
            useEffect(()=>setStatus("Expired"))
        }
        else if(Number(busHr) == hour && Number(busMin) < min)
        {
            useEffect(()=>setStatus("Expired"))
        }
        else if(Number(busHr) == hour && (Number(busMin)-5) <= min)
        {
            useEffect(()=>setStatus("Departing"))
        }
        
    }
   

    return (    
        <View style={styles.box}>
            <TouchableOpacity onLongPress={()=>{deleteTrip(props.id,setStatus)}} onPress={()=>{currentTripPress()}}>
            <Text style={styles.date}>Date : {new Date(props.date).getDate() +"/"+(new Date(props.date).getMonth()+1)+"/"+new Date(props.date).getFullYear() }
            {
                props.temp == 'T'?
                (
                    <Text style={{fontSize:13,color:"grey"}}>                               Temporally Trip</Text>
                )
                :
                null
            }
            
            
            </Text>
            <Text style={[styles.date,styles.details]}>Depureture : {props.depu}</Text>
            <Text style={[styles.date,styles.details]}>Destination : {props.dest}</Text>
            <Text style={[styles.date,styles.details,{fontSize:20}]}>Time : {props.time}</Text>
            {
                status == "Active" ?
                (
                    <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"green"}}>{status}</Text> </Text>
                )
                :
                status == "Expired" || status == "Deleted"?
                (
                    <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"red"}}>{status}</Text></Text>
                )
                :
                <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"orange"}}>{status}</Text></Text>
                
            }
            </TouchableOpacity>
            <Text style={[styles.date,styles.details,{alignSelf:"center",marginTop:30,paddingLeft:5,paddingRight:20,textAlign:"center"}]} >
                The booked token will expire after departure time of the bus
            </Text>
        </View >
    )
}

export default Trip

const styles = StyleSheet.create({
    box:{
        backgroundColor:"black",
        height:280,
        width:400,
        alignSelf:"center",
        marginTop:30,
        borderRadius:20,
        marginBottom:10
    },
    date:{
        color:"white",
        marginTop:40,
        marginLeft:20,
        fontSize:19,
        fontWeight:"700"
    },
    details:{
        fontWeight:"600",
        fontSize:14,
        marginTop:10,
    },
    deleteBox:{
        backgroundColor:"red",
        alignSelf:"flex-end",
        marginRight:50,
        marginBottom:-40,
        justifyContent:"center",
        height:50,
        width:50
    },
    deleteIcon:{
        height:30,
        width:30,
        alignSelf:"center"
    }
})
