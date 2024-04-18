import LeftSideMain from "../sides/leftSide";
import RightSide from "../sides/rightSide";
import ContentMain from "../sides/contentMain";
import { Outlet } from "react-router-dom";

export default function MainWrap({ isMain = true }) {
  return (
    <>
      <LeftSideMain isMain={isMain} />
      <ContentMain isMain={isMain}>
        <Outlet />
      </ContentMain>
      {isMain && <RightSide />}
    </>
  );
}
