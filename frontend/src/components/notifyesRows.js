import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";

const TEXT_MAPPING = {
  Запрос: "оставил(а) отклик",
  Подтверждение: "принял(а) ваше приглашение",
  Отказ: "отклонил(а) ваше приглашение",
  Отмена: "отклонил(а) ваше приглашение",
};

export default function NotifyesRows({ data, isExtended, label }) {
  const Row = ({ item }) => (
    <>
      <Avatar src={`http://localhost:8000${item.avatar}`} sx={{ width: "40px", height: "40px", fontSize: "16px" }}>
        {`${item.user_from[0]}${item.user_from.split(" ")[1][0]}`}
      </Avatar>
      <p>
        {item.user_from} <span>{TEXT_MAPPING[item.action]} на тему</span>
        {!isExtended && item.topic}
      </p>
    </>
  );

  return (
    <>
      {data.length
        ? data.map((item, indx) =>
            isExtended ? (
              <div className="notifyList-extended" key={indx}>
                <div className="notifyList-extended__content">
                  <Row item={item} />
                </div>
                <div className="notifyList-extended__buttons">
                  <button className="opacity-button bg--red color--orange">Отклонить</button>
                  <button className="opacity-button bg--green color--green">Принять</button>
                </div>
              </div>
            ) : (
              <NavLink key={indx} href="/profile/feedback">
                <Row item={item} />
              </NavLink>
            )
          )
        : label}
      {}
    </>
  );
}
