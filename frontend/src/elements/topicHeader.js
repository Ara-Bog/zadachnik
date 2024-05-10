import Avatar from "@mui/material/Avatar";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

export default function TopicHeader({ avatar, user, date_create, direction_traning__str, count_users, select_users }) {
  return (
    <div className="topic__header">
      <Avatar src={`http://localhost:8000${avatar}`} sx={{ width: 40, height: 40 }}>
        {`${user[0]}${user.split(" ")[1][0]}`}
      </Avatar>
      <div className="topic__header__user">
        <span>{user}</span>
        {date_create && (
          <p>
            {direction_traning__str} • {date_create}
          </p>
        )}
      </div>
      {count_users && count_users > 1 && (
        <div className="topic__header__counter">
          <PersonOutlineRoundedIcon sx={{ width: 20, height: 20 }} />
          {`${select_users} из ${count_users}`}
        </div>
      )}
    </div>
  );
}
