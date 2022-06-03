import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    origin : null,
    destination : null,
    time : null,
    drawerState: null,
    musicIsRequired: null,
    stNumber: null,
    email:null,
    firstName:null,
    lastName:null,
}

export const navSlice = createSlice({
    name :'nav',
    initialState,
    reducers: {
        setOrigin: (state,action) =>{
            state.origin = action.payload;
        },
        
        setDestination: (state,action) =>{
            state.destination = action.payload;
        },

        setTime: (state,action) =>{
            state.time = action.payload;
        }, 

        setDrawerState: (state,action) => {
            state.drawerState = action.payload;
        },

        setMusic: (state,action) => {
            state.musicIsRequired = action.payload;
        },

        setStNumber: (state,action) => {
            state.stNumber = action.payload;
        },
        setEmail: (state,action) => {
            state.email = action.payload;
        },
        setFirstName: (state,action) => {
            state.firstName = action.payload;
        },
        setLastName: (state,action) => {
            state.lastName = action.payload;
        }
    },
});

//push in data
export const { setOrigin, setDestination, setTime, setDrawerState,setMusic,setStNumber,setEmail,setFirstName,setLastName } = navSlice.actions;

//pull out data
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTime = (state) => state.nav.time;
export const selectDrawerState = (state) => state.nav.drawerState;
export const selectMusic = (state) => state.nav.musicIsRequired;
export const selectStNumber = (state) => state.nav.stNumber;
export const selectEmail = (state) => state.nav.email;
export const selectFirstName = (state) => state.nav.firstName;
export const selectLastName = (state) => state.nav.lastName;

export default navSlice.reducer;

//setOriginCurrent,selectOriginCurrent