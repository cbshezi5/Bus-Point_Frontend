//React Libraries Links
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,  Image, TouchableOpacity, LogBox, BackHandler,ToastAndroid,Alert } from 'react-native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { setDestination, setOrigin} from '../slices/navSlice';
import ManuButton from './components/ManuButton';
import { GETRequest } from './../Request'

//Homemade Libraries
import Header from './components/Header';

import { HOSTNAME } from '../globals'

//Custome Libraries
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';



function selectFunction(setSelectedCamp,valueSelected) { 
    setSelectedCamp(valueSelected)
}


//HomeScreen Main function
const HomeScreen = () => {
        //console.log("Homescreen on creation")
        LogBox.ignoreLogs(['Setting a timer'])
        
		const navigation = useNavigation();
        
        const dispatch = useDispatch();

        Location.installWebGeolocationPolyfill()
        const [selectedCamp, setSelectedCamp] = useState();
        const [selectedCamp2, setSelectedCamp2] = useState();
        const [fname, setFname] = useState(String(""))
        
        const [campuses, setCampuses] = useState([]);
        
        //Block Back

        useEffect(
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
                    { text: "Cancel", style: 'cancel', onPress: () => {} },
                    { text: 'Exit',style: 'destructive',onPress: () => BackHandler.exitApp() },
                  ]
                );
               }
               
              }),
            [navigation]
          );


       
            
      
        const [color, setColor] = useState(null)
        const [color2, setColor2] = useState(null)
        //DB

        function nextPassing(campOne,campTwo) {
          
            if(campOne != "default")
            {
                setColor2({color:"black"})
                if(campTwo != "default")
                {
                    setColor({color:"black"})
                    if(campOne != campTwo)
                    {
                        dispatch(
                            setDestination(campTwo)
                        )

                        dispatch(
                            setOrigin(campOne)
                        )
                        
                        navigation.navigate("Slots")
                        
                    }
                    else
                    {
                        setColor2({color:"red"})
                        setColor({color:"red"})
                        ToastAndroid.show("Same location are not allowed",ToastAndroid.LONG)
                    }
                }
                else
                {
                    setColor({color:"red"})
                    ToastAndroid.show("Destination not selected",ToastAndroid.LONG)
                }
            }
            else
            {
                setColor2({color:"red"})
                ToastAndroid.show("Depureture not selected",ToastAndroid.LONG)
            }
            
          
        }




        return (
            <View style={styles.inner}>
            <View style={{backgroundColor:"white"}}>
           
                
                <Header/> 

                 
               <TouchableOpacity  style={styles.iconHist}><Image source={require('../assets/client.png')} style = {styles.iconProp} /></TouchableOpacity>
				<Text style={styles.hist_txt}>Departure Terminal</Text>

                <Picker
                    style={[styles.pickers,color2]}
                    selectedValue={selectedCamp}
                    onValueChange={(itemValue, itemIndex) =>    
                        selectFunction(setSelectedCamp,itemValue)

                    }>
                        <Picker.Item label="Select a campus" value="default" />
                        <Picker.Item label={"Soshanguve South Campus"} value={"Soshanguve South Campus"} key={1}/>
                        <Picker.Item label={"Soshanguve North Campus"} value={"Soshanguve North Campus"} key={2}/>
                        <Picker.Item label={"Arcadia Campus"} value={"Arcadia Campus"} key={3}/>
                        <Picker.Item label={"Pretoria Campus"} value={"Pretoria Campus"} key={4}/>
                        <Picker.Item label={"Art Campus"} value={"Art Campus"} key={5}/>
                        <Picker.Item label={"Polokwane Campus"} value={"Polokwane Campus"} key={6}/>
                        <Picker.Item label={"Garankuwe Campus"} value={"Garankuwe Campus"} key={7}/> 
                </Picker>



				<TouchableOpacity style={styles.iconPromo}>
                    <Image source={require('../assets/client2.png')} style = {styles.iconProp} />
                </TouchableOpacity>
				<Text style={styles.disc_txt}>Destination Terminal</Text>

                <Picker
                     style={[styles.pickers,{width:270,marginLeft:-53,},color]}
                    selectedValue={selectedCamp2}
                    onValueChange={(itemValue, itemIndex) =>
                        selectFunction(setSelectedCamp2,itemValue)
                    }
                    
                    
                    >
                        
                        <Picker.Item label="Select a campus" value="default" />
                        <Picker.Item label={"Soshanguve South Campus"} value={"Soshanguve South Campus"} key={1}/>
                        <Picker.Item label={"Soshanguve North Campus"} value={"Soshanguve North Campus"} key={2}/>
                        <Picker.Item label={"Arcadia Campus"} value={"Arcadia Campus"} key={3}/>
                        <Picker.Item label={"Pretoria Campus"} value={"Pretoria Campus"} key={4}/>
                        <Picker.Item label={"Art Campus"} value={"Art Campus"} key={5}/>
                        <Picker.Item label={"Polokwane Campus"} value={"Polokwane Campus"} key={6}/>
                        <Picker.Item label={"Garankuwe Campus"} value={"Garankuwe Campus"} key={7}/>
                </Picker>
                <TouchableOpacity style={styles.iconPromo3} onPress={()=>{nextPassing(selectedCamp,selectedCamp2,color,color2)}}><Image source={require('../assets/play_100px.png')} style = {styles.iconProp3} /></TouchableOpacity>
                
                <ManuButton/>
                
                <Text style={styles.inst_map}>Arrive in time{fname}</Text>
                <Text style={styles.inst_map2}>Please make sure you arrive 20min before the depureture time of your booked bus</Text>
                <Text style={styles.inst_map3}>Stay safe always mask up</Text>
                <TouchableOpacity style={styles.iconPromo2} ><Image source={require('../assets/mask_emoji_128px.png')} style = {styles.iconProp} /></TouchableOpacity>

            </View>
            </View>
        )
   
}

export default HomeScreen;



const styles = StyleSheet.create({
    inner: {    
        flex: 1,
        justifyContent:"center"
      },
  
    iconProp:{
        height: 40, 
        width: 40, 
        resizeMode : 'stretch',
    },
	iconHist:{
		alignSelf:"center",
        marginTop:35,
		marginLeft:-295
	},
	iconPromo:{
		alignSelf:"center",
		marginTop:15,
		marginLeft:-290
	},
	hist_txt:{
		alignSelf:"center",
		marginLeft:-50,
		marginTop:-29,
        fontSize:19,
	},
	disc_txt:{
		alignSelf:"center",
		marginLeft:-50,
		marginTop:-29,
        fontSize:17,
	},
    inst_map:{
        alignSelf:"center",
        marginTop:160,
        fontSize:40,
        fontWeight:"600",
    },
    inst_map2:{
        marginLeft:20,
        marginRight:20, 
        fontSize:13,
        
    },
    inst_map3:{
        marginTop:34,
        marginLeft:50,
        marginRight:20, 
        fontSize:23,
        
    },
    iconPromo2:{
        marginTop:-33,
        alignSelf:"flex-end",
        marginRight:54,
        marginBottom:100,
    },
    pickers:
    {
        backgroundColor:'whitesmoke',
        width:330,
        alignSelf:"center",
        marginTop:23,
        color:"black"
    },
    iconPromo3:{
        marginBottom:-50,
        backgroundColor:'whitesmoke',
        width:50,
        height:55,
        justifyContent:"center",
        marginTop:-55,
        alignSelf:"flex-end",
        marginRight:50,
        
    },
    iconProp3:{
        alignSelf:"center",
        width:20,
        height:20,
    }

   
})

