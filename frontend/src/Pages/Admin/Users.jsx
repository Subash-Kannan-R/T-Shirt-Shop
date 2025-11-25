import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listUsersApi } from "../../utils/api";

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await listUsersApi(token);
      setUsers(data);
    } catch (e) {
      setError(e.message || 'Failed to load users');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={{color:'#dc2626',marginBottom:12}}>{error}</div>}
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Name</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Email</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Role</th>
                  <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{u.name}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{u.email}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{u.role}</td>
                    <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{new Date(u.createdAt).toLocaleString()}</td>
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

export default AdminUsers;
