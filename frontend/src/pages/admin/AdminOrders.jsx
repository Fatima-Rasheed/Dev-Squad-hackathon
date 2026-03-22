import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert('Error updating status');
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

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
    .order-row:hover { background-color: rgba(74,222,128,0.04) !important; }
    .filter-btn:hover { border-color: rgba(74,222,128,0.4) !important; color: #4ade80 !important; }
    .status-select:hover { border-color: rgba(74,222,128,0.4) !important; }
  `;

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
                  {user?.role === 'superadmin' ? 'Super Admin Panel' : 'Admin Panel'}
                </span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', color: '#fff', fontWeight: 'normal', margin: 0, lineHeight: 1.15 }}>
                All Orders
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: '8px 0 0' }}>
                {orders.length} total orders
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
            }}>
              ← DASHBOARD
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 48px 64px' }}>

          {/* Summary Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => {
              const cfg = getStatus(s);
              const count = orders.filter((o) => o.status === s).length;
              return (
                <div key={s} style={{
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  padding: '14px 18px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
                    <span style={{ fontSize: '0.72rem', color: cfg.color, textTransform: 'capitalize', letterSpacing: '0.03em' }}>{s}</span>
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: '600', color: cfg.color }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button
                key={f}
                className="filter-btn"
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: filter === f ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: filter === f ? 'rgba(74,222,128,0.12)' : 'transparent',
                  color: filter === f ? '#4ade80' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {f === 'all' ? `All (${orders.length})` : `${f} (${orders.filter((o) => o.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: '#111f17',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {/* Table header bar */}
            <div style={{
              padding: '18px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '3px', height: '18px', backgroundColor: '#4ade80', borderRadius: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'Georgia, serif' }}>Orders List</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {filtered.length} of {orders.length} showing
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>LOADING...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No orders found</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0d1a12' }}>
                      {['Order ID', 'Customer', 'Items', 'Total', 'Address', 'Status', 'Date', 'Update Status'].map((h) => (
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
                    {filtered.map((order, index) => (
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
                            <div>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{order.user?.name || 'N/A'}</p>
                              <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{order.user?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '3px 9px', borderRadius: '10px' }}>
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: '0.85rem', color: '#fff', fontWeight: '500' }}>
                          ${(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                          {order.shippingAddress?.city}, {order.shippingAddress?.country}
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
                              fontFamily: "'DM Sans', sans-serif",
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

export default AdminOrders;