import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import { setuserData } from "../services/authSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import { clearNotificates, addNotifies } from "../services/authSlice";
import Feedbacks from "../components/notifyesRows";

const menuLinks = [
  { name: "Профиль", to: "/profile/info", icon: <PermIdentityIcon /> },
  { name: "Мои темы", to: "/profile/topics", icon: <ArticleOutlinedIcon /> },
  { name: "Распределенные темы", to: "/profile/confirm_topics", icon: <BookmarkBorderOutlinedIcon /> },
  { name: "Проектная деятельность", to: "/profile/projects", icon: <BusinessCenterOutlinedIcon /> },
  { name: "Мои отклики", to: "/profile/feedback", icon: <MarkEmailUnreadOutlinedIcon /> },
];

export default function RightSide() {
  const userData = useSelector((state) => state.auth.userData);
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);

  // notify
  const notifyes = useSelector((state) => state.auth.notificates);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const notifyRef = useRef(null);
  const menuButtonRef = useRef(null);
  const notifyButtonRef = useRef(null);

  // костыль на закрытие менюшек при аутсайд клике
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target) && !notifyButtonRef.current.contains(event.target)) {
        setOpenNotify(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="rightSide">
      {console.log("test", notifyes)}
      <div className="navbar">
        <div className="navbar__user">
          <Badge
            ref={notifyButtonRef}
            variant="dot"
            onClick={() => setOpenNotify(!openNotify)}
            invisible={notifyes.length === 0}
            sx={{ cursor: "pointer" }}
          >
            <NotificationsNoneIcon />
          </Badge>
          {/* меню для уведомлений */}
          <div ref={notifyRef} className={`notiMenu${openNotify ? " menu--open" : ""}`}>
            <div className="notiMenu__header">
              <span>Уведомления</span>
              {notifyes.length !== 0 ? (
                <button className="button-text color--orange" onClick={() => dispatch(clearNotificates())}>
                  очистить
                </button>
              ) : null}
            </div>
            <div className="notiMenu__content notifyList">
              <Feedbacks data={notifyes} label={"Нет новых уведомлений"} />
            </div>
          </div>
          <Avatar
            onClick={() => setOpenMenu(!openMenu)}
            ref={menuButtonRef}
            src={`http://localhost:8000${userData.avatar}`}
            sx={{ width: 46, height: 46, cursor: "pointer" }}
          >
            {`${userData.surename && userData.surename[0]}${userData.name && userData.name[0]}`}
          </Avatar>
          {/* меню для профиля */}
          <div ref={menuRef} className={`userMenu${openMenu ? " menu--open" : ""}`}>
            {menuLinks.map((item, indx) => (
              <NavLink key={indx} to={item.to}>
                {item?.icon}
                {item.name}
              </NavLink>
            ))}
            <span></span>
            <a href="/logout">
              <LogoutTwoToneIcon />
              Выход
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
