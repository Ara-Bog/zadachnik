import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Profile() {
  const userData = useSelector((store) => store.auth.userData);
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setData(userData);
  }, [userData]);

  const handleChangeValue = (key, event) => {
    setData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="profile_wrap">
      <h1>Профиль</h1>
      <form onSubmit={handleOnSubmit}>
        <NavLink to={`/user/${userData.id}`}>Страница профиля</NavLink>
        <div className="profile_form__row">
          <span>Имя</span>
          <input readOnly value={data.name} />
        </div>
        <div className="profile_form__row">
          <span>Фамилия</span>
          <input readOnly value={data.surename} />
        </div>
        <div className="profile_form__row">
          <span>Отчество</span>
          <input readOnly value={data.midname} />
        </div>
        <div className="profile_form__row">
          <span>Почта</span>
          <input readOnly value={data.email} />
        </div>
        {!data.is_teacher && (
          <>
            <div className="profile_form__row">
              <span>Направление подготовки</span>
              <input readOnly value={data.direction_traning} />
            </div>
            <div className="profile_form__row">
              <span>Группа</span>
              <input readOnly value={data.group} />
            </div>
          </>
        )}
        <div className="profile_form__row">
          <span>О себе</span>
          <textarea rows="4" readOnly={!editing} value={data.discription} onChange={(event) => handleChangeValue("discription", event)} />
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
