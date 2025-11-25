import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listOrdersApi, listProductsApi, listUsersApi, listCategoriesApi } from "../../utils/api";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const [o, p, u, c] = await Promise.all([
          listOrdersApi(token),
          listProductsApi(),
          listUsersApi(token),
          listCategoriesApi()
        ]);
        setOrders(o); setProducts(p); setUsers(u); setCategories(c);
      } catch (e) {
        setError(e.message || 'Failed to load stats');
      } finally { setLoading(false); }
    };
    load();
  }, [token]);

  const revenue = useMemo(() => orders.reduce((sum, o) => sum + (o.totalPrice ?? o.itemsPrice ?? 0), 0), [orders]);

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Overview</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={{color:'#dc2626',marginBottom:12}}>{error}</div>}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:12}}>
            <div style={{border:'1px solid #e5e7eb',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Total Orders</div>
              <div style={{fontSize:22,fontWeight:700}}>{orders.length}</div>
            </div>
            <div style={{border:'1px solid #e5e7eb',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Revenue</div>
              <div style={{fontSize:22,fontWeight:700}}>₹{revenue.toFixed(2)}</div>
            </div>
            <div style={{border:'1px solid #e5e7eb',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Products</div>
              <div style={{fontSize:22,fontWeight:700}}>{products.length}</div>
            </div>
            <div style={{border:'1px solid #e5e7eb',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#6b7280'}}>Users</div>
              <div style={{fontSize:22,fontWeight:700}}>{users.length}</div>
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div style={{fontWeight:700,marginBottom:8}}>Recent Orders</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Order</th>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Customer</th>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Total</th>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Paid</th>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Delivered</th>
                    <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0,5).map(o => (
                    <tr key={o._id}>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>#{o._id.slice(-6)}</td>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{o.user?.name || '-'}</td>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>₹{o.totalPrice ?? o.itemsPrice}</td>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{o.isPaid ? 'Yes' : 'No'}</td>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{o.isDelivered ? 'Yes' : 'No'}</td>
                      <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
