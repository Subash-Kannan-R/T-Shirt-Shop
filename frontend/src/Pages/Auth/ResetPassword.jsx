import React, { useState } from 'react';
import { resetPasswordApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      setSubmitting(true);
      // Prefer OTP + email path; fallback to token if provided
      if (email && otp) {
        await resetPasswordApi(undefined, password, email, otp);
      } else {
        await resetPasswordApi(token, password);
      }
      setMessage('Password reset successful. You can now login.');
      setTimeout(() => navigate('/admin/login'), 1200);
    } catch (e) {
      setError(e.message || 'Failed to reset password');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{maxWidth:420,margin:'60px auto', padding: '16px'}}>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}>Reset Password</h2>
      {error && <div style={{color:'#dc2626',marginBottom:12,fontSize:14}}>{error}</div>}
      {message && <div style={{color:'#065f46',marginBottom:12,fontSize:14}}>{message}</div>}
      <form onSubmit={onSubmit}>
        <div style={{marginBottom:12}}>
          <label htmlFor="email" style={{display:'block',fontWeight:600,marginBottom:6}}>Email (for OTP)</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label htmlFor="otp" style={{display:'block',fontWeight:600,marginBottom:6}}>OTP</label>
          <input id="otp" value={otp} onChange={e=>setOtp(e.target.value)} style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label htmlFor="token" style={{display:'block',fontWeight:600,marginBottom:6}}>Token</label>
          <input id="token" value={token} onChange={e=>setToken(e.target.value)} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <div style={{marginBottom:16}}>
          <label htmlFor="password" style={{display:'block',fontWeight:600,marginBottom:6}}>New Password</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <button disabled={submitting} type="submit" style={{width:'100%',background:'#111827',color:'#fff',border:'none',borderRadius:6,padding:'10px 12px',fontWeight:700}}>{submitting ? 'Submitting...' : 'Reset Password'}</button>
      </form>
    </div>
  );
};

export default ResetPassword;
