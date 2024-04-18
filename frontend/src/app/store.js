import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
