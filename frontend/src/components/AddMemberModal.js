import React, { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Mail, UserPlus } from 'lucide-react';

const AddMemberModal = ({ open, onClose, onInvited }) => {
  const { currentGroup } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    setInviteLink('');
    try {
      const res = await client.post(`/groups/${currentGroup}/invite`, { email, role });
      if (res.data.status === 'added') {
        setStatus('added');
        onInvited && onInvited();
      } else {
        setStatus('invited');
        setInviteLink(res.data.inviteLink);
        onInvited && onInvited();
      }
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite');
      setStatus('error');
    }
  };

  const copyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" /> Invite or Add Member
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="user@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            <button disabled={status==='loading'} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {status==='loading' ? 'Sending...' : 'Send Invite'}
            </button>
          </form>

          {status === 'invited' && inviteLink && (
            <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
              <div className="font-medium text-blue-700 mb-1">Invitation Created</div>
              <div className="break-all text-blue-800 mb-2">{inviteLink}</div>
              <button onClick={copyLink} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Copy Link</button>
            </div>
          )}
          {status === 'added' && (
            <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-700">Existing user added to group.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
