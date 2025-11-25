import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/admin/AdminSidebar";
import AdminHeader from "../Components/admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 64px)'}}>
      <AdminSidebar />
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <AdminHeader />
        <main style={{padding:16}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
