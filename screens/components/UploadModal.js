import React, { useState } from 'react'
import { Text,Modal,TouchableOpacity,Image,Alert,View} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { HOSTNAME } from '../../globals'

export function UploadingImg_Modal({setModalVisible,modalVisible,Studentid})
{
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [ loading ,setLoading ] = useState(false)

    const pickImage = async () => {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.3,
            presentationStyle: "OverCurrentContext"
            });

            if (!result.cancelled) {
         
                await upLoadTo_FB_Storge(Studentid,result,setModalVisible,setLoading);
            }
        };
        
        const captureImage = async () => {
            //Permission of camera
            await requestPermission()
            if(status.status == "granted")
            {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect:[4, 4],
                    quality:0.3
                })

                if (!result.cancelled) {
              
                    await upLoadTo_FB_Storge(Studentid,result,setModalVisible,setLoading);
                }
            }

        }

   
    return(<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        >
            <TouchableOpacity activeOpacity={1} style={{flex:1,flexDirection:"row"}} onPress={()=>{setModalVisible(false)}}>
                
                <TouchableOpacity activeOpacity={1} style={{height:"25%",elevation:70,width:"100%",backgroundColor:"black",alignSelf:"flex-end",borderTopLeftRadius:50,borderTopRightRadius:50,padding:30}} >
                    
                    { !loading?
                        (<View>
                            <Text style={{alignSelf:"center",color:"white",marginBottom:20}}>Upload your potrait or headshot Image</Text>
                            <TouchableOpacity style={{flexDirection:"row",alignSelf:"center",marginBottom:"7%"}} onPress={pickImage}>
                                <Image style={{width:"7%",height:"140%"}} source={require('../../assets/image_wh.png')}/>
                                <Text style={{alignSelf:"center",color:"white"}}>  Upload from files</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection:"row",alignSelf:"center",marginBottom:"7%"}} onPress={captureImage}>
                                <Image style={{width:"7%",height:"140%"}} source={require('../../assets/images.png')}/>
                                <Text style={{alignSelf:"center",color:"white"}}>  Capture from camera</Text>
                            </TouchableOpacity>
                        </View>
                        )
                        :
                        <View style={{justifyContent:"center",flex:1}}>
                            <Image style={{width:20,height:20,alignSelf:"center"}} source={require('../../assets/R.gif')}/>
                            <Text style={{alignSelf:"center",color:"white"}}>Please wait while we upload your image</Text>
                        </View>
                    }
                </TouchableOpacity>
            </TouchableOpacity>
    </Modal>)
}




async function upLoadTo_FB_Storge(Studentid,imageProps,setModalVisible,setLoading)
{
    setLoading(true)
    let y 
    let ext = String(imageProps.uri).substring(String(imageProps.uri).lastIndexOf('.')+1,String(imageProps.uri).length)
    let imageSource = {
        uri: imageProps.uri, 
        name: `image.${ext}`, 
        type: imageProps.type+"/"+ext
    }

    let formdata = new FormData();
    formdata.append("Studentid", Studentid)
    formdata.append("image", imageSource)

    await fetch(`${HOSTNAME}/Student/Upload`,{method: 'post',headers: { Accept: "application/json",'Content-Type': 'multipart/form-data'},body: formdata})
       .then((response) => response.json())
             .then((responseJson) => {
              y = responseJson
        })   
       .catch((err) => {
              console.log(err)
    })
    
    setModalVisible(false)
    setLoading(false)
}


