import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles, publicOnly = false }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // if (isLoading) return <h1>Loading...</h1>;

  // const getRoleHome = () => {
  //   if (user?.role === "admin") return "/admin";
  //   if (user?.role === "co-admin") return "/coadmin";
  //   return "/user-dashboard";
  // };

  // if (publicOnly && user) {
  //   return <Navigate to={getRoleHome()} replace />;
  // }

  // if (!publicOnly && !user) {
  //   return <Navigate to="/" replace />;
  // }

  // if (allowedRoles && !allowedRoles.includes(user?.role)) {
  //   return <Navigate to={getRoleHome()} replace />;
  // }

  return <Outlet />;
};

export default ProtectRoute;