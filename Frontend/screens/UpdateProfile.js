import React, { useState,useEffect } from 'react'
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Alert } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { PUTRequest,GETRequest } from './../Request'
import { useDispatch } from 'react-redux';
import { setLastName,setFirstName } from '../slices/navSlice';
import { HOSTNAME } from '../globals'

const UpdateProfile = (props) => {
    const navigation = useNavigation() 
    const dispatch = useDispatch()
    const [fname,setFname] = useState("")
    const [lname,setLname] = useState("")

    useEffect(async()=>{

        let response = await GETRequest(`${HOSTNAME}/Auth/Registration?email=${props.route.params.email}`)
        setFname(response.data[0].firstname)
        setLname(response.data[0].lastname)

    },[])

    



    const update = async () =>{
        let response = await PUTRequest(`${HOSTNAME}/Auth/Registration?email=${props.route.params.email}&fname=${fname}&lname=${lname}`,{})
        dispatch(setFirstName(fname))
        dispatch(setLastName(lname))
        navigation.navigate("HomeScreen")
    }

    return (
        <View style={{justifyContent:"center",flex:1,backgroundColor:"white"}}>
            <Text style={{alignSelf:"center",fontSize:30,marginBottom:60}}>Update Your Profile</Text>
            <Text style={{marginLeft:50,marginBottom:-15,color:"red"}}>Firstname *</Text>
            <TextInput placeholder={'Firstname'} style={styles.input} onChangeText={(text) => setFname(text)}>{fname}</TextInput>
            <Text style={{marginLeft:50,marginBottom:-15,color:"red"}}>Lastname *</Text>
            <TextInput placeholder={'Lastname'} style={styles.input} onChangeText={(text) => setLname(text)}>{lname}</TextInput>
            <Text style={{alignSelf:"center"}}>Email : {props.route.params.email}</Text>
            <View style={{flexDirection:"row",alignSelf:"center"}}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate("HomeScreen")}
                >
                <View >
                    <Text style={{fontSize:17}}>{'Back'}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button,{backgroundColor:'black',marginLeft:20}]}
                onPress={() => update()}
                >
                <View >
                    <Text style={{fontSize:17,color:'white'}}>{'Save'}</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default UpdateProfile;

const styles = StyleSheet.create({
    input:{
        backgroundColor:'whitesmoke',
        marginTop:20,
        width:350,
        alignSelf:"center",
        height:50,
        fontSize:20,
        paddingRight:20,
        paddingLeft:20,
        marginBottom:60
    },
    button:{
        marginTop:30,
        alignSelf:"center",
        backgroundColor:"whitesmoke",
        paddingBottom:15,
        paddingRight:30,
        paddingTop:15,
        paddingLeft:30,
    }
})
