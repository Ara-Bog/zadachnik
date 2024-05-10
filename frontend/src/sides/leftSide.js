import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../elements/logo";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import FetchApi from "../services/fetchApi";
import Tooltip from "@mui/material/Tooltip";

const LINKS = [
  [
    { name: "Профиль", to: "/profile/info", icon: <PermIdentityIcon /> },
    { name: "Мои темы", to: "/profile/topics", icon: <ArticleOutlinedIcon /> },
    { name: "Распределенные темы", to: "/profile/confirm_topics", icon: <BookmarkBorderOutlinedIcon /> },
    { name: "Проектная деятельность", to: "/profile/projects", icon: <BusinessCenterOutlinedIcon />, droplist: true },
    { name: "Мои отклики", to: "/profile/feedback", icon: <MarkEmailUnreadOutlinedIcon /> },
  ],
  [
    { name: "ВКР", to: "/vkr", icon: <ArticleOutlinedIcon /> },
    { name: "Курсовые", to: "/courses", icon: <BookmarkBorderOutlinedIcon /> },
    { name: "Проектная деятельность", to: "/projects", icon: <BusinessCenterOutlinedIcon /> },
  ],
];

export default function LeftSideMain({ isMain }) {
  const userData = useSelector((state) => state.auth.userData);
  const [subTree, setSubTree] = useState(false);
  const [subTreeData, setSubData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const dispatch = useDispatch();

  const getSubTopics = () => {
    FetchApi(`api/my_projects_list`, dispatch, "Ошибка получения списка тем")
      .then((data) => {
        setSubData(data);
        setDataLoading(true);
        setSubTree(true);
      })
      .catch(() => {});
  };

  const handleOpenTree = () => {
    if (dataLoading) {
      setSubTree(!subTree);
    } else {
      getSubTopics();
    }
  };

  return (
    <div className="leftSide">
      <div className="navbar">
        <Logo />
      </div>
      <div className="leftSide_wrap" style={!isMain ? { marginBottom: 0 } : null}>
        {LINKS[+isMain].map((item, indx) => (
          <Fragment key={indx}>
            {item.droplist ? (
              <>
                <span className={subTree ? "link--active" : ""} onClick={handleOpenTree}>
                  {item.icon}
                  {item.name}
                  <KeyboardArrowUpIcon
                    sx={{
                      ...(subTree ? { transform: "rotate(180deg)" } : {}),
                      marginLeft: "auto",
                      transition: ".2s ease",
                    }}
                  />
                </span>
                <Collapse in={subTree} timeout="auto" unmountOnExit>
                  <div className="navbar_droplist">
                    {subTreeData.map((subItem, indxSub) => (
                      <Tooltip title={subItem.name} key={indxSub}>
                        <NavLink to={`${item.to}/${subItem.id}`}>
                          {subItem.name.slice(0, 30)}
                          {subItem.name.length > 30 ? "..." : ""}
                        </NavLink>
                      </Tooltip>
                    ))}
                  </div>
                </Collapse>
              </>
            ) : (
              <NavLink to={item.to} className={({ isActive }) => (isActive ? "link--active" : "")}>
                {item.icon}
                {item.name}
              </NavLink>
            )}
          </Fragment>
        ))}

        {!isMain && (
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
        )}
      </div>
    </div>
  );
}
