import React,{useState} from 'react'
import { StyleSheet, Text, View,Vibration,TouchableOpacity,Share } from 'react-native'
import { QRCode as CustomQRCode } from 'react-native-custom-qr-codes-expo';
import { selectStNumber,selectTime,selectDestination,selectOrigin } from '../slices/navSlice';
import { useSelector } from 'react-redux';


const onShare = async (vals,origin,destination) => {
   
      try {
        const result = await Share.share({
          message:
            'I am leaving at '+vals.time+' on '+vals.date+' from '+origin+" to "+destination+" .Download Bus Point www.nextstep.com/bus-point",
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
};

const QRcode = () => {
    const time = useSelector(selectTime)
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const stNumber = useSelector(selectStNumber)
    const [valueKey, setValueKey] = useState(String(stNumber))
    const stNumberPad = String(stNumber).substring(0,6) +" • • •"
    
    Vibration.vibrate(50)
    return (
        <View style={{backgroundColor:"white",flex:1}}>
            <Text style={styles.tittle}>Scan</Text>
            <Text style={styles.instr}>Your driver will require your student number or this QR code for you to board the bus</Text>
            <Text style={styles.inst2}>• Please make sure you arrive 15min before your depureture time</Text>
            <Text style={styles.inst2}>• If you dont arrive in time on the bus the QR Code will expire on {time.time} which is your time to depureture</Text> 
            <View style={styles.QRHome}>
                <View style={styles.cover}>
                {valueKey && time.type != 'temp'?
                (
                    <TouchableOpacity onPress={()=>{onShare(time,origin,destination)}}>
                    <CustomQRCode 
                        codeStyle='circle'
                        content={valueKey}   
                    />
                    </TouchableOpacity>
                )
                    :
                    <Text>Temporally (Trip)token will get QR code when it's becomes permanent</Text>
                }
                
                </View> 
            </View>
            <Text style={styles.stNumber}>{stNumberPad}</Text> 
        </View>
    )
}

export default QRcode

const styles = StyleSheet.create({
    tittle:{
        alignSelf:"center",
        marginTop:50,
        fontSize:60
    },
    QRHome:{
        justifyContent:"center",
        height:900,
        alignItems:"center", 
    },
    cover:{
        paddingBottom:55,
        paddingLeft:55,
        paddingTop:55,
        paddingRight:55,
        borderRadius:200,
        borderColor:"black",
        borderWidth:7,
        marginTop:-400
    },
    instr:{
        marginBottom:-1,
        paddingLeft:30,
        paddingRight:30,
    },
    stNumber:{
        fontSize:20,
        marginTop:-400,
        alignSelf:"center",
        fontWeight:"700"
    },
    inst2:{
        marginTop:20,
        paddingLeft:30,
        paddingRight:30,
    }
})
