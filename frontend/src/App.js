import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/login";
import MainWrap from "./components/mainWrap";
import { useState, useEffect } from "react";
import { signout, setDataUser, setNotifies } from "./services/authSlice";
import Profile from "./pages/profile";
import ListTopics from "./pages/listTopics";
import TopicPage from "./pages/topicPage";
import UserPage from "./pages/userPage";
import ProfileTopics from "./pages/profileTopics";
import NotFound from "./pages/notFound";
import { clearNotificates, addNotifies } from "./services/authSlice";
import Fab from "@mui/material/Fab";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import "./App.css";
import "./sides/sides.css";
import "./pages/pages.css";
import "./components/components.css";
import "./elements/elements.css";

const PrivateRoute = ({ token }) => {
  const dispatch = useDispatch();
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/nofityes/?token=${token}`);
    setChatSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!chatSocket) return;
    // когда соеденение с сокетом установленно - добавляем прослушку на получение сообщений
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log("MSG: ", data);
      dispatch(addNotifies(data.notification));
    };

    return () => {
      chatSocket.onmessage = null;
    };
  }, [chatSocket]);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

const NoLoginRoute = ({ token }) => {
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default function App() {
  let location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((store) => store.auth.token);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (token && storedUserData) {
      const storedNotifyData = localStorage.getItem("dataNotify");
      const userData = JSON.parse(storedUserData);
      const NotifyData = JSON.parse(storedNotifyData);
      dispatch(setDataUser(userData));
      dispatch(setNotifies(NotifyData));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (location.pathname === "/logout") {
      dispatch(signout());
      localStorage.clear();
      navigate("/login");
    }
  }, [dispatch, navigate, location]);
  const [visibleScroller, setVisibleScroller] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="App">
        <Routes>
          <Route element={<PrivateRoute token={token} />}>
            <Route path="/" element={<MainWrap isMain={true} />}>
              <Route path="/vkr" element={<ListTopics type={"vkr"} />} />
              <Route path="/courses" element={<ListTopics type={"course"} />} />
              <Route path="/projects" element={<ListTopics type={"project"} />} />
              <Route path="/topic/:id" element={<TopicPage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="profile" element={<MainWrap isMain={false} />}>
              <Route path="info" element={<Profile />} />
              <Route path="topics" element={<ProfileTopics />} />
              <Route path="confirm_topics" element={<ProfileTopics isDistributed={true} />} />
              <Route path="projects" element={<ListTopics />} />
              <Route path="feedback" element={<ListTopics />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          <Route element={<NoLoginRoute token={token} />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </div>
      {visibleScroller && (
        <Fab
          sx={{ position: "fixed", bottom: 20, right: 15, backgroundColor: "#F84F39", color: "#fff" }}
          onClick={() => scrollToTop()}
          aria-label="scrollTop"
        >
          <ArrowUpwardRoundedIcon />
        </Fab>
      )}
    </>
  );
}
