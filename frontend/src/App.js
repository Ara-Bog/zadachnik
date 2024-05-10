import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/login";
import MainWrap from "./components/mainWrap";
import { useState, useEffect } from "react";
import { signout, setDataUser, setNotifies } from "./services/authSlice";
import { clearError, setDefaultData, getDefaultData } from "./services/actionsSlice";
import Profile from "./pages/profile";
import ListTopics from "./pages/listTopics";
import TopicPage from "./pages/topicPage";
import UserPage from "./pages/userPage";
import ProjectPage from "./pages/projectPage";
import ProfileTopics from "./pages/profileTopics";
import NotFound from "./pages/notFound";
import ConfirmTopics from "./pages/confirmTopics";
import FeedbacksPage from "./pages/feedbacksPage";
import { addNotifies } from "./services/authSlice";
import { Fab, CircularProgress } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import SearchPage from "./pages/searchPage";
import DrawerTopic from "./components/drawerTopic";

import "./App.css";
import "./sides/sides.css";
import "./pages/pages.css";
import "./components/components.css";
import "./elements/elements.css";

// оболочка авторизированных пользлвателей
const PrivateRoute = ({ token }) => {
  const dispatch = useDispatch();
  const [chatSocket, setChatSocket] = useState(null);

  // при первой иницилизации - устанавливаем соеденение с сокетом
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/nofityes/?token=${token}`);
    setChatSocket(socket);

    return () => {
      socket.close();
    };
  }, [token]);

  useEffect(() => {
    if (!chatSocket) return;
    // когда соеденение с сокетом установленно - добавляем прослушку на получение сообщений
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      dispatch(addNotifies([data.notification]));
    };

    return () => {
      chatSocket.onmessage = null;
    };
  }, [dispatch, chatSocket]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

// оболочка для не авторизированных пользователей
const NoLoginRoute = ({ token }) => {
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default function App() {
  let location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.auth);
  const actions = useSelector((store) => store.actions);
  const [visibleScroller, setVisibleScroller] = useState(false);

  // иницилизация данных пользователя, запускается при изменении токена
  useEffect(() => {
    if (!userData.name) {
      const storedUserData = localStorage.getItem("userData");
      if (userData.token && storedUserData) {
        // получаем из хранилища сохраненные ранее данные
        const user = JSON.parse(storedUserData);
        const NotifyData = JSON.parse(localStorage.getItem("dataNotify"));
        // получения данных для форм
        const defaultsData = JSON.parse(localStorage.getItem("defaultsData"));
        // устанавливаем данные в redux
        dispatch(setDataUser(user));
        dispatch(setNotifies(NotifyData));
        if (defaultsData) {
          dispatch(setDefaultData(defaultsData));
        } else {
          dispatch(getDefaultData());
        }
      }
    }
  }, [dispatch, userData.token, userData.name]);

  // выход пользователя из учетной записи
  useEffect(() => {
    if (location.pathname === "/logout") {
      dispatch(signout());
      navigate("/login");
    }
  }, [dispatch, navigate, location]);

  // появление кнопки скрола вверх
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisibleScroller(true);
      } else {
        setVisibleScroller(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // скрол вверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // обработка ошибок
  useEffect(() => {
    if (actions.error) {
      enqueueSnackbar(actions.error, { variant: "error", horisoznal: "center", vertical: "bottom" });
      dispatch(clearError());
    }
  }, [dispatch, actions.error]);

  // Обработка модальных окон
  useEffect(() => {}, [dispatch, actions.openDrawer, actions.openDialog]);

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
        <div className="App">
          <Routes>
            <Route element={<PrivateRoute token={userData.token} />}>
              <Route path="/" element={<MainWrap isMain={true} />}>
                <Route path="/vkr" element={<ListTopics type={"vkr"} />} />
                <Route path="/courses" element={<ListTopics type={"course"} />} />
                <Route path="/projects" element={<ListTopics type={"project"} />} />
                <Route path="/topic/:id" element={<TopicPage />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="profile" element={<MainWrap isMain={false} />}>
                <Route path="info" element={<Profile />} />
                <Route path="topics" element={<ProfileTopics />} />
                <Route path="confirm_topics" element={<ConfirmTopics />} />
                <Route path="projects/:id" element={<ProjectPage />} />
                <Route path="feedback" element={<FeedbacksPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route element={<NoLoginRoute token={userData.token} />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </div>
      </SnackbarProvider>
      <DrawerTopic />
      {visibleScroller ? (
        <Fab
          sx={{ position: "fixed", bottom: 20, right: 15, backgroundColor: "#F84F39", color: "#fff" }}
          onClick={() => scrollToTop()}
          aria-label="scrollTop"
        >
          <ArrowUpwardRoundedIcon />
        </Fab>
      ) : null}
      {actions.loading ? (
        <div className="loading_wrap">
          <div>
            <CircularProgress size={80} color="warning" />
          </div>
        </div>
      ) : null}
    </>
  );
}
