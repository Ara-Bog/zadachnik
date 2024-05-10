import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

const default_data = {
  openDrawer: false,
  drawerData: {
    direction_traning: "",
    type_topic: "",
    name: "",
    discription: "",
    tags: [],
    count_users: 1,
  },
  drawerData__directionsTraning: [],
  drawerData__typesTopic: [],
  loading: false,
};

export const actionsSlice = createSlice({
  name: "actions",
  initialState: {
    ...default_data,
    error: null,
  },
  reducers: {
    setOpenDrawer(state, action) {
      state.drawerData = { ...default_data.drawerData, ...action.payload };
      state.openDrawer = true;
    },
    clearDrawer(state) {
      state.drawerData = default_data.drawerData;
      state.openDrawer = false;
    },
    activateLoading(state) {
      state.loading = true;
    },
    closeLoading(state) {
      state.loading = false;
    },
    setDefaultData(state, actions) {
      state.drawerData__directionsTraning = actions.payload.directions;
      state.drawerData__typesTopic = actions.payload.types;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const getDefaultData = () => async (dispatch) => {
  dispatch(activateLoading());
  try {
    const { data } = await axiosInstance.get("api/default_data/");

    localStorage.setItem("defaultsData", JSON.stringify(data));

    dispatch(setDefaultData(data));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(setError("Ошибка аутентификации"));
    } else if (error.code === "ERR_NETWORK") {
      dispatch(setError("Сервер не доступен"));
    } else {
      dispatch(setError(`Неизвестная ошибка: ${error.message}`));
    }
  }
  dispatch(closeLoading());
};

export const { setOpenDrawer, clearDrawer, setError, clearError, setDefaultData, activateLoading, closeLoading } = actionsSlice.actions;

export default actionsSlice.reducer;
