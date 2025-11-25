import React, { useState } from 'react';
import { forgotPasswordApi } from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      setSubmitting(true);
      const res = await forgotPasswordApi(email);
      setMessage('If that email exists, a reset link has been sent. Token: ' + (res.token || 'sent to email'));
    } catch (e) {
      setError(e.message || 'Failed to request reset');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{maxWidth:420,margin:'60px auto', padding: '16px'}}>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}>Forgot Password</h2>
      {error && <div style={{color:'#dc2626',marginBottom:12,fontSize:14}}>{error}</div>}
      {message && <div style={{color:'#065f46',marginBottom:12,fontSize:14}}>{message}</div>}
      <form onSubmit={onSubmit}>
        <div style={{marginBottom:12}}>
          <label htmlFor="email" style={{display:'block',fontWeight:600,marginBottom:6}}>Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'10px 12px'}} />
        </div>
        <button disabled={submitting} type="submit" style={{width:'100%',background:'#111827',color:'#fff',border:'none',borderRadius:6,padding:'10px 12px',fontWeight:700}}>{submitting ? 'Submitting...' : 'Send Reset Link'}</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
