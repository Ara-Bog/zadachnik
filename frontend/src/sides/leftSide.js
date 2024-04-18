import { useSelector } from "react-redux";
import Logo from "../elements/logo";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";

const linksMain = [
  { name: "ВКР", to: "/vkr", icon: <ArticleOutlinedIcon /> },
  { name: "Курсовые", to: "/courses", icon: <BookmarkBorderOutlinedIcon /> },
  { name: "Проектная деятельность", to: "/projects", icon: <BusinessCenterOutlinedIcon /> },
];

const linksInner = [
  { name: "Профиль", to: "/profile/info", icon: <PermIdentityIcon /> },
  { name: "Мои темы", to: "/profile/topics", icon: <ArticleOutlinedIcon /> },
  { name: "Распределенные темы", to: "/profile/confirm_topics", icon: <BookmarkBorderOutlinedIcon /> },
  { name: "Проектная деятельность", to: "/profile/projects", icon: <BusinessCenterOutlinedIcon /> },
  { name: "Мои отклики", to: "/profile/feedback", icon: <MarkEmailUnreadOutlinedIcon /> },
];

export default function LeftSideMain({ isMain }) {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="leftSide">
      <div className="navbar">
        <Logo />
      </div>
      <div className="leftSide_wrap" style={!isMain ? { marginBottom: 0 } : null}>
        {isMain ? (
          linksMain.map((item, indx) => (
            <NavLink key={indx} to={item.to} className={({ isActive }) => (isActive ? "link--active" : "")}>
              {item.icon}
              {item.name}
            </NavLink>
          ))
        ) : (
          <>
            {linksInner.map((item, indx) => (
              <NavLink key={indx} to={item.to} className={({ isActive }) => (isActive ? "link--active" : "")}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            <div className="leftSide_wrap__bottom">
              <div className="leftSide_wrap__bottom_content">
                <Avatar src={`http://localhost:8000${userData.avatar}`} sx={{ width: 40, height: 40 }}>
                  {`${userData.surename && userData.surename[0]}${userData.name && userData.name[0]}`}
                </Avatar>
                <div className="leftSide_wrap__bottom_content_info">
                  <span>
                    {userData.surename} {userData.name}
                  </span>
                  <a href={`mailto:${userData.email}`}>{userData.email}</a>
                </div>
              </div>
              <a href="/logout">
                <LogoutTwoToneIcon />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
