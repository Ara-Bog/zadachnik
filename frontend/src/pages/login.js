import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signinAsync } from "../services/authSlice";
import Logo from "../elements/logo";

export default function Login() {
  const userLogin = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const onSignIn = async (e) => {
    e.preventDefault();
    dispatch(signinAsync({ username: email, password }));
  };

  useEffect(() => {}, [userLogin.error]);

  return (
    <div className="login_wrap">
      <div className="login_content">
        <Logo />
        <form onSubmit={onSignIn} className="login_content__form">
          <h2>Войдите в аккаунт</h2>
          {userLogin.error && <p>Ошибка входа: {userLogin.error}</p>}
          <div className="login_content__form__content">
            <input id="username" type="text" placeholder="Почта" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input id="password" type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="fill-button bg--orange" style={{ width: "100%" }} type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
