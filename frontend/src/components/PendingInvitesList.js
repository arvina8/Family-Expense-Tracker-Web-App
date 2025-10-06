import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Clock, Mail, RefreshCcw } from 'lucide-react';

const PendingInvitesList = ({ refreshKey }) => {
  const { currentGroup } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!currentGroup) return;
    setLoading(true);
    try {
      const res = await client.get(`/groups/${currentGroup}/invites`);
      setInvites(res.data);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, [currentGroup, refreshKey]);

  if (!currentGroup) return null;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Clock className="w-4 h-4"/>Pending Invites</h4>
        <button onClick={load} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1"><RefreshCcw className="w-3 h-3"/>Reload</button>
      </div>
      {loading && <div className="text-xs text-gray-500">Loading invites...</div>}
      {(!loading && invites.length === 0) && <div className="text-xs text-gray-500">No pending invites</div>}
      <ul className="space-y-1">
        {invites.map(inv => (
          <li key={inv.token} className="flex items-center justify-between text-xs bg-white border rounded px-2 py-1">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{inv.email}</span>
            <span className="text-gray-500">expires {new Date(inv.expiresAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingInvitesList;
