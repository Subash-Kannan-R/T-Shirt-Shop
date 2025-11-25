import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listOrdersApi, updateOrderStatusApi } from "../../utils/api";

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await listOrdersApi(token);
      setOrders(data);
    } catch (e) {
      setError(e.message || 'Failed to load orders');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const togglePaid = async (o) => {
    setSavingId(o._id);
    try {
      const updated = await updateOrderStatusApi(token, o._id, { isPaid: !o.isPaid, paidAt: !o.isPaid ? new Date() : null });
      setOrders(prev => prev.map(x => x._id === updated._id ? updated : x));
    } catch (e) {
      alert(e.message || 'Update failed');
    } finally { setSavingId(null); }
  };

  const toggleDelivered = async (o) => {
    setSavingId(o._id);
    try {
      const updated = await updateOrderStatusApi(token, o._id, { isDelivered: !o.isDelivered, deliveredAt: !o.isDelivered ? new Date() : null });
      setOrders(prev => prev.map(x => x._id === updated._id ? updated : x));
    } catch (e) {
      alert(e.message || 'Update failed');
    } finally { setSavingId(null); }
  };

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={{color:'#dc2626',marginBottom:12}}>{error}</div>}
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Order</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Customer</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Total</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Paid</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Delivered</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Created</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{o._id.slice(-6)}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{o.user?.name || '-'}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>₹{o.totalPrice ?? o.itemsPrice}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>
                      <span style={{color: o.isPaid ? '#16a34a' : '#dc2626', fontWeight:500}}>
                        {o.isPaid ? (o.paidAt ? new Date(o.paidAt).toLocaleDateString() : 'Yes') : 'No'}
                      </span>
                    </td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>
                      <span style={{color: o.isDelivered ? '#16a34a' : '#dc2626', fontWeight:500}}>
                        {o.isDelivered ? (o.deliveredAt ? new Date(o.deliveredAt).toLocaleDateString() : 'Yes') : 'No'}
                      </span>
                    </td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{new Date(o.createdAt).toLocaleString()}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>
                      <button 
                        disabled={savingId===o._id} 
                        onClick={()=>togglePaid(o)} 
                        style={{
                          marginRight:8,
                          background:'transparent',
                          border: `1px solid ${o.isPaid ? '#dc2626' : '#16a34a'}`,
                          color: o.isPaid ? '#dc2626' : '#16a34a',
                          padding:'4px 8px',
                          borderRadius:4
                        }}
                      >
                        {savingId===o._id ? 'Saving...' : (o.isPaid ? 'Mark Unpaid' : 'Mark Paid')}
                      </button>
                      <button 
                        disabled={savingId===o._id} 
                        onClick={()=>toggleDelivered(o)} 
                        style={{
                          background:'transparent',
                          border: `1px solid ${o.isDelivered ? '#dc2626' : '#16a34a'}`,
                          color: o.isDelivered ? '#dc2626' : '#16a34a',
                          padding:'4px 8px',
                          borderRadius:4
                        }}
                      >
                        {savingId===o._id ? 'Saving...' : (o.isDelivered ? 'Mark Undelivered' : 'Mark Delivered')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
