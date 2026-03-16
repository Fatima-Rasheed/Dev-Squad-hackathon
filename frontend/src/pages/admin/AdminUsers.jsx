import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, blockUnblockUser } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { Shield, ArrowLeft, UserX, UserCheck, AlertCircle, Lock } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth(); // Access the logged-in user's data

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        setUsers(res.data.users || res.data);
      })
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBlockAction = async (userId, userName) => {
    const confirmAction = window.confirm(`Are you sure you want to change the access status for ${userName}?`);
    
    if (confirmAction) {
      try {
        const res = await blockUnblockUser(userId);
        setUsers((prev) =>
          prev.map((u) => 
            u._id === userId ? { ...u, isBlocked: res.data.user.isBlocked } : u
          )
        );
      } catch (err) {
        console.error("Block Error:", err);
        alert(err.response?.data?.message || 'Failed to update user status');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex flex-col items-center px-6 pb-20">
        
        {/* HEADER SECTION */}
        <div className="w-full max-w-5xl py-20 text-center"> 
          <Link 
            to="/admin" 
            className="inline-flex items-center text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-6 hover:gap-4 transition-all"
          >
            <ArrowLeft size={14} className="mr-2" /> Dashboard
          </Link>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            Access Control
          </h1>
          <p className="mt-4 text-slate-400 font-medium">
            {currentUser?.role === 'superadmin' 
              ? "Manage user permissions and security status" 
              : "Viewing user permissions (Read-Only Mode)"}
          </p>
        </div>

        {/* TABLE CONTAINER */}
        <div className="w-full max-w-5xl bg-white shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-white rounded-[20px] overflow-hidden">
          {loading ? (
            <div className="py-24 text-center text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">
              Synchronizing Database...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-500">
                    {['Member', 'Role', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-10 py-8 text-[12px] font-black uppercase  tracking-[0.2em] text-slate-800">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                      
                      {/* MEMBER INFO */}
                      <td className="px-10 py-10">
                        <div>
                          <p className="text-base font-bold text-slate-900">{u.name}</p>
                          <p className="text-sm text-slate-400">{u.email}</p>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-10 py-10">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest ${
                          u.role === 'admin' || u.role === 'superadmin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {(u.role === 'admin' || u.role === 'superadmin') && <Shield size={12} />}
                          {u.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-10 py-10">
                        <div className={`flex items-center gap-2 text-sm font-bold ${u.isBlocked ? 'text-red-500' : 'text-emerald-500'}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </div>
                      </td>

                      {/* ACTIONS - CONDITIONAL LOGIC HERE */}
                      <td className="px-10 py-10 ">
                        <div className="flex justify-start">
                          {/* 1. Only Superadmin can see action buttons */}
                          {currentUser?.role === 'superadmin' ? (
                            
                            u.role !== 'superadmin' ? (
                              <button
                                onClick={() => handleBlockAction(u._id, u.name)}
                                className={`w-full max-w-[160px] h-[40px] rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 shadow-lg ${
                                  u.isBlocked 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                }`}
                              >
                                {u.isBlocked ? (
                                  <><UserCheck size={18} /> Unblock</>
                                ) : (
                                  <><UserX size={18} /> Block</>
                                )}
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-slate-300 italic text-[11px] font-bold uppercase tracking-widest h-[50px]">
                                <AlertCircle size={14} /> System Root
                              </div>
                            )

                          ) : (
                            /* 2. Show locked/read-only status for standard Admins */
                            <div className="flex items-center gap-2 text-slate-400 italic text-[10px] font-bold uppercase tracking-widest h-[50px]">
                              <Lock size={12} /> View Only
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;