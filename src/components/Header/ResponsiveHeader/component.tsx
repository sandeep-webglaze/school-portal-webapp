"use client";
import React, { FC, Fragment, useState } from "react";
import { Header } from "..";
import { MenuOverlay } from "../MenuOverlay";
import { IUser } from "@/api/CurrentUser";
import { IAppConfig } from "@/api/AppConfig";
import TopBar from "../TopBar/component";

type ResponsiveHeaderProps = {
  user: IUser | null;
  config?: IAppConfig;
};
const ResponsiveHeader: FC<ResponsiveHeaderProps> = ({ user, config }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Top contact bar shows on every page (including home), and the header stays
  // solid white so the bar is always visible on a single line above it.
  return (
    <Fragment>
      <TopBar config={config} />
      <Header
        user={user}
        config={config}
        overlay={false}
        navbarOpen={navbarOpen}
        setNavbarOpen={setNavbarOpen}
      />
      <MenuOverlay
        user={user}
        config={config}
        navbarOpen={navbarOpen}
        setNavbarOpen={setNavbarOpen}
      />
    </Fragment>
  );
};

export { ResponsiveHeader };
