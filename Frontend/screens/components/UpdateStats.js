import React from 'react'
import { doc,updateDoc ,getDocs,query,collection} from "firebase/firestore"
import { db } from '../../firebase-config';

export default async function StatUpdate(statName)
{
    let currentState
    await getDocs(
        query(collection(db,"Stats")))
        .then((data)=>
        {currentState = data.docs
        .map(data =>({ Value : data.get(statName)}))
    })

    let newVal = (currentState[0].Value + 1)

    let docRef = doc(db,"Stats","NYKszfIuBQcYOPStovTN")
    
    
    switch (statName) {
        case "active_trips":
            updateDoc(docRef,{ active_trips : newVal})
            break;
        case "active_users":
            updateDoc(docRef,{ active_users : newVal})
            break;
        case "deleted_trips":
            updateDoc(docRef,{ deleted_trips : newVal})
            break;
        case "expired_trips":
            updateDoc(docRef,{ expired_trips : newVal})
            break;
        case "temp_trips":
            updateDoc(docRef,{ temp_trips : newVal})
            break;
        case "used_trips":
            updateDoc(docRef,{ used_trips : newVal})
            break;
    }


}