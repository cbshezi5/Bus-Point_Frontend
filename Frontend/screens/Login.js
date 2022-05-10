import React,{useState} from 'react'
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity,ToastAndroid,Vibration, Alert,BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import * as FileSystem from 'expo-file-system';
import Checkbox from 'expo-checkbox';
import { POSTRequest } from './../Request'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOSTNAME } from '../globals'

async function deleteFile()
{
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'myDirectory/myFile/user.txt')
    .catch((error)=>{console.log(error.message)})
}

async function checkANDcreateFile(username,password) {

        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'myDirectory/myFile',{intermediates:true})
        .catch((error)=>{console.log(error.message)})

        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'myDirectory/myFile/user.txt',String('["'+username+'","'+password+'"]'))
        .catch((error) =>{ToastAndroid.show(error.message,500)})
       
}

function toRegister(navigation) {  
    navigation.navigate("Register")
}

function onShowPassword(setShowPassword,showPassword)
{
    if(showPassword)
    {
        setShowPassword(false)
    }
    else
    {
        setShowPassword(true)
    }
}

const Login = () => {


    const navigation = useNavigation()
    const [emailOrStudentNo, setEmailOrStudentNo] = useState(String())
    const [password, setPassword] = useState(String())
    const [emailOrStudentNoErr, setEmailOrStudentNoErr] = useState(String())
    const [passwordErr, setPasswordErr] = useState(String())
    const [showPassword, setShowPassword] = useState(null)
    const [verifyShow, setVerifyShow] = useState(Boolean(false))
    const [isChecked, setChecked] = useState(false);

    //BLOCK GO BACK
     
    React.useEffect(
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







    //BLOCK GO BACK


    const doUserQuery = async function () {

        

        //Handing Human Error
        if(emailOrStudentNo == "")
        {
            ToastAndroid.show("Empty email/student number not allowed",500)
            setEmailOrStudentNoErr("*Field is mandetory")
            return
        }
        else
        {
            setEmailOrStudentNoErr("")
        }

        if(password == "")
        {
            ToastAndroid.show("Empty password not allowed",500)
            setPasswordErr("*Field is mandetory")
            return
        }
        else
        {
            setPasswordErr("")
        }

        //Handling Humam Error input


        
      };


      
    const doUserLogIn = async function () {
        // Note that these values come from state variables that we've declared before
        
        let response = await  POSTRequest(`http://${HOSTNAME}:1100/Auth/Login`,{"email":emailOrStudentNo,"password":password})

       
        if(response?.error)
        {
            setEmailOrStudentNoErr(response.message)
        }
        else
        {
                if(isChecked)
                {
                    checkANDcreateFile(emailOrStudentNo,password)
                }
                else
                {
                    deleteFile()
                }
                
                if(!response?.error)
                {
                    const userdata = JSON.stringify(response?.data)
                    await AsyncStorage.setItem('@user_data',userdata)
                    navigation.navigate("HomeScreen")
                }   
                
        }   
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Image source={require('../assets/bus_wh48px.png')} style = {styles.iconProp} /> 
            </View>
            {
                verifyShow ?
                (
                    <Text style={styles.verify}>Your email address is not verified Please verify it's to continue by openning your email address inbox and click the link supplied.</Text>
                )
                :
                null
            }
            <TextInput 
                style={styles.input} 
                numberOfLines={1}
                multiline={false}
                placeholder="Staff / Student number"
                maxLength={64}
                autoCapitalize="none"
                autoCompleteType="email"
                onChangeText={(e)=>{setEmailOrStudentNo(e)}}
                />
                <Text style={{marginLeft:50,color:"red"}}>{emailOrStudentNoErr}</Text>
            <TextInput 
                style={[styles.input,{marginTop:60,paddingRight:50}]} 
                numberOfLines={1}
                passwordRules="*"
                multiline={false}
                maxLength={64}
                secureTextEntry={showPassword}
                placeholder="Password"
                onChangeText={(e)=>{setPassword(e)}}
                />
                  {
                    emailOrStudentNoErr == ""?
                    (
                        <Text style={{marginLeft:50,color:"red"}}>{passwordErr}</Text>
                    )
                    :
                    <Text style={{marginLeft:50,color:"red"}}></Text>
                }
               
                <TouchableOpacity style={styles.passwordShow} onPress={()=>{onShowPassword(setShowPassword,showPassword)}}>
                    {
                        showPassword?
                        (
                            <Image style={styles.passwordShowIcon} source={require('../assets/icons/show_pas.png')}  /> 
                        )
                        :
                        <Image style={styles.passwordShowIcon} source={require('../assets/icons/hide_pas.png')}  /> 
                    }
                    
                </TouchableOpacity>
            <View>
            <Checkbox 
                style={styles.checkbox} 
                value={isChecked} 
                onValueChange={setChecked} 
                color="black"
                />
                <Text style={{marginTop:-20,marginLeft:70}}>Auto login</Text>
                <TouchableOpacity style={[styles.instr,styles.btn]} onPress={()=>{doUserQuery(),doUserLogIn()}}>
                    <Text style={{alignSelf:"center",fontSize:18}}>Login</Text>
                </TouchableOpacity>
                
                <Text style={styles.instr}>I don't have an account</Text> 

                <TouchableOpacity style={{alignItems:"center"}} onPress={()=>{toRegister(navigation)}}> 
                    <Text style={{fontSize:17,color:"blue"}}>Register</Text> 
                </TouchableOpacity>

                <TouchableOpacity style={{alignItems:"center",marginTop:30}} onPress={()=>{navigation.navigate("ForgotPassword")}}> 
                    <Text style={{fontSize:17,color:"black"}}>I have Forgotten my password</Text> 
                </TouchableOpacity>
            </View>
			 
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        justifyContent:"center"
    },
    iconProp:{
        alignSelf:"center",
    },
    icon:{
        backgroundColor:"black",
        width:100,
        height:100,
        alignSelf:"center",
        marginTop:90,
        justifyContent:"center",
        borderRadius:100
    },
    input:{
        backgroundColor:'whitesmoke',
        marginTop:90,
        width:350,
        alignSelf:"center",
        height:50,
        fontSize:20,
        paddingRight:20,
        paddingLeft:20,
    },
    instr:{
        marginTop:40,
        alignSelf:"center",
        fontSize:17,
    },
    btn:{
        marginTop:90,
        borderWidth:2,
        width:150,
        height:50,
        justifyContent:"center",
    },
    passwordShow:{
        alignSelf:"flex-end",
        marginRight:50,
        marginTop:-57,
        resizeMode:"stretch",
        width:35,
        height:35,
    },
    passwordShowIcon:{
        width:25,
        height:25,
    },
    verify:{
        alignSelf:"center",
        marginTop:50,
        marginBottom:-50,
        paddingLeft:70,
        paddingRight:70,
        backgroundColor:"black",
        color:"white",
        paddingTop:5,
        paddingBottom:5,
    },
    checkbox:{
        marginLeft:44,
        marginTop:40,
    }
})
