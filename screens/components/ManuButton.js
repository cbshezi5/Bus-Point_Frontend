import React,{ useState,useEffect } from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,ToastAndroid ,Alert} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Parse from "parse/react-native";
import { setStNumber,setLastName,setEmail,setFirstName,selectFirstName,selectLastName } from '../../slices/navSlice';
import { useDispatch,useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { GETRequest,DELETERequest,PUTRequest } from './../../Request'
import { HOSTNAME } from '../../globals'

async function LogOut(navigation) {
        navigation.navigate("Login")
}

async function getUserDet(setUserDetails,LsetEmail,dispatch) {

    let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))
    

    let x = await GETRequest(`${HOSTNAME}/Auth/Student?id=${userdata[0].Studentid}`)
   
    if(userdata[0]?.Student_Email)  
    {
        setUserDetails(x.data[0].Firstname+" "+x.data[0].Lastname)
        LsetEmail(x.data[0].Student_Email)
        dispatch(setStNumber(x.data[0].StudentNumber))
        dispatch(setEmail(x.data[0].Student_Email))
        dispatch(setFirstName(x.data[0].Firstname))
        dispatch(setLastName(x.data[0].Lastname))
    }  

}
async function clearBooks() {
    let userdata = JSON.parse(await AsyncStorage.getItem("@user_data"))

    let x = await PUTRequest(`${HOSTNAME}/Student/ClearAll`,{"id":userdata[0].Studentid})

    

    if(x.error)
    {
        ToastAndroid.show("Oop couldn't clear your booking please try again later",500)
    }

    ToastAndroid.show("Successfully cleared all your bookings",500)

}


const ManuButton = () => {
    const [manuOpenned, setManuOpenned] = useState(false)
    const [userDetails,setUserDetails] = useState(String())
    const [Lemail,LsetEmail] = useState(String())
    const dispatch = useDispatch()
    const fnameChange = useSelector(selectFirstName)
    const lnameChange = useSelector(selectLastName)
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false);
 
    useEffect(()=>getUserDet(setUserDetails,LsetEmail,dispatch),[fnameChange,lnameChange])

    const hideMenu = (button) =>{
        if(button == "L")
        {
            LogOut(navigation)
        }
        if(button == 'D')
        {
            Alert.alert(
                'Delete Account?',
                'Are you sure you would like to delete your account?',
                [
                  { text: "Cancel", style: 'cancel', onPress: () => {} },
                  { text: 'Delete',style: 'destructive',onPress: () => {
                    LogOut(navigation)
                    deleteAcc()
                  } },
                ]
              );
            
        }
        if(button == 'U')
        {
            navigation.navigate("Update",{email:Lemail})
        }

        if(button == 'C')
        {
            //Clear all trips
            Alert.alert(
                'Clear Bookings?',
                'Are you sure you would like to clear all your booked buses?',
                [
                  { text: "Cancel", style: 'cancel', onPress: () => {} },
                  { text: 'Clear',style: 'destructive',onPress: () => {
                        clearBooks()
                  } },
                ]
              );
        }

        setVisible(false)
    };

    const deleteAcc = async ()  => {
        let result = await DELETERequest(`${HOSTNAME}/Auth/Registration?email=${Lemail}`)
    }

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
                                <MenuItem onPress={()=>hideMenu("C")}>Clear all bookings</MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={()=>hideMenu("L")}>Logout</MenuItem>
                            </Menu>
                        </View>

                            <Text style={{color:"white",fontSize:40,marginTop:-39,marginLeft:114}}>•</Text>
                            <TouchableOpacity style={{width:120,marginLeft:150,marginTop:-40}} onPress={()=>{navigation.navigate("CurrentTrip")}}>
                                <Text style={styles.buttons}>My Bookings</Text>
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
