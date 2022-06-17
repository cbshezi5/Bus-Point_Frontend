import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, LogBox,TouchableOpacity,BackHandler,Alert,Vibration,Image,ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/core';
import { useDispatch,useSelector } from 'react-redux';
import { setStNumber,setMusic,selectStNumber,selectMusic,selectOrigin } from '../slices/navSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PUTRequest,POSTRequest } from '../Request'
import { HOSTNAME } from '../globals'
 
async function getUserDet(setUserDetails,setUserMeta,setUsername) {
    let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))
    setUserDetails(userdata[0].Firstname +" "+userdata[0].Lastname)
    setUserMeta(userdata[0].Email)
    setUsername(userdata[0].Email)
}

const doUserQuery = async function (studentNumber,dispatch,setStNumber,route,setO,setD,setT,setTColor,setAcces) {

  let arrayVal;
  let curDate = new Date()
  let tripToken;
  curDate = curDate.getDate()+"-"+(curDate.getMonth()+1)+"-"+curDate.getFullYear()
  
  
  // Only after calling "find" all query conditions will resolve
  ///Studentid stid
      
        let x = await PUTRequest(`${HOSTNAME}/Content/Campus`,{stNumber:studentNumber})


        if(!x.data)
        {
          setTColor("Student not found")
          setAcces("red")
          dispatch(setMusic({"Origin":"",
                          "Destination":"",
                          "Date":"",
                          "Time":""}))  
						  
          dispatch(setStNumber({"firstName":"",
                            "lastName":"",
                            "stNumber":"",
                            "email":"",
                            "profilepic":""}))
          return
        }


        
        dispatch(setStNumber({"firstName":x.data[0].Firstname,
                                "lastName":x.data[0].Lastname,
                                "stNumber":studentNumber,
                                "email":"("+x.data[0].Student_Email+")",
                                "profilepic":x.data[0].profilepicture}))
                                
         ////////////////////////////////Trip Detail retriving//////////////////////////////////////
         let y = await POSTRequest(`${HOSTNAME}/Content/Campus`,{stid:x.data[0].Studentid,currentDate:curDate})

        if(y.data.length < 1)
        {
          setTColor("No trip found for today")
          dispatch(setMusic({"Origin":"",
                          "Destination":"",
                          "Date":"",
                          "Time":""})) 
          setAcces("red")
          return
        }
        

       dispatch(setMusic({"Origin":y.data[0].From,
                          "Destination":y.data[0].To,
                          "Date":y.data[0].Date,
                          "Time":y.data[0].Time}))   
        
        
        

        if(!timeCheckUp(y,setT,setTColor,setAcces))
        {
          return
        }



      return true;
 
   

    
}

function timeCheckUp(tripDetails,setColorErrT,setAccess,setColorSta)
  {
    
    let tripTimeHr 
      if(tripDetails[0]?.Time != null)
      {
        tripTimeHr = tripDetails[0]?.Time.substr(0,tripDetails[0]?.Time.indexOf(':'))
       
        if(tripTimeHr == (new Date().getHours() + 1))
        {
          setAccess("Accept")
          setColorSta("lightgreen")
          setColorErrT("white")
          return true
        }
        else
        {
          setAccess("Deny")
          setColorSta("red")
          setColorErrT("red")
          return false
        }
      }
}

export default function Scan(navProps) {
  LogBox.ignoreLogs(['Setting a timer'])

  const [time, setTime] = useState();

  let intv_Checker = navProps.route.params.checker
  let hr
  if(intv_Checker == "60")
  {
       hr = (new Date().getHours() + 1) + ":00";
  }
  else if(intv_Checker == "15")
  {
      let min
      hr = new Date().getHours()
      if(new Date().getMinutes() > -1 && new Date().getMinutes() < 15 )
      {
        min = 15
      }

      if(new Date().getMinutes() > 15 && new Date().getMinutes() < 30 )
      {
        min = 30
      }

      if(new Date().getMinutes() > 30 && new Date().getMinutes() < 45 )
      {
        min = 45
      }

      if(new Date().getMinutes() > 45 && new Date().getMinutes() < 60)
      {
        min = "00"
        hr += 1
      }
      
      hr += ":" +min;
  }

  //Declaration
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userMeta,setUserMeta] = useState();
  const [UserDetails, setUserDetails] = useState();
  
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const studentNumber = useSelector(selectStNumber);
  const tripDetails = useSelector(selectMusic)
  const route = useSelector(selectOrigin)
  const [username, setUsername] = useState("white");


  //False indication setter on visual
  const [colorErrO, setColorErrO] = useState("white");
 
  const [colorErrD, setColorErrD] = useState("white");
  
  const [colorErrT, setColorErrT] = useState("white");

  const [access, setAccess] = useState("");
  
  const [colorSta, setColorSta] = useState("white");
  


  getUserDet(setUserDetails,setUserMeta,setUsername)

  //Block Default back button
  React.useEffect(
    () => 
        navigation.addListener('beforeRemove', (e) => {
        const action = e.data.action;
      
       if(action?.type === "GO_BACK")
       {
        e.preventDefault();
        
        Alert.alert(
          'Cation',
          'Are you sure you would like to leave scan activity?',
          [
            { text: "Back", style: 'default', onPress: () => {navigation.navigate("Route",{username:username})} },
            { text: "Cancel", style: 'cancel', onPress: () => {} },
            { text: 'Exit',style: 'destructive',onPress: () => BackHandler.exitApp() },
          ]
        );
       }
       
      }),
    [navigation]
  );


  //Getting Permission of Camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //Handling the scanned QR code
  const handleBarCodeScanned = ({  data }) => {
   
    setColorErrO("white")
    setColorErrT("white")
    setColorErrD("white")
    setColorSta("lightgreen")
    setAccess("Accept")
    dispatch(setMusic({"Origin":"Loading...",
                          "Destination":"Loading...",
                          "Date":"Loading...",
                          "Time":"Loading..."})) 

    setScanned(true);
    doUserQuery(data,dispatch,setStNumber,route,setColorErrO,setColorErrD,setColorErrT,setAccess,setColorSta)
    
    Vibration.vibrate(40)
  };

  //Handle of camera permission miss state
      if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

  

    
    

  //Render output
  return (
   
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      /> 
      <ImageBackground source={require('../assets/scan.png')} style={{position:"absolute",alignSelf:"center",flex:1,width:500,height:500}}></ImageBackground>
      {
        scanned &&
            <View style={[styles.cover,{borderRadius:20}]}>
                       {/*               Header                      */}
                    <View style={styles.admiter}>
                          <Text style={styles.adm}>Admin : {UserDetails}</Text>
                          <Text style={[styles.adm,{fontSize
                            :14,color:"grey"}]}>Email : {userMeta}</Text>
                  </View>
                  <View style={[styles.admiter,{marginTop:0,backgroundColor:"black",height:30}]}>
                          <Text style={[styles.adm,{color:"white",alignSelf:"center",fontSize:14}]}>Next Bus Going Time : {hr} </Text>
                  </View>
                  {/*                 Student Details                      */}
                  <Image style = {{alignSelf:"center",width:200,height:200,marginTop:20,borderRadius:100}}  source={{uri:studentNumber?.profilepic || "https://th.bing.com/th/id/R.cb331d845f324231c4b15f1c5f37d6f2?rik=QNYICo3KZ1EPJw&riu=http%3a%2f%2fcliparts.co%2fcliparts%2fBcg%2frng%2fBcgrngy7i.png&ehk=Jx5zgVOXdnslAd3UhPMRPR44PNthVLappLrl3ssZz4w%3d&risl=&pid=ImgRaw&r=0"}} />
         
     
                  <View style={styles.details}>
                                        
                        {
                            studentNumber?.email != null ?
                            (
								<View>
									<Text style={[styles.text,{fontSize:20,alignSelf:"center"}]}>{studentNumber?.firstName} {studentNumber?.lastName} {studentNumber?.stNumber}</Text>
									<Text style={[styles.text,{color:"black",alignSelf:"center",fontSize:14,}]}> {studentNumber?.email}</Text>
								</View>
                            )
                            :
                              null
                        }
                        
                  {/*                 Student Personals                        */}
  
                  {/*                 Student Details Trip                     */}
                  {/*                 StudentTrips                             */}
                        
                  <View style={styles.passcard}>
                        <Text style={{alignSelf:"center",color:"lightgrey"}}>System only approves for the next bus token.</Text>
                        <Text style={{alignSelf:"center",color:"lightgrey"}}>only tokens for today are being retrived</Text>
                        <Text style={[styles.text,{fontSize:17,color:"white"}]}>Depureture: {tripDetails?.Origin}<Text style={{color:colorErrO}}> •</Text></Text>
                        <Text style={[styles.text,{fontSize:17,color:"white"}]}>Destination: {tripDetails?.Destination}<Text style={{color:colorErrD}}> •</Text></Text>
                        <Text style={[styles.text,{fontSize:17,color:"white"}]}>Time : {tripDetails?.Time}<Text style={{color:colorErrT}}> •</Text></Text>
                        <Text style={[styles.text,{fontSize:17,color:"white"}]}>Admition : <Text style={{color:colorSta}}>{access}</Text></Text>
                  </View>

                  </View>
                  {/*                 Footer                      */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.scanBtn} onPress={()=>{setScanned(false)}}>
                        <Text style={styles.scanTxt}>Scan</Text>
                    </TouchableOpacity>
                </View>   
            </View>
      }
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius:50
  },
  cover:{
    backgroundColor:"white",
  },
  admiter:{
    backgroundColor:"whitesmoke",
    width:380,
    height:70,
    marginTop:10,
    alignSelf:"center",
    justifyContent:"center"
  },
  adm:{
      marginLeft:23,
      fontSize:17,
  },
  scanBtn:{
    alignSelf:"center",
    width:200,
    height:13

  },
  footer:
    {
        marginTop:30,
        alignSelf:"center",
        
    },
  scanBtn:{
    backgroundColor:"black",
    width:200,
    height:70,  
    justifyContent:"center",
    marginBottom:15,
    },
    scanTxt:{
        color:"white",
        alignSelf:"center",
        fontSize:20,
        fontWeight:"700"
    },
    details:{
      marginTop:5,
      marginLeft:33
    },
    text:{
      fontSize:18,
      marginTop:13
    },
    passcard:{
      marginLeft:-33,
      backgroundColor:"black",
      alignSelf:"center",
      width:400,
      marginTop:30,
      paddingBottom:23,
      paddingRight:23,
      paddingLeft:23,
      paddingTop:23,
      borderRadius:14
    }
});

