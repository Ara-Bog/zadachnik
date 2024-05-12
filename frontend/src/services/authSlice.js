import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "./axiosInstance";
import { setError, activateLoading, closeLoading } from "./actionsSlice";

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
  },
  reducers: {
    signin(state, action) {
      state.token = action.payload;
      state.error = null;
    },
    signout(state) {
      Cookies.remove("auth-token");
      localStorage.clear();
      return { token: null, error: null, ...date_person };
    },
    setDataUser(state, action) {
      state.userData = action.payload;
    },
    addNotifies(state, action) {
      const data = [...state.notificates, ...action.payload];
      localStorage.setItem("dataNotify", JSON.stringify(data));
      state.notificates = data;
    },
    setNotifies(state, action) {
      state.notificates = action.payload;
    },
  },
});

export const signinAsync = (login) => async (dispatch) => {
  // устанавливаем статус загрузки контента
  dispatch(activateLoading());
  try {
    // получаем токен с сервера
    const token = await axiosInstance.post("api-token-auth/", { username: login.username, password: login.password });

    // сохраняем токен в куках
    Cookies.set("auth-token", token.data.token);

    // получаем данные пользователя
    const dataUser = await axiosInstance.get("api/users/current-detail/");
    // сохраняем данные пользователя в локальном хранилище
    localStorage.setItem("userData", JSON.stringify(dataUser.data));

    // получаем последние не прочитанные уведомления
    const dataNotify = await axiosInstance.get("api/user/notificates_short/");
    // сохраняем уведомления в локальном хранилище
    localStorage.setItem("dataNotify", JSON.stringify(dataNotify.data));

    // производим обновление состояний в redux
    dispatch(setDataUser(dataUser.data));
    dispatch(setNotifies(dataNotify.data));
    dispatch(signin(token.data.token));
  } catch (error) {
    // обрабатываем ошибки и фиксируем их в другой система управления состояний
    if (error.response && error.response.status === 401) {
      dispatch(setError("Неправильные логин или пароль"));
    } else if (error.code === "ERR_NETWORK") {
      dispatch(setError("Сервер не доступен"));
    } else {
      dispatch(setError(`Неизвестная ошибка: ${error.message}`));
    }
  } finally {
    // загрузка контента окончена
    dispatch(closeLoading());
  }
};

export const getCurrentData = () => async (dispatch) => {
  dispatch(activateLoading());
  try {
    const dataUser = await axiosInstance.get("api/users/current-detail/");
    localStorage.setItem("userData", JSON.stringify(dataUser.data));

    dispatch(setDataUser(dataUser.data));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(setError("Ошибка получения данных пользователя"));
    } else if (error.code === "ERR_NETWORK") {
      dispatch(setError("Сервер не доступен"));
    } else {
      dispatch(setError(`Неизвестная ошибка: ${error.message}`));
    }
  }

  dispatch(closeLoading());
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

export const { signin, setDataUser, signout, addNotifies, setNotifies } = authSlice.actions;

export default authSlice.reducer;
