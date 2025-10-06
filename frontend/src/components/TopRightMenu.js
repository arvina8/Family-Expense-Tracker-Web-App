import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Layers } from 'lucide-react';

const TopRightMenu = () => {
  const { user, logout, currentGroup } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const handler = (e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return ()=> document.removeEventListener('mousedown', handler);
  },[]);

  if(!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)} className="ml-3 px-3 py-2 rounded-lg bg-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white" aria-haspopup="true" aria-expanded={open}>
        {user.name}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Current group</p>
            <p className="font-medium text-gray-800 truncate">{currentGroup || 'None selected'}</p>
          </div>
          <div className="py-1">
            <button onClick={()=>{ setOpen(false); navigate('/select-group'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2" role="menuitem">
              <Layers className="w-4 h-4"/> Switch group…
            </button>
            <button onClick={()=>{ setOpen(false); navigate('/profile'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2" role="menuitem">
              <Settings className="w-4 h-4"/> Profile & Settings
            </button>
            <div className="my-1 border-t" />
            <button onClick={()=>{ logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600" role="menuitem">
              <LogOut className="w-4 h-4"/> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopRightMenu;
