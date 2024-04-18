import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <NavLink className="logo" to="/vkr">
      <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" />
      <span>темовик</span>
    </NavLink>
  );
}
