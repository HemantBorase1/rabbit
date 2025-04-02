import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import produtReducer from "./Slice/productSlice";
import cartReducer from "./Slice/cartSlice";
import checkoutReducer from "./Slice/checkoutSlice";
import orderReducer from "./Slice/orderSlice";
import adminReducer from "./Slice/adminSlice";
import adminProductReducer from './Slice/adminProductSlice';
import adminOrderReducer from './Slice/adminOrderSlice';


const store=configureStore({
    reducer:{
        auth:authReducer,
        products:produtReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        orders:orderReducer,
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders:adminOrderReducer,
    },
});

export default store;