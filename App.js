//React Libraries Links
import React from 'react';
import { Provider } from 'react-redux';



//import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


//Home Libraries Links
import { store } from './store'
import HomeScreen from './screens/HomeScreen'
import Slots from './screens/Slots';
import QRcode from './screens/QRcode';
import Confirm from './screens/Confirm';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import Loading from './screens/Loading';
import CurrentTrip from './screens/CurrentTrip';
import UpdateProfile from './screens/UpdateProfile'

//Admiter Mode
import Scan from './admiter/Scan'
import Route from './admiter/Route'


export default function App() {
  const  Stack = createStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
              name = "Loading"
              component={Loading}
			        options={{
				        headerShown:false,
			        }}
            />
          <Stack.Screen
              name = "Login"
              component={Login}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "Register"
              component={Register}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "ForgotPassword"
              component={ForgotPassword}
			        options={{
				        headerShown:false,
			        }}
            />
          <Stack.Screen
              name = "HomeScreen"
              component={HomeScreen}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "Slots"
              component={Slots}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "Confirm"
              component={Confirm}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "QRCode"
              component={QRcode}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "CurrentTrip"
              component={CurrentTrip}
			        options={{
				        headerShown:false,
			        }}
            />
            {/* ADMITER SCREENS */}
            <Stack.Screen
              name = "Route"
              component={Route}
			        options={{
				        headerShown:false,
			        }}
            />
          <Stack.Screen
              name = "Scan"
              component={Scan}
			        options={{
				        headerShown:false,
			        }}
            />
            <Stack.Screen
              name = "Update"
              component={UpdateProfile}
              options={{
				        headerShown:false,
			        }}
            />
        </Stack.Navigator>     
      </NavigationContainer>
    </Provider>  
  
  );

 
}


