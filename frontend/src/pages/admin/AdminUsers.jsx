import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, blockUnblockUser } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { Shield, ArrowLeft, UserX, UserCheck, AlertCircle, Lock } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data.users || res.data))
      .catch((err) => console.error('Fetch Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBlockAction = async (userId, userName) => {
    const confirmAction = window.confirm(`Change access status for ${userName}?`);
    if (confirmAction) {
      try {
        const res = await blockUnblockUser(userId);
        setUsers((prev) =>
          prev.map((u) => u._id === userId ? { ...u, isBlocked: res.data.user.isBlocked } : u)
        );
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update user status');
      }
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
    .user-row:hover { background-color: rgba(74,222,128,0.04) !important; }
    .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  `;

  const totalActive  = users.filter((u) => !u.isBlocked).length;
  const totalBlocked = users.filter((u) =>  u.isBlocked).length;
  const totalAdmins  = users.filter((u) => u.role === 'admin' || u.role === 'superadmin').length;

  return (
    <>
      <style>{styles}</style>
      <div style={{ backgroundColor: '#0b1912', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0d2318 0%, #0f2d1c 40%, #0d2318 100%)',
          borderBottom: '1px solid rgba(74,222,128,0.1)',
          padding: '36px 48px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '80px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '2px', backgroundColor: '#4ade80' }} />
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#4ade80', textTransform: 'uppercase' }}>
                  {currentUser?.role === 'superadmin' ? 'Super Admin Panel' : 'Admin Panel'}
                </span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', color: '#fff', fontWeight: 'normal', margin: 0, lineHeight: 1.15 }}>
                User Management
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: '8px 0 0' }}>
                {currentUser?.role === 'superadmin'
                  ? 'Manage user permissions and security status'
                  : 'Viewing user permissions — Read Only Mode'}
              </p>
            </div>

            <Link to="/admin" style={{
              padding: '9px 20px',
              backgroundColor: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              fontWeight: '500',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <ArrowLeft size={13} /> DASHBOARD
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 48px 64px' }}>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Users',    value: users.length,  accent: '#4ade80', icon: '👥' },
              { label: 'Active Users',   value: totalActive,   accent: '#6ee7b7', icon: '✅' },
              { label: 'Blocked Users',  value: totalBlocked,  accent: '#fca5a5', icon: '🚫' },
              { label: 'Admins',         value: totalAdmins,   accent: '#93c5fd', icon: '🛡️' },
            ].map((s) => (
              <div key={s.label} style={{
                backgroundColor: '#111f17',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: `2px solid ${s.accent}`,
                padding: '20px 24px',
                borderRadius: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{s.label}</span>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                </div>
                <p style={{ fontSize: '1.9rem', color: '#fff', fontWeight: '300', margin: 0, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: '#111f17',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {/* Table title bar */}
            <div style={{
              padding: '18px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '3px', height: '18px', backgroundColor: '#4ade80', borderRadius: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'Georgia, serif' }}>All Users</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {users.length} registered
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>LOADING USERS...</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0d1a12' }}>
                      {['Member', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} style={{
                          padding: '11px 20px',
                          textAlign: 'left',
                          fontSize: '0.65rem',
                          letterSpacing: '0.14em',
                          color: 'rgba(255,255,255,0.28)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          whiteSpace: 'nowrap',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => (
                      <tr key={u._id} className="user-row" style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background-color 0.15s',
                      }}>

                        {/* Member */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              backgroundColor: u.isBlocked ? 'rgba(239,68,68,0.12)' : 'rgba(74,222,128,0.12)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.8rem', fontWeight: '700',
                              color: u.isBlocked ? '#fca5a5' : '#4ade80',
                              flexShrink: 0,
                              border: `1px solid ${u.isBlocked ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.2)'}`,
                            }}>
                              {u.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>{u.name}</p>
                              <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.68rem',
                            fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase',
                            backgroundColor: u.role === 'superadmin' ? 'rgba(250,204,21,0.12)' :
                                             u.role === 'admin'      ? 'rgba(147,197,253,0.12)' : 'rgba(255,255,255,0.06)',
                            color:           u.role === 'superadmin' ? '#fde047' :
                                             u.role === 'admin'      ? '#93c5fd' : 'rgba(255,255,255,0.45)',
                            border:          u.role === 'superadmin' ? '1px solid rgba(250,204,21,0.25)' :
                                             u.role === 'admin'      ? '1px solid rgba(147,197,253,0.25)' : '1px solid rgba(255,255,255,0.08)',
                          }}>
                            {(u.role === 'admin' || u.role === 'superadmin') && <Shield size={10} />}
                            {u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '7px', height: '7px', borderRadius: '50%',
                              backgroundColor: u.isBlocked ? '#ef4444' : '#4ade80',
                              boxShadow: u.isBlocked ? '0 0 6px #ef4444' : '0 0 6px #4ade80',
                            }} />
                            <span style={{ fontSize: '0.78rem', color: u.isBlocked ? '#fca5a5' : '#6ee7b7', fontWeight: '500' }}>
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </div>
                        </td>

                        {/* Joined */}
                        <td style={{ padding: '14px 20px', fontSize: '0.73rem', color: 'rgba(255,255,255,0.32)', whiteSpace: 'nowrap' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 20px' }}>
                          {currentUser?.role === 'superadmin' ? (
                            u.role !== 'superadmin' ? (
                              <button
                                className="action-btn"
                                onClick={() => handleBlockAction(u._id, u.name)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                                  padding: '7px 16px', borderRadius: '6px', fontSize: '0.7rem',
                                  fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase',
                                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                                  backgroundColor: u.isBlocked ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                                  color: u.isBlocked ? '#4ade80' : '#fca5a5',
                                  outline: `1px solid ${u.isBlocked ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                {u.isBlocked ? <><UserCheck size={13} /> Unblock</> : <><UserX size={13} /> Block</>}
                              </button>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                                <AlertCircle size={12} /> System Root
                              </div>
                            )
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                              <Lock size={12} /> View Only
                            </div>
                          )}
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
    </>
  );
};

export default AdminUsers;