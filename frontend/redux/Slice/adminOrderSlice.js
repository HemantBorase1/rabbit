import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


const API_URL=`${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN=`Bearer ${localStorage.getItem("userToken")}`;
// fetch all Orders (admin)
export const fetchAllOrders=createAsyncThunk("adminOrders/fetchAllOrders",
    async(_DO_NOT_USER_ActionTypes,{rejectWithValue})=>{
        try {
            const response=await axios.get(
                `${API_URL}/api/admin/orders`,
                {
                    headers:{
                        Authorization:USER_TOKEN,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update order status
export const updateOrderStatus=createAsyncThunk("adminOrders/updateOrderStatus",
    async({id,status},{rejectWithValue})=>{
        try {
            const response=await axios.put(
                `${API_URL}/api/admin/orders/${id}`,{status},
                {
                    headers:{
                        Authorization:USER_TOKEN,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete an Order
export const deleteOrder=createAsyncThunk("adminOrders/deleteOrder",
    async(id,{rejectWithValue})=>{
        try {
           await axios.delete(
                `${API_URL}/api/admin/orders/${id}`,
                {
                    headers:{
                        Authorization:USER_TOKEN,
                    }
                }
            )
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminOrderSlice=createSlice({
    name:"adminOrders",
    initialState:{
        orders:[],
        totalOrders:0,
        totalSales:0,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // Fetch all orders
        .addCase(fetchAllOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload;
            state.totalOrders=action.payload.length;

            // Calculate total Sales
            const totalSales=action.payload.reduce((acc,order)=>{
                return acc+order.totalPrice;
            },0);
            state.totalSales=totalSales;
        })
        .addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to fetch orders";
        })
        // Update Order Status
        .addCase(updateOrderStatus.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const updatedOrder=action.payload;
            const orderIndex=state.orders.findIndex(
                (order)=>order._id===updatedOrder._id
            );
            if(orderIndex!==-1){
                state.orders[orderIndex]=updatedOrder;
            }
        })
        .addCase(updateOrderStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to update order status";
        })
        // Delete an Order
        .addCase(deleteOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=state.orders.filter(
                (order)=>order._id!==action.payload
            );
            state.totalOrders=state.orders.length;
            // Recalculate total sales
            state.totalSales=state.orders.reduce((acc,order)=>{
                return acc+order.totalPrice;
            },0);
        })
        .addCase(deleteOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "Failed to delete order";
        });
    }
});

export default adminOrderSlice.reducer;