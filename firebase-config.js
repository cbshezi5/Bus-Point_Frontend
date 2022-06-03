import { initializeApp } from "firebase/app";
import { getFirestore,collection} from "firebase/firestore";




const firebaseConfig = {
    apiKey: "AIzaSyCBd8fRuc7VJMmD7aC-70e-aeJ1d_SN1oU",
    authDomain: "bus-point-376ef.firebaseapp.com",
    projectId: "bus-point-376ef",
    storageBucket: "bus-point-376ef.appspot.com",
    messagingSenderId: "8465229711",
    appId: "1:8465229711:web:0172bbfda401017aa4cdfa",
    measurementId: "G-Y8K2BH28V8"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);


  
  
