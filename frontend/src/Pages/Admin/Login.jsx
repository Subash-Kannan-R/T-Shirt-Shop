import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../utils/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setSubmitting(true);
    try {
      const data = await loginApi(email, password);
      const payload = { user: { _id: data._id, name: data.name, email: data.email, role: data.role }, token: data.token };
      login(payload);
      if (data.role === 'admin') {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{maxWidth:420,margin:'60px auto', padding: '16px'}}>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}>Admin Login</h2>
      {error && <div style={{color:'#dc2626',marginBottom:12,fontSize:14}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div style={{marginBottom:12}}>
          <label htmlFor="email" style={{display:'block',fontWeight:600,marginBottom:6}}>Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <div style={{marginBottom:16}}>
          <label htmlFor="password" style={{display:'block',fontWeight:600,marginBottom:6}}>Password</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <button disabled={submitting} type="submit" style={{width:'100%',background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'10px 12px',fontWeight:700}}>{submitting ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
