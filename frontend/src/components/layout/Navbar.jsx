import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import CartDrawer from '../common/CartDrawer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Ref to handle clicking outside the menu
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav style={{ borderBottom: '1px solid #eee', padding: '16px 48px', backgroundColor: '#fff', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1A1A1A', letterSpacing: '0.05em' }}>
              🌿 Brand Name
            </span>
          </Link>

          {/* Center Links */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {[
              { label: 'Tea Collections', path: '/collections' },
              { label: 'Accessories', path: '/' },
              { label: 'Blog', path: '/' },
              { label: 'Contact Us', path: '/' },
            ].map((item) => (
              <Link key={item.label} to={item.path}
                style={{ fontSize: '0.85rem', color: '#444', textDecoration: 'none', letterSpacing: '0.02em' }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#444' }}>
              🔍
            </button>

            {/* User Dropdown Container */}
            <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: '#444',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={user ? user.name : 'Login'}
              >
                👤
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '12px 0',
                  minWidth: '160px',
                  zIndex: 1000,
                  marginTop: '15px',
                  border: '1px solid #eee'
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: '4px 16px 8px', borderBottom: '1px solid #F5F5F5', marginBottom: '8px' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>Account</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                      </div>
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: '#444', fontSize: '0.85rem' }}
                      >
                        📦 My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '10px 16px',
                          cursor: 'pointer',
                          color: '#D9534F',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        textDecoration: 'none',
                        color: '#444',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      🔑 Login / Register
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => user ? setCartOpen(true) : navigate('/login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#444', position: 'relative' }}
            >
              🛒
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ maxWidth: '1200px', margin: '12px auto 0', padding: '0 48px' }}>
            <input
              type="text"
              placeholder="Search for teas..."
              autoFocus
              style={{ width: '100%', border: 'none', borderBottom: '1px solid #ccc', padding: '8px 0', fontSize: '0.9rem', outline: 'none', color: '#333' }}
            />
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;