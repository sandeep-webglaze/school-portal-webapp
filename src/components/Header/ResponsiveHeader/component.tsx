"use client";
import React, { FC, Fragment, useState } from "react";
import { Header } from "..";
import { MenuOverlay } from "../MenuOverlay";
import { IUser } from "@/api/CurrentUser";
import { IAppConfig } from "@/api/AppConfig";
import TopBar from "../TopBar/component";

type ResponsiveHeaderProps = {
  user: IUser | null;
  // Threaded from the root layout so the header renders the admin-configured
  // contact + social details server-side (same config the Footer receives),
  // instead of relying on the client-only Zustand store which is empty on
  // first paint / for crawlers.
  config?: IAppConfig;
};
const ResponsiveHeader: FC<ResponsiveHeaderProps> = ({ user, config }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <Fragment>
      <TopBar config={config} />
      <Header
        user={user}
        config={config}
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
