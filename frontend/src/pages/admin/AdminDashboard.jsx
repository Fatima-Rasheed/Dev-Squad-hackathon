import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/admin';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([getDashboard(), getAllOrders()])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

const handleStatusUpdate = async (orderId, status) => {
  try {
    await updateOrderStatus(orderId, status);

    // Update the orders list
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));

    // Refetch stats so the pills update instantly ← add this
    getDashboard().then((res) => setStats(res.data));

  } catch (err) {
    alert(err.response?.data?.message || 'Error updating status');
  }
};

  const statusConfig = {
    pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', dot: '#f59e0b',  border: 'rgba(245,158,11,0.3)'  },
    processing: { bg: 'rgba(59,130,246,0.15)',  color: '#93c5fd', dot: '#3b82f6',  border: 'rgba(59,130,246,0.3)'  },
    shipped:    { bg: 'rgba(16,185,129,0.15)',  color: '#6ee7b7', dot: '#10b981',  border: 'rgba(16,185,129,0.3)'  },
    delivered:  { bg: 'rgba(34,197,94,0.15)',   color: '#86efac', dot: '#22c55e',  border: 'rgba(34,197,94,0.3)'   },
    cancelled:  { bg: 'rgba(239,68,68,0.15)',   color: '#fca5a5', dot: '#ef4444',  border: 'rgba(239,68,68,0.3)'   },
  };

  const getStatus = (s) => statusConfig[s] || { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af', dot: '#6b7280', border: 'rgba(156,163,175,0.3)' };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
    .stat-card:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
    .nav-btn:hover { opacity: 0.85; }
    .order-row:hover { background-color: rgba(74,222,128,0.04) !important; }
    .status-select:hover { border-color: rgba(74,222,128,0.4) !important; }
  `;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1912' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(74,222,128,0.2)', borderTop: '2px solid #4ade80', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ color: 'rgba(74,222,128,0.7)', fontSize: '0.8rem', letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>LOADING DASHBOARD</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );

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
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '80px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '300px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '2px', backgroundColor: '#4ade80' }} />
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#4ade80', textTransform: 'uppercase' }}>
                  {user?.role === 'superadmin' ? 'Super Admin Panel' : 'Admin Panel'}
                </span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', color: '#fff', fontWeight: 'normal', margin: 0, lineHeight: 1.15 }}>
                {user?.role === 'superadmin' ? 'Superadmin Portal' : 'Admin Portal'}
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: '8px 0 0', letterSpacing: '0.03em' }}>
                Welcome back — here's what's happening today
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { to: '/admin/products', label: 'Products', primary: true },
                { to: '/admin/orders',   label: 'Orders',   primary: false },
                { to: '/admin/users',    label: 'Users',    primary: false },
              ].map((btn) => (
                <Link key={btn.to} to={btn.to} className="nav-btn" style={{
                  padding: '9px 20px',
                  backgroundColor: btn.primary ? '#4ade80' : 'rgba(255,255,255,0.07)',
                  color: btn.primary ? '#0b1912' : 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  fontWeight: btn.primary ? '700' : '500',
                  borderRadius: '6px',
                  border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  transition: 'opacity 0.2s',
                }}>
                  {btn.label.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 48px 64px' }}>

          {/* Main Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
            {[
              { label: 'Total Revenue',  value: `$${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: '💰', accent: '#4ade80', trend: '+12%' },
              { label: 'Total Orders',   value: stats?.totalOrders || 0,   icon: '📦', accent: '#60a5fa', trend: '+8%'  },
              { label: 'Total Users',    value: stats?.totalUsers || 0,    icon: '👥', accent: '#e879f9', trend: '+5%'  },
              { label: 'Products',       value: stats?.totalProducts || 0, icon: '🍵', accent: '#fb923c', trend: 'Active' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{
                backgroundColor: '#111f17',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: `2px solid ${stat.accent}`,
                padding: '22px 24px',
                borderRadius: '10px',
                cursor: 'default',
                transition: 'transform 0.2s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.65rem', color: stat.accent, backgroundColor: `${stat.accent}18`, padding: '2px 7px', borderRadius: '10px', fontWeight: '600' }}>
                      {stat.trend}
                    </span>
                    <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
                  </div>
                </div>
                <p style={{ fontSize: '2rem', color: '#fff', fontWeight: '300', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Order Status Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Pending',    value: stats?.orderStats?.pending || 0,    color: '#fbbf24', bg: 'rgba(245,158,11,0.08)'  },
              { label: 'Processing', value: stats?.orderStats?.processing || 0, color: '#93c5fd', bg: 'rgba(59,130,246,0.08)'  },
              { label: 'Shipped',    value: stats?.orderStats?.shipped || 0,    color: '#6ee7b7', bg: 'rgba(16,185,129,0.08)'  },
              { label: 'Delivered',  value: stats?.orderStats?.delivered || 0,  color: '#86efac', bg: 'rgba(34,197,94,0.08)'   },
            ].map((stat) => (
              <div key={stat.label} style={{
                backgroundColor: stat.bg,
                border: `1px solid ${stat.color}22`,
                padding: '14px 20px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: stat.color, boxShadow: `0 0 6px ${stat.color}` }} />
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.03em' }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: '500', color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Low Stock */}
          {stats?.lowStockProducts?.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(146,64,14,0.25) 0%, rgba(120,53,15,0.2) 100%)',
              border: '1px solid rgba(251,191,36,0.25)',
              padding: '16px 22px',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                ⚠️
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.03em' }}>
                  Low Stock Alert — {stats.lowStockProducts.length} product(s) need attention
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {stats.lowStockProducts.map((p) => (
                    <span key={p._id} style={{ fontSize: '0.72rem', color: '#fcd34d', backgroundColor: 'rgba(251,191,36,0.1)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.2)' }}>
                      {p.name} — {p.variants.map((v) => `${v.name}: ${v.stock}`).join(', ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div style={{
            backgroundColor: '#111f17',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {/* Table title bar */}
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '3px', height: '20px', backgroundColor: '#4ade80', borderRadius: '2px' }} />
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#fff', fontWeight: 'normal', margin: 0 }}>
                    Recent Orders
                  </h2>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: '3px 0 0' }}>
                    Showing last {Math.min(orders.length, 10)} orders
                  </p>
                </div>
              </div>
              <Link to="/admin/orders" style={{
                fontSize: '0.72rem',
                color: '#4ade80',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                padding: '6px 14px',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: '6px',
                backgroundColor: 'rgba(74,222,128,0.06)',
              }}>
                VIEW ALL →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0d1a12' }}>
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map((h) => (
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
                    {orders.slice(0, 10).map((order, index) => (
                      <tr key={order._id} className="order-row" style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background-color 0.15s',
                        cursor: 'default',
                      }}>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#4ade80', fontWeight: '700', flexShrink: 0 }}>
                              {(order.user?.name || 'N')[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{order.user?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '3px 9px', borderRadius: '10px' }}>
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: '0.85rem', color: '#fff', fontWeight: '500', letterSpacing: '-0.01em' }}>
                          ${(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{
                            padding: '4px 11px',
                            borderRadius: '20px',
                            fontSize: '0.68rem',
                            backgroundColor: getStatus(order.status).bg,
                            color: getStatus(order.status).color,
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            border: `1px solid ${getStatus(order.status).border}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            letterSpacing: '0.03em',
                          }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: getStatus(order.status).dot, display: 'inline-block', boxShadow: `0 0 4px ${getStatus(order.status).dot}` }} />
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="status-select"
                            style={{
                              border: '1px solid rgba(255,255,255,0.12)',
                              padding: '5px 10px',
                              fontSize: '0.72rem',
                              color: 'rgba(255,255,255,0.75)',
                              outline: 'none',
                              cursor: 'pointer',
                              backgroundColor: '#0d1a12',
                              borderRadius: '6px',
                              transition: 'border-color 0.2s',
                            }}
                          >
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <option key={s} value={s} style={{ backgroundColor: '#111f17' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
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

export default AdminDashboard;