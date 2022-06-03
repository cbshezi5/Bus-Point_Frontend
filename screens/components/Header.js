import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Font from 'expo-font'
import Apploading from "expo-app-loading";

//Function Member get resource locally
const getFonts = () =>
  Font.loadAsync({
    MontserratBlack: require("../../assets/font/CountrysideTwo-r9WO.ttf"),
    Rustling: require("../../assets/font/HaisleyMind-lgxxZ.ttf"),
  });


const Header = () => {
    //Font resource links
	const [fontsloaded, setFontsLoaded] = useState(false);
    if(fontsloaded)
    {
        return (
            <View>
                <Text style={styles.Tittle}>Bus Point</Text>
                <Text style={styles.original}>®</Text>
                <Text style={styles.subTittle}>version 1.1</Text>
            </View>
        )
    }
    else
    {
        return( <Apploading startAsync={getFonts} onFinish={() => { setFontsLoaded(true); }} onError={console.warn} /> )
    }


    
    
}

export default Header

const styles = StyleSheet.create({
    Tittle:{
        marginTop:140,
        fontSize:55,
        marginLeft:10,
        color:"black",
        fontFamily: "MontserratBlack",
    },
    original:{
        color:"black",
        marginLeft:290,
        marginTop:-83,
    },
    subTittle:{
        marginLeft:20,
        marginTop:42,
        fontSize:30,
        fontFamily: "Rustling",
    },
})
