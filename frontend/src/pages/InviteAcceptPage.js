import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setCurrentGroup, refreshUser } = useAuth();
  const [status,setStatus] = useState('pending');
  const [message,setMessage] = useState('Accepting invite...');

  useEffect(()=>{
    let mounted = true;
    client.post(`/groups/invites/${token}/accept`).then(async res => {
      if(!mounted) return; setStatus('accepted'); setMessage('Invite accepted! Redirecting...');
      setCurrentGroup(res.data.groupId);
      try { await refreshUser(); } catch(e){ /* ignore */ }
      setTimeout(()=> navigate(`/app/${res.data.groupId}/dashboard`), 1200);
    }).catch(err => {
      if(!mounted) return; setStatus('error'); setMessage(err.response?.data?.message || 'Failed to accept invite');
    });
    return ()=>{ mounted=false; };
  },[token,navigate,setCurrentGroup]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="bg-white shadow rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">Group Invitation</h1>
        <p className={status==='error' ? 'text-red-600' : 'text-gray-700'}>{message}</p>
      </div>
    </div>
  );
};
export default InviteAcceptPage;
