import { FC } from "react";
import { Outlet } from "react-router-dom";
import { SideNavbar } from "../SideNavbar";
import { TopNavbar } from "../TopNavbar";
import { StyledMainLayout, StyledContent } from "./styles";

export const MainLayout: FC = () => {
  return (
    <StyledMainLayout>
      <SideNavbar />
      <StyledContent>
        <TopNavbar />
        <Outlet />
      </StyledContent>
    </StyledMainLayout>
  );
};
