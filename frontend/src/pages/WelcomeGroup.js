import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogIn } from 'lucide-react';

const WelcomeGroup = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <PlusCircle className="w-10 h-10 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Create a new group</h2>
          <p className="text-sm text-gray-600 mb-4">Start fresh and invite members to track and split expenses.</p>
          <button onClick={()=>navigate('/select-group?create=1')} className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create Group</button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <LogIn className="w-10 h-10 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Join an existing group</h2>
            <form onSubmit={(e)=>{e.preventDefault(); const v=e.target.code.value.trim(); if(v) navigate('/select-group?join='+encodeURIComponent(v));}} className="space-y-3">
              <input name="code" placeholder="Enter Group ID or Code" className="w-full border rounded px-3 py-2" required />
              <button className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Continue</button>
            </form>
        </div>
      </div>
    </div>
  );
};
export default WelcomeGroup;
