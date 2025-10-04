import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const GroupSelect = () => {
  const { user, setCurrentGroup, currentGroup, refreshUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const load = async () => {
    const res = await client.get('/groups/mine');
    setGroups(res.data.map(m => ({ ...m.group, role: m.role })));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (searchParams.get('create')) {
      const el = document.getElementById('create-group-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    const join = searchParams.get('join');
    if (join) {
      setJoinCode(join);
      const el = document.getElementById('join-group-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  const createGroup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await client.post('/groups', { name });
      setName('');
      await load();
      setCurrentGroup(res.data._id);
      await refreshUser();
      navigate(`/app/${res.data._id}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    }
  };

  const joinGroup = async (e) => {
    e.preventDefault();
    setError('');
    setJoining(true);
    try {
      const res = await client.post('/groups/join', { groupIdOrCode: joinCode.trim() });
      await refreshUser();
      setCurrentGroup(res.data.groupId);
      navigate(`/app/${res.data.groupId}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Select a group</h1>
        {user && <div className="text-gray-600 mb-4">Logged in as {user.name} • {user.email}</div>}

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold mb-2">Your groups</h2>
          <div className="space-y-2 mb-6">
            {groups.length === 0 && <div className="text-gray-500">No groups yet.</div>}
            {groups.map(g => (
              <div key={g._id} className={`p-3 border rounded flex items-center justify-between ${currentGroup === g._id ? 'bg-blue-50 border-blue-300' : ''}`}>
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-gray-500">Role: {g.role}</div>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { setCurrentGroup(g._id); navigate(`/app/${g._id}/dashboard`); }}>Open</button>
              </div>
            ))}
          </div>
          {error && <div className="bg-red-50 text-red-700 p-2 rounded mb-4">{error}</div>}
          <div id="join-group-section" className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-2">Join a group</h3>
            <form onSubmit={joinGroup} className="space-y-3">
              <input className="w-full border p-3 rounded" placeholder="Enter existing Group ID or Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} required />
              <button disabled={joining} className="w-full bg-indigo-600 text-white py-3 rounded disabled:opacity-60">{joining ? 'Joining...' : 'Join Group'}</button>
            </form>
          </div>
          <div id="create-group-section" className="mt-10 border-t pt-6">
            <h3 className="font-semibold mb-2">Create new group</h3>
            <form onSubmit={createGroup} className="space-y-3">
              <input className="w-full border p-3 rounded" placeholder="Group name" value={name} onChange={e => setName(e.target.value)} required />
              <button disabled={creating} className="w-full bg-green-600 text-white py-3 rounded disabled:opacity-60">{creating ? 'Creating...' : 'Create Group'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelect;
