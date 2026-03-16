import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/admin';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import Navbar from '../../components/layout/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const statusColor = (status) => {
    const colors = {
      pending: { bg: '#fff8e1', color: '#f59e0b' },
      processing: { bg: '#e3f2fd', color: '#3b82f6' },
      shipped: { bg: '#e8f5e9', color: '#22c55e' },
      delivered: { bg: '#f0fdf4', color: '#16a34a' },
      cancelled: { bg: '#fff1f2', color: '#ef4444' },
    };
    return colors[status] || { bg: '#f5f5f5', color: '#888' };
  };

  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#aaa' }}>Loading dashboard...</p>
      </div>
    );

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: '#1a1a1a', fontWeight: 'normal' }}>
            Admin Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/admin/products"
              style={{ padding: '8px 20px', backgroundColor: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.08em' }}
            >
              MANAGE PRODUCTS
            </Link>
            <Link
              to="/admin/users"
              style={{ padding: '8px 20px', border: '1px solid #ddd', color: '#555', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.08em' }}
            >
              MANAGE USERS
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { 
              label: 'Total Revenue', 
              value: `$${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
              icon: '💰', 
              color: '#e8f5e9' 
            },
            { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#e3f2fd' },
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#f3e5f5' },
            { label: 'Total Products', value: stats?.totalProducts || 0, icon: '🍵', color: '#fff8e1' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '24px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#888' }}>{stat.label.toUpperCase()}</span>
                <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
              </div>
              <p style={{ fontSize: '1.8rem', color: '#1a1a1a', fontWeight: '300', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Order Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Pending', value: stats?.orderStats?.pending || 0, color: '#f59e0b' },
            { label: 'Processing', value: stats?.orderStats?.processing || 0, color: '#3b82f6' },
            { label: 'Shipped', value: stats?.orderStats?.shipped || 0, color: '#22c55e' },
            { label: 'Delivered', value: stats?.orderStats?.delivered || 0, color: '#16a34a' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#555' }}>{stat.label}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '600', color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Low Stock Warning */}
        {stats?.lowStockProducts?.length > 0 && (
          <div style={{ backgroundColor: '#fff8e1', border: '1px solid #fcd34d', padding: '16px 20px', borderRadius: '8px', marginBottom: '32px' }}>
            <p style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: '600', marginBottom: '8px' }}>
              ⚠️ Low Stock Alert
            </p>
            {stats.lowStockProducts.map((p) => (
              <p key={p._id} style={{ fontSize: '0.78rem', color: '#92400e', margin: '4px 0' }}>
                {p.name} — {p.variants.map((v) => `${v.name}: ${v.stock} left`).join(', ')}
              </p>
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 'normal', margin: 0 }}>
              Recent Orders
            </h2>
            <Link to="/admin/orders" style={{ fontSize: '0.78rem', color: '#888', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>No orders yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#888', fontWeight: '600', borderBottom: '1px solid #eee' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#555' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#333' }}>
                      {order.user?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#555' }}>
                      {order.items?.length} item(s)
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#333', fontWeight: '500' }}>
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          backgroundColor: statusColor(order.status).bg,
                          color: statusColor(order.status).color,
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#888' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        style={{ border: '1px solid #ddd', padding: '4px 8px', fontSize: '0.75rem', color: '#333', outline: 'none', cursor: 'pointer' }}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;