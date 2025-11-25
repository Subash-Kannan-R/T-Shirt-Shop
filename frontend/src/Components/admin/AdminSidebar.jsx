import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Link to={to} className={`block px-4 py-2 ${pathname === to ? 'font-bold' : ''}`}>{label}</Link>
  );
  return (
    <aside style={{width:240,borderRight:'1px solid #e5e7eb',height:'100%'}}>
      <div style={{padding:"16px",fontWeight:700}}>Admin</div>
      {link('/admin','Dashboard')}
      {link('/admin/products','Products')}
      {link('/admin/orders','Orders')}
      {link('/admin/users','Users')}
    </aside>
  );
};

export default AdminSidebar;
