import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./bottom-nav/BottomNav";
import Sidebar from "./sidebar/Sidebar";

const Layout = (props) => {
  const { children } = props;
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setShowNav(path !== "/login" && path !== "/register" && path !== "/");
  }, [location]);

  return (
    <>
      {showNav && (
        <>
          <BottomNav />
          <Sidebar />
        </>
      )}
      {children}
    </>
  );
};

export default Layout;
