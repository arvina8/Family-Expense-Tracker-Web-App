import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const GroupSwitcher = () => {
  const { user, currentGroup, setCurrentGroup } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!user) return;
    client.get('/groups/mine').then(res => {
      const list = res.data.map(m => ({ ...m.group, role: m.role }));
      setGroups(list);
    });
  }, [user]);

  if (!user) return null;

  return (
    <select
      className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg"
      value={currentGroup || ''}
      onChange={e => setCurrentGroup(e.target.value)}
    >
      {groups.map(g => (
        <option key={g._id} value={g._id}>{g.name}</option>
      ))}
    </select>
  );
};

export default GroupSwitcher;
