import React,{useState} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Parse from "parse/react-native";
import { setStNumber,setLastName,setEmail,setFirstName } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import {GETRequest} from './../../Request'

async function LogOut(navigation) {
    
    // await AsyncStorage.removeItem("@user_data")
    // .then(()=>{
        navigation.navigate("Login")
    // })
}

async function getUserDet(setUserDetails,dispatch) {

    let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))


    let x = await GETRequest(`http://192.168.43.128:1100/Auth/Student?id=${userdata[0].student_id}`)
   

    if(userdata[0]?.firstname)  
    {
        setUserDetails(x.data[0].firstname+" "+userdata[0].lastname )
        dispatch(setStNumber(x.data[0].studentnumber))
        dispatch(setEmail(x.data[0].student_email))
        dispatch(setFirstName(x.data[0].firstname))
        dispatch(setLastName(x.data[0].lastname))
    }  
    
    
    
    
}

const ManuButton = () => {
    const [manuOpenned, setManuOpenned] = useState(false)
    const [userDetails,setUserDetails] = useState(String())
    const dispatch = useDispatch()
    const navigation = useNavigation()
    getUserDet(setUserDetails,dispatch)
    const [visible, setVisible] = useState(false);

    const hideMenu = (button) =>{
        if(button == "L")
        {
            LogOut(navigation)
        }
        setVisible(false)
    };

    const showMenu = () => setVisible(true);

    return (
        <View>
            {
                manuOpenned ?
                (
                    <View style={{top:53}}>
                    <TouchableOpacity style={[styles.iconPromo,{backgroundColor:"white"}]} onPress={()=>{setManuOpenned(false)}}>
                        <Image source={require('../../assets/bus_bl48px.png')} style = {styles.iconProp} />
                    </TouchableOpacity>

                    <View style={styles.manu}>
                            <Text style={styles.userNames}>{userDetails}</Text>

                            <View style={{width:80,marginLeft:30,marginTop:60}}>
                            <Menu
                                visible={visible}
                                anchor={<Text style={styles.buttons} onPress={showMenu}>Profile</Text>}
                                onRequestClose={hideMenu}
                            >
                                <MenuItem onPress={()=>hideMenu("U")}>Update Your Profile</MenuItem>
                                <MenuItem onPress={()=>hideMenu("D")}>Delete this Profile</MenuItem>
                                <MenuItem onPress={()=>hideMenu("C")}>Clear all Trips</MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={()=>hideMenu("L")}>Logout</MenuItem>
                            </Menu>
                        </View>

                            {/* <TouchableOpacity  onPress={()=>{LogOut(navigation)}}>
                                <Text style={styles.buttons}>Logout</Text>
                            </TouchableOpacity> */}

                            <Text style={{color:"white",fontSize:40,marginTop:-39,marginLeft:114}}>•</Text>
                            <TouchableOpacity style={{width:120,marginLeft:150,marginTop:-40}} onPress={()=>{navigation.navigate("CurrentTrip")}}>
                                <Text style={styles.buttons}>Current Trip</Text>
                            </TouchableOpacity>
                    </View>
                    </View>
                )
                :
                <View>
                    <TouchableOpacity style={styles.iconPromo} onPress={()=>{setManuOpenned(true)}}>
                            <Image source={require('../../assets/bus_wh48px.png')} style = {styles.iconProp} />
                    </TouchableOpacity>
                </View>
            }
            
            
            
            
            
        </View>
    )
}

export default ManuButton


const styles = StyleSheet.create({
    iconPromo:{
		alignSelf:"center",
		marginTop:90,
        marginBottom:-84,
		marginLeft:250,
        backgroundColor:"black",
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        borderRadius:50,
        elevation:9,
	},
    iconProp:{
        height: 30, 
        width: 30, 
        resizeMode : 'stretch',
    },
    manu:{
        backgroundColor:"black",
        height:110,
        zIndex:-2,
        elevation:8,
    },
    buttons:{
        color:"white",
        fontSize:20,

    },
    userNames:{
        color:"white",
        marginLeft:20,
        fontSize:30,
        marginTop:20,
        marginBottom:-50,
        fontWeight:"700",
    }
})
