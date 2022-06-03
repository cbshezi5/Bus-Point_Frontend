import React,{useEffect,useState} from 'react'
import { StyleSheet, Text, View,ScrollView } from 'react-native'
import Trip from './components/Trip'
import { selectStNumber } from '../slices/navSlice'
import { useSelector } from 'react-redux'
import { db } from '../firebase-config';
import { onSnapshot,collection,query,where,orderBy} from "firebase/firestore"





const CurrentTrip = () => {
    const studentNumber = useSelector(selectStNumber)
    const [trip, setTrip] = useState([])

    
    if(studentNumber != "null")
    {
        useEffect(
            () => 
            onSnapshot(
                query(
                    collection(db,"Trip"),
                    orderBy("No","desc"),
                    ), 
                    (snapshot) => 
                        setTrip(
                            snapshot
                            .docs
                            .filter((doc)=>doc.get("StudentNumber") == studentNumber)
                            .map(doc => ({
                                ...doc.data(),  
                                id : doc.id
                            }))
                        ) 
                    )
                , 
            []
        );

    }

    return (
        <View style={styles.tittleHeard}>
            <View style={styles.tittleBox}>
                <Text style={styles.tittle}>Current Trip </Text>
                <Text style={styles.subTittle}>Click on the trip to open the QR code</Text>
            </View>
            <ScrollView style={{marginTop:12}}>
                {
                    trip?.map((tripJson)=>{
                        return(<Trip 
                            date={tripJson.Date} 
                            dest={tripJson.To} 
                            depu={tripJson.From} 
                            time={tripJson.Time} 
                            key={tripJson.id}
                            Status={tripJson.Status} 
                            id={tripJson.id}
                            temp ={tripJson.Temporally}/>)
                    })
                }
                
            </ScrollView>
        </View>
    )
}

export default CurrentTrip

const styles = StyleSheet.create({
    tittleHeard:{
        flex:1,
        backgroundColor:"white"
    },
    tittle:{
        alignSelf:"center", 
        paddingTop:10,
        paddingRight:90,
        paddingLeft:90,
        paddingBottom:5,
        fontSize:40,
        marginTop:50
    },
    tittleBox:{
        backgroundColor:"whitesmoke",
        alignSelf:"center",
    },
    subTittle:{
        alignSelf:"center",
        marginBottom:15,
    }

})
