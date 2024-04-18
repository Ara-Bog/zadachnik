import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";

const date_person = {
  userData: {
    name: null,
    surename: null,
    midname: null,
    email: null,
    is_teacher: false,
    avatar: null,
    addreviated_name: null,
    group: null,
    direction_traning: null,
  },
  notificates: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: Cookies.get("auth-token"),
    ...date_person,
    error: null,
  },
  reducers: {
    signin(state, action) {
      state.token = action.payload;
      state.error = null;
    },
    signout(state) {
      Cookies.remove("auth-token");
      return { token: null, error: null, ...date_person };
    },
    setDataUser(state, action) {
      state.userData = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addNotifies(state, action) {
      const data = [...state.notificates, action.payload];
      localStorage.setItem("dataNotify", JSON.stringify(data));
      state.notificates = data;
    },
    setNotifies(state, action) {
      state.notificates = action.payload;
    },
  },
});

export const signinAsync = (login) => async (dispatch) => {
  try {
    const token = await axiosInstance.post("api-token-auth/", { username: login.username, password: login.password });

    Cookies.set("auth-token", token.data.token);

    const dataUser = await axiosInstance.get("api/users/current-detail/");
    localStorage.setItem("userData", JSON.stringify(dataUser.data));

    const dataNotify = await axiosInstance.get("api/user/notificates_short/");
    localStorage.setItem("dataNotify", JSON.stringify(dataNotify.data));

    dispatch(setDataUser(dataUser.data));
    dispatch(setNotifies(dataNotify.data));
    dispatch(signin(token.data.token));
    return new Promise.resolve();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(setError("Неправильные логин или пароль"));
    } else if (error.code === "ERR_NETWORK") {
      dispatch(setError("Сервер не доступен"));
    } else {
      console.log("test", error);
      dispatch(setError(error.message));
    }
  }
};

export const clearNotificates = () => async (dispatch) => {
  try {
    await axiosInstance.post("api/user/notificates_short/");
    localStorage.setItem("dataNotify", "[]");
    dispatch(setNotifies([]));
  } catch (error) {
    dispatch(setError(`Ошибка при очистке уведомлений: ${error.message}`));
  }
};

export const { signin, setDataUser, signout, setError, addNotifies, setNotifies } = authSlice.actions;

export default authSlice.reducer;
