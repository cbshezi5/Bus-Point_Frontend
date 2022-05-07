import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View ,TouchableOpacity,ScrollView,Image} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import SlotRender from './components/SlotRender';
import { useSelector } from 'react-redux';
import { selectDestination,selectOrigin } from '../slices/navSlice';
import { db } from '../firebase-config';
import { onSnapshot,collection,query,where,addDoc } from "firebase/firestore"



const Slots = () => {
    const [showCalender, setShowCalender] = useState(false)
    const [date, setDate] = useState(new Date());
    const [dateTittle,setDateTittle] = useState('Today')
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const [slot, setSlots] = useState([]);
    let elementIndex = 0;

    let slotID
    let slotTP
    
    let dateMax = new Date(); 
    let current = new Date();
    dateMax.setDate(dateMax.getDate() + 2)

    function showDatePicker(){
        setShowCalender(true)
        //addDoc(collection(db,"Slot"),myJSON)
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowCalender(Platform.OS === 'ios');
        setDate(currentDate);
        switch (currentDate.getDate() - current.getDate()) {
            case 0:
                setDateTittle('Today')
                break;
            case 1:
                setDateTittle('Tomorrow')
                break;
            case 2:     
                switch (currentDate.getDay()) {
                    case 0:
                        setDateTittle("Sunday")
                        break;
                    case 1:
                        setDateTittle("Monday")
                        break;
                    case 2:
                        setDateTittle("Tuesday")
                        break;
                    case 3:
                        setDateTittle("Wesnday")
                        break;
                    case 4:
                        setDateTittle("Thusday")
                        break;
                    case 5:
                        setDateTittle("Friday")
                        break;
                    case 6:
                        setDateTittle("Saturday")
                        break;
                }
                break;
        }
      
      };

      const [requestState, setRequestState] = useState("Loading...")
      const [secs, setSecs] = useState(0)
  
      useEffect(() => {
         
          const interval = setInterval(()=>{

              if(secs == 0)
              {
                  setRequestState("Checking Buses Please wait...")
              }
  
              if(secs == 2)
              {
                  setRequestState("Loading...")
              }
              if(secs > 3)
              {
                  setRequestState("No slot were loading for today or There's no route from your campuses")
                  return () => clearInterval(interval)
              }  
              setSecs(secs + 1)
          },5000);
          return () => clearInterval(interval)
          
      })
                 
        const dateFormated = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
      //DB  
      useEffect(
        () => 
        onSnapshot(
            query(
                collection(db,"Slot"),
                where('Date','==', dateFormated),
                ), 
                (snapshot) => 
                    setSlots(
                        snapshot
                        .docs
                        .filter((doc) => doc.get("From") == origin)
                        .filter((doc) => doc.get("To") == destination)
                        .map(doc => ({
                            ...doc.data(), 
                            id : doc.id
                        }))
                    ) 
                )
            , 
        [dateFormated]
    );
        
      //DB
    return (
        <View style={{backgroundColor:"white",flex:1,justifyContent:"flex-end"}}>
            <View style={styles.calender}>
                <TouchableOpacity 
                    onPress={()=>{showDatePicker()}}
                >
                    <Text style={styles.DaySlot}>{dateTittle} Slots</Text>
                    <Text style={styles.Day}>{date.getDate()}/{date.getUTCMonth()+1}/{date.getFullYear()}</Text>
                    <Text style={styles.Instr}>From {origin} To {destination}</Text>
                </TouchableOpacity >
            </View>

            {showCalender && (
                <DateTimePicker
                style={styles.calenderColor}
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="default"
                minimumDate={new Date()}
                maximumDate={dateMax}
                onChange={onChange}
                />
            )}
            
            {date.getDay() == 6 || date.getDay() == 0 ? (
                <View style={styles.noBus}>
                    <TouchableOpacity style={styles.iconPromo2}><Image source={require('../assets/bus_48px.png')} style = {styles.iconProp} /></TouchableOpacity>
			 
                    <Text style={styles.messge}>Buses are not avaliable during weekends</Text>
                </View>
            )
            :
            !slot[0] ?(
                <View style={styles.noBus}>
                    <TouchableOpacity style={styles.iconPromo2}><Image source={require('../assets/bus_bl48px.png')} style = {styles.iconProp} /></TouchableOpacity>
			 
                    <Text style={[styles.messge,styles.noBusMes]}>{requestState}</Text>
                </View>
            )   
            :
                    <ScrollView style={styles.scrollView}>
                    {
                        slotID = slot[0]?.id,
                        slotTP = slot[0]?.typeSlot,
                        slot[0]?.Slot.map((e_slot) => {  
                                elementIndex = (elementIndex + 1)
                                return  (<SlotRender busNum={e_slot.Bus} 
                                                     time={e_slot.Time} 
                                                     avalSpace={e_slot.Space}  
                                                     key={e_slot.Time} 
                                                     date={dateFormated} 
                                                     id={slotID} 
                                                     index={elementIndex}
                                                     slotType={slotTP}/>)               
                        })        
                    }
                    </ScrollView>
            }
        </View>
    )
}

export default Slots

const styles = StyleSheet.create({
    calender:{
        backgroundColor:'whitesmoke',
        width:400,
        height:90,
        alignSelf:"center",
        marginTop:40,
    },
    DaySlot:{
        alignSelf:"center",
        fontSize:27,
        marginTop:2,
        fontWeight:"700",
    },
    Day:{
        alignSelf:"center",
        fontSize:14,
    },
    Instr:{
        fontSize:12,
        alignSelf:"center",
        marginTop:9,
    },
    scrollView:{
        marginTop:12,
        height:750,

    },
    calenderColor:{
        color:"black"
    },
    noBus:{
        alignContent:"center",
        flex:1,
        justifyContent:"center"
    },
    iconPromo2:{
        alignSelf:"center"
    },
    messge:{
        marginTop:30,
        alignSelf:"center",
        fontSize:16,
        color:"grey",
    },
    noBusMes:{
        fontSize:20,
        color:"black",
        paddingLeft:40,
        paddingRight:40
    }
})
