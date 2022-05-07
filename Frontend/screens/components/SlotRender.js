import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { setTime } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';



const SlotRender = (props) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [disableColor, setDisableColor] = useState("black")
    const [disabledVal, setDisabledVal] = useState(null)

     

    const [current, setcurrent] = useState(new Date()) ;
    const [minCur, setminCur] = useState(Number(current.getMinutes())) ;
    const [hrCur, sethrCur] = useState(Number(current.getHours())) ;

    const [minTrp, setminTrp] = useState(Number(props.time.substr(props.time.indexOf(":")+1,props.time.length)));
    const [hrTrp, sethrTrp] = useState(Number(props.time.substr(0,props.time.indexOf(":"))));

    const [dayCur,setDayCur] = useState(current.getUTCDate()+"-"+(current.getMonth()+1)+"-"+current.getFullYear())
  
    const [message, setMessage] = useState(props.busNum + " bus depurting");
    const [seatMessage, setSeatMessage] = useState() ;
 

    let isTemp = false;

    const totalBusSpace = 45
    
        useEffect(async ()  => {


                    if(props.avalSpace == 0)
                    {
                        setSeatMessage("No seat left u can book as a temp")
                    }

                    if(props.avalSpace > 0 && props.avalSpace < 11)
                    {
                        setSeatMessage("Fast book your self, seat low")
                    }

                    if(props.avalSpace > 10 && props.avalSpace < 21)
                    {
                        setSeatMessage("Still fare seat available")
                    }

                    if(props.avalSpace > 20)
                    {
                        setSeatMessage("Early bird catches the worm")
                    }

                    if(props.busNum > 1 && props.avalSpace > totalBusSpace/2 && hrCur <= hrTrp)
                    {
                        setSeatMessage("Temp book currently  ⚠️");
                        setDisableColor("grey");
                        isTemp = true;
                        setMessage(props.busNum + " bus depurting");
                        return
                        
                    }

                    //---------------------------------------------Getting Slot Type-------------------------------------------------
                    if(props.slotType == 1)
                    {
                    //Config of a hour bounce
                        if((minCur >= minTrp) && (hrCur >= hrTrp) && (Number(props.date.split("-")[0]) === Number(dayCur.split("-")[0])))
                        {
                            setDisableColor("lightgrey")
                            setDisabledVal(true)
                            setMessage("Bus already gone")
                            setSeatMessage("Bus is already gone slot expired")
                            return
                        }
                        else
                        {
                            setDisableColor("black")   //Problem
                            setDisabledVal(false)
                            setMessage(props.busNum + " bus depurting")
                            setSeatMessage("Early bird catches the worm")
                        }

                        if((hrTrp - hrCur === 1) && props.date == dayCur)
                        {
                            setDisableColor("green")
                            if((hrTrp - hrCur === 1) &&  (minCur > 40) && props.date == dayCur)
                            {
                                setDisableColor("orange")
                                if(hrTrp - hrCur === 1 &&  minCur > 55 && props.date == dayCur)
                                {
                                    setDisableColor("red")
                                    setMessage("Locked too late")
                                    setSeatMessage("You are too late too book this bus")
                                    setDisabledVal(true)
                                }
                            }
                            return
                        }
                    }
                    //---------------------------------------------Getting Slot Type-------------------------------------------------
                    if(props.slotType == 3)
                    {
                    //Config of a 15min bounce
                        if(Number(props.date.split("-")[0]) === Number(dayCur.split("-")[0]))
                        {
                            if(hrCur > hrTrp )
                            {
                                setDisableColor("lightgrey")
                                setDisabledVal(true)
                                setMessage("Bus already gone")
                                setSeatMessage("Bus is already gone slot expired")
                                return
                            }
                            if(hrCur == hrTrp && minCur >= minTrp)
                            {
                                setDisableColor("lightgrey")
                                setDisabledVal(true)
                                setMessage("Bus already gone")
                                setSeatMessage("Bus is already gone slot expired")
                                return
                            }  
                        }
                        else
                        {
                            
                            setDisableColor("black")   //Problem
                            setDisabledVal(false)
                            setMessage(props.busNum + " bus depurting")
                            setSeatMessage("Early bird catches the worm")  
                        }
                        //Differnt state of 15min

                        if((minTrp - minCur <= 15) && (hrTrp == hrCur) && props.date == dayCur)
                        {
                            setDisableColor("green")
                            if((minTrp - minCur <= 5) && (hrTrp == hrCur) && props.date == dayCur)
                            {
                                setDisableColor("orange")
                                if((minTrp - minCur <= 1) && (hrTrp == hrCur) && props.date == dayCur)
                                {
                                    setDisableColor("red")
                                    setMessage("Locked too late")
                                    setSeatMessage("You are too late too book this bus")
                                    setDisabledVal(true)
                                    
                                }
                            }
                            return
                        }

                        //Control of inclusive of the currentHour
                        if(hrTrp - hrCur === 1 && minTrp == 0 && minCur > 44 && props.date == dayCur)
                        {
                            setDisableColor("green")
                            if(hrTrp - hrCur === 1 && minTrp == 0 && minCur > 50 && props.date == dayCur)
                            {
                                setDisableColor("orange")
                                if(hrTrp - hrCur === 1 && minTrp == 0 && minCur > 57 && props.date == dayCur)
                                {
                                    setDisableColor("red")
                                    setMessage("Locked too late")
                                    setSeatMessage("You are too late too book this bus")
                                    setDisabledVal(true)
                                    
                                }
                            }
                            return
                        }
                        
                    }
            
        }, [props.date,props.busNum])
    

    

    function timeClicked()
    {
        
       if(disableColor == "grey")
       {
            dispatch(setTime({"time" : props.time,"date" : props.date,"space":props.avalSpace,"id":props.id,"index":props.index,"type":"temp"}))
       }
       else
       {
            dispatch(setTime({"time" : props.time,"date" : props.date,"space":props.avalSpace,"id":props.id,"index":props.index,"type":"perm"}))
       }
        navigation.navigate("Confirm")
    } 
    

    return ( 
            <View style={{marginBottom:20}}>
                <TouchableOpacity style={[styles.button,{backgroundColor:disableColor}]} onPress={()=>{timeClicked()}} disabled={disabledVal}>
                    <Text style={styles.btnText}>{props.time} • {props.avalSpace} avaliable spaces</Text>
                </TouchableOpacity>
                <Text style={styles.busCount}>{message}</Text>
                <Text style={styles.capacity}>{seatMessage}</Text>
            </View>
    )
}

export default SlotRender

const styles = StyleSheet.create({
    button:{
        backgroundColor:"black",
        width:200,
        height:50,
        justifyContent:"center",
        marginLeft:16,
        borderRadius:30,
        marginTop:30,
    },
    btnText:{
        color:"white",
        alignSelf:"center",
    },
    busCount:{
        marginTop:-45,
        marginLeft:229,
        fontSize:17,
        fontWeight:"700"
    },
    capacity:{
        marginTop:3,
        marginLeft:229,
        fontSize:12,
    }

})
