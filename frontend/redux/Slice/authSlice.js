import{createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//Retrive user info & token from localStorage if available
const userFormStorage=localStorage.getItem("userInfo")
? JSON.parse(localStorage.getItem("userInfo"))
:null;

//Check for an Existing guest ID in the localStorage or generate a new One
const initialGuestId=
localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId",initialGuestId);

// Initial State
const initialState={
    user:userFormStorage,
    guestId:initialGuestId,
    loading:false,
    error:null,
};

//Async Thank For User Login
export const loginUser=createAsyncThunk(
    "auth/loginUser",
    async(userData,{rejectedWithValue})=>{
        try {
            const response=await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            localStorage.setItem("userInfo",JSON.stringify(response.data.user));
            localStorage.setItem("userToken",response.data.token);

            return response.data.user;// Return the User Object From the Resonse
        } catch (error) {
            return rejectedWithValue(error.response.data);
        }
    }
);

//Async Thank For User Registration
export const registerUser=createAsyncThunk(
    "auth/registerUser",
    async(userData,{rejectedWithValue})=>{
        try {
            const response=await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            localStorage.setItem("userInfo",JSON.stringify(response.data.user));
            localStorage.setItem("userToken",response.data.token);

            return response.data.user;// Return the User Object From the Resonse
        } catch (error) {
            return rejectedWithValue(error.response.data);
        }
    }
);

//Slice 
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.guestId=`guest_${new Date().getTime()}` // Reset Guest ID on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId",state.guestId); // Set new guest Id in localstorage
        },
        generateNewGuestId:(state)=>{
            state.guestId=`guest_${new Date().getTime()}`;
            localStorage.setItem("guestId",state.guestId);
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
        .addCase(registerUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
    }
});

export const{logout,generateNewGuestId}=authSlice.actions;
export default authSlice.reducer;