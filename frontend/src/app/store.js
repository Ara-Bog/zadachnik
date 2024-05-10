import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
import actionsReducer from "../services/actionsSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    actions: actionsReducer,
  },
});
