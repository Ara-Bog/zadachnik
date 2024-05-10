import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getCurrentData } from "../services/authSlice";

export default function Profile() {
  const userData = useSelector((store) => store.auth.userData);
  const [data, setData] = useState({ discription: "" });
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.id === undefined) {
      dispatch(getCurrentData());
    }
  }, [data.id, dispatch]);

  useEffect(() => {
    if (JSON.stringify(userData) !== JSON.stringify(data)) {
      setData({ ...userData });
    }
  }, [userData, data]);

  const handleChangeValue = (key, event) => {
    setData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="profile_wrap">
      <h1>Профиль</h1>
      <form className="default_form" onSubmit={handleOnSubmit}>
        <NavLink to={`/user/${userData.id}`} style={{ textDecoration: "underline" }}>
          Страница профиля
        </NavLink>
        <div className="default_form__row">
          <span>Имя</span>
          <input id="name" readOnly value={data.name || ""} />
        </div>
        <div className="default_form__row">
          <span>Фамилия</span>
          <input id="surname" readOnly value={data.surename || ""} />
        </div>
        <div className="default_form__row">
          <span>Отчество</span>
          <input id="midname" readOnly value={data.midname || ""} />
        </div>
        <div className="default_form__row">
          <span>Почта</span>
          <input id="email" readOnly value={data.email || ""} />
        </div>
        {!data.is_teacher && (
          <>
            <div className="default_form__row">
              <span>Направление подготовки</span>
              <input id="direction_traning" readOnly value={data.direction_traning__str || ""} />
            </div>
            <div className="default_form__row">
              <span>Группа</span>
              <input id="group" readOnly value={data.group || ""} />
            </div>
            {data.select_topic && (
              <div className="default_form__row">
                <span>{data.select_topic.type_topic__str}</span>
                <textarea id="selectTopic" rows="4" readOnly value={data.select_topic.name || ""} />
              </div>
            )}
          </>
        )}
        <div className="default_form__row">
          <span>О себе</span>
          <textarea
            id="discription"
            rows="4"
            readOnly={!editing}
            value={data.discription}
            onChange={(event) => handleChangeValue("discription", event)}
          />
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 15 }}>
            <button className="opacity-button bg--green color--green" type="submit">
              Сохранить
            </button>
            <button
              className="opacity-button bg--red color--orange"
              onClick={() => {
                setEditing(false);
                setData(userData);
              }}
            >
              Отменить
            </button>
          </div>
        ) : (
          <button className="fill-button bg--orange" style={{ fontSize: 16 }} onClick={() => setEditing(true)}>
            Изменить
          </button>
        )}
      </form>
    </div>
  );
}
