import React, { useState} from 'react'
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Alert } from 'react-native'
import Parse from 'parse/react-native';
import {useNavigation} from '@react-navigation/native';

const ForgotPassword = () => {

    const navigation = useNavigation();

  // Your state variable
  const [email, setEmail] = useState('');
  const [emailErr,setEmailErr] = useState('');

  const doUserPasswordReset = async function (){
    // Note that this value come from state variables linked to your text input
    const emailValue = email;
    return await Parse.User.requestPasswordReset(emailValue)
        .then(() => {
            // logIn returns the corresponding ParseUser object
            Alert.alert(
            'Success!',
            `Please check ${email} to proceed with password reset.`,
            );
            // Redirect user to your login screen
            navigation.navigate('Login');
            return true;
        })
        .catch((error) => {
            // Error can be caused by lack of Internet connection
           // Alert.alert('Error!', error.message);
           setEmailErr(error.message)
            console.log('Error!', error.message)
            return false;
        });
    };

    return (
        <View style={{justifyContent:"center",flex:1,backgroundColor:"white"}}>
            <Text style={{alignSelf:"center",fontSize:30,marginBottom:70}}>Resetting Password</Text>
            <Text style={{alignSelf:"center",fontSize:14}}>Enter your email address on the field below</Text>
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
            onPress={() => doUserPasswordReset()}
            style={[styles.button,{borderColor:"black",borderWidth:1}]}>
          <View >
            <Text >{'Request password reset'}</Text>
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
