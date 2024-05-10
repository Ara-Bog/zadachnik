import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import FetchApi from "../services/fetchApi";
import { useDispatch } from "react-redux";

const TEXT_MAPPING = {
  Запрос: "оставил(а) отклик",
  Подтверждение: "принял(а) ваше приглашение",
  Отказ: "отказан",
  Отмена: "отменен",
};

const BUTTONS_TEXT_MAPPING = {
  Подтверждение: "принял(а) ваше приглашение",
  Отказ: "отклонил(а) ваше приглашение",
  Отмена: "отклонил(а) ваше приглашение",
};

export default function NotifyesRows({ data, isExtended, label, user }) {
  const dispatch = useDispatch();

  const actionFeedback = (indx, isConfirm = false) => {
    let newAction = { ...data[indx] };
    newAction.action = isConfirm ? 2 : 3;
    [newAction.user_to, newAction.user_from] = [newAction.user_from, newAction.user_to];

    FetchApi("api/logger", dispatch, "Ошибка при отклике", "post", newAction)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  const Row = ({ item }) =>
    item.action__str === "Запрос" ? (
      <>
        <Avatar src={`http://localhost:8000${item.avatar__from}`} sx={{ width: "40px", height: "40px", fontSize: "16px" }}>
          {`${item.user_from__str[0]}${item.user_from__str.split(" ")[1][0]}`}
        </Avatar>
        <p>
          {item.user_from__str}
          <span> {TEXT_MAPPING[item.action__str]} </span>
          {!isExtended && `на тему ${item.topic__str.slice(0, 30) + (item.topic__str.length > 15 ? "..." : "")}`}
        </p>
      </>
    ) : (
      <>
        <Avatar src={`http://localhost:8000${item.avatar_to}`} sx={{ width: "40px", height: "40px", fontSize: "16px" }}>
          {`${item.user_to__str[0]}${item.user_to__str.split(" ")[1][0]}`}
        </Avatar>
        <p>
          <span>Запрос пользователя </span>
          {item.user_to__str}
          <span> {TEXT_MAPPING[item.action__str]} </span>
          {!isExtended && `на тему ${item.topic__str.slice(0, 30) + (item.topic__str.length > 15 ? "..." : "")}`}
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
                  <Row item={item} mapping={TEXT_MAPPING} />
                </div>
                {item.action === 1 && (
                  <div className="notifyList-extended__buttons">
                    <button className="opacity-button bg--red color--orange" onClick={() => actionFeedback(indx)}>
                      Отклонить
                    </button>
                    <button className="opacity-button bg--green color--green" onClick={() => actionFeedback(indx, true)}>
                      Принять
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={indx} to="/profile/topics">
                <Row item={item} mapping={TEXT_MAPPING} />
              </NavLink>
            )
          )
        : label}
      {}
    </>
  );
}
