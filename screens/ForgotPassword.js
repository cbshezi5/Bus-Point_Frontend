import React, { useState} from 'react'
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Alert,ToastAndroid } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import { POSTRequest,GETRequest } from '../Request'
import { HOSTNAME } from '../globals'

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math
  .random() * (maxm - minm + 1)) + minm;
}

function specialChars(phrase) {
    
  const spacials = String("!@#$%^&*()_-+=|\}]{[:;'?/>.<,~`")

  for (let index = 0; index < spacials.length; index++) {
      for (let x = 0; x < phrase.length; x++) {
          if(spacials[index] == phrase[x])
          {
              return true
          }
      }
      
  }
  return false
}



const ForgotPassword = () => {

    const navigation = useNavigation();

  // Your state variable
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [err,setErr] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr,setEmailErr] = useState('');
  const [step,setStep]= useState(0);
  const [otpDetails,setOTPDetails] = useState({})

  const checkemailsendotp = async function (){

        if(email == "")
        {
            ToastAndroid.show("Empty email not allowed",500)
            setEmailErr("*Field is mandetory")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.length < 5)
        {
            ToastAndroid.show("Too short email",500)
            setEmailErr("Too short email")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.indexOf(" ") == email.length)
        {
            setEmail(email.substring(0,email.length - 1))
        }

        if(email.indexOf("@") < 1)
        {
            ToastAndroid.show("Incorrect email syntax",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.indexOf(".") < 1)
        {
            ToastAndroid.show("Incorrect email syntax",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.indexOf(".") < email.indexOf("@"))
        {
            ToastAndroid.show("Invalid student email address",500)
            return
        }
        else
        {
            setEmailErr("")
        }

        const studentNumber = email.substring(0,email.indexOf("@"))
        const domainName = email.substring(1 + email.indexOf("@"),email.indexOf("."))
        const orgCountry = email.substring(1 + email.indexOf("."),email.length)
        const orgnasation = orgCountry.substring(0,orgCountry.indexOf("."))
        const country = orgCountry.substring(orgCountry.indexOf(".") + 1,orgCountry.length)
        
        if(studentNumber == "" || domainName == "" || orgnasation == "" || country == "")
        {
            ToastAndroid.show("Incorrect email syntax missing dependancy",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(specialChars(domainName))
        {
            ToastAndroid.show("Found special characters on domain name",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(specialChars((email[email.length-1])))
        {
            ToastAndroid.show("Invalid student email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(orgnasation != "ac")
        {
            ToastAndroid.show("Not allowed organisation of the email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }
        
      
        if(country == "za" || country == "za ")
        {
            setEmailErr("")
        }
        else
        {
            ToastAndroid.show("Application only allows south african emails only",500)
            setEmailErr("Invalid student email address")
            return
        }

        if(specialChars(studentNumber))
        {
            ToastAndroid.show("Student number expected on the email identifier",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        for (let index = 0; index < studentNumber.length; index++) {
            if(isNaN(Number(studentNumber[index])))
            {
                ToastAndroid.show("Student number expected on the email identifier",500)
                setEmailErr("Invalid student email address")
                return
            }
            setEmailErr("")
        }
            
        

        if(email.indexOf(" ") > 1 && email.indexOf(" ") < email.length - 1)
        {
            ToastAndroid.show("Spaces are not allowed on email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        let responseCheck = await POSTRequest(`${HOSTNAME}/Auth/Forgotten`,{email:email})

        if(responseCheck.error)
        {
            ToastAndroid.show(responseCheck.message,500)
            setEmailErr(responseCheck.message)
            return
        }

        let generated_otp = generateRandomNumber().toString()
        
        let response = await GETRequest(`${HOSTNAME}/sendEmail?email=${email}&otp=${generated_otp}`)

       
        setOTPDetails({otp:generated_otp,email:email})


    
    setStep(1)
};

  const doUserPasswordReset = async function (){

        if(password.length < 5 )
        {
            setErr("Password is too short")
            return
        }
        else if (password.length > 50 )
        {
            setErr("Password is too long")
            return
        }

        if(otpDetails.otp == otp)
          await doReset()
        else
          setErr("OTP is incorrect")
  };

  const doReset = async function (){
    let responseCheck = await POSTRequest(`${HOSTNAME}/Auth/Forgotten`,{email:email,newPassword:password})
    navigation.navigate("Login")
    ToastAndroid.show("Password Resetted",500)
  }

    return (
        <View style={{justifyContent:"center",flex:1,backgroundColor:"white"}}>
          {
            step == 0?
            (
              <View>
              <Text style={{alignSelf:"center",fontSize:30,marginBottom:70}}>Resetting Password</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>Enter your student email address on the field below</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>and then press 'Request password reset'</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>Follow the steps provided </Text>
              <Text style={{alignSelf:"center",fontSize:14}}>This is only for students</Text>
        

              <TextInput
                  style={styles.input}
                  value={email}
                  placeholder={'Student email'}
                  onChangeText={(text) => setEmail(text)}
                  autoCapitalize={'none'}
                  keyboardType={'email-address'}
          />
            <Text style={{marginTop:-50,marginLeft:40,color:"red"}}>{emailErr}</Text>
            <TouchableOpacity 
                onPress={() => checkemailsendotp()}
                style={[styles.button,{borderColor:"black",borderWidth:1}]}>
              <View >
                <Text >{'Next'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => navigation.navigate("Login")}
                style={styles.button}>
              <View >
                <Text style={{fontSize:17}}>{'Back'}</Text>
              </View>
            </TouchableOpacity>
          </View>
            )
            :
            step == 1?
            (
              <View>
                   <Text style={{alignSelf:"center",fontSize:30,marginBottom:70}}>Resetting Password</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>OTP a 6 digit pin was sent to</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>{email}</Text>
              <Text style={{alignSelf:"center",fontSize:14}}>Enter its below</Text>
        

              <TextInput
                  style={styles.input}
                  value={otp}
                  placeholder={'OTP one time pin'}
                  onChangeText={(text) => setOtp(text)}
                  autoCapitalize={'none'}
                  maxLength={6}
                  textAlign={'center'}
                  keyboardType={'numeric'}
              />
              <TextInput
                  style={[styles.input,{marginTop:-15}]}
                  value={password}
                  placeholder={'Password'}
                  onChangeText={(text) => setPassword(text)}
                  autoCapitalize={'none'}
                  maxLength={60}
                  keyboardType={'visible-password'}
              />
            <Text style={{marginTop:-50,marginLeft:40,color:"red"}}>{err}</Text>
            <TouchableOpacity 
                onPress={() => doUserPasswordReset()}
                style={[styles.button,{borderColor:"black",borderWidth:1}]}>
              <View >
                <Text >{'Request password reset'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => setStep(0)}
                style={styles.button}>
              <View >
                <Text style={{fontSize:17}}>{'Back'}</Text>
              </View>
            </TouchableOpacity>
              </View>
            )
            :
            null
          }
          
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    input:{
        backgroundColor:'whitesmoke',
        marginTop:50,
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
