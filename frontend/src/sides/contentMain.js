import SearchNavbar from "../elements/searchNavbar";
import { Outlet } from "react-router-dom";

export default function ContentMain({ isMain }) {
  return (
    <div className={`main_container${isMain ? "" : " main_container--full"}`}>
      {isMain && <SearchNavbar />}
      <Outlet />
    </div>
  );
}
