import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useRef, useEffect } from 'react';
import CartDrawer from '../common/CartDrawer';
import { Sprout, Search, User, ShoppingCart, Package, LogOut, KeyRound } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/login');
    };

    const handleContactClick = () => {
        const footer = document.getElementById('contact');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/home');
            setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

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
                        <span style={{ fontFamily: "'Prosto One', system-ui, sans-serif", fontSize: '1.25rem', color: '#1A1A1A', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sprout color="#1A1A1A" fill="#1A1A1A" size={32} strokeWidth={1} /> Brand Name
                        </span>
                    </Link>

                    {/* Center Links */}
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        {[
                              { label: 'Home', path: '/home' },
                            { label: 'Tea Collections', path: '/collections' },
                          
                            // { label: 'Blog', path: '/' },
                        ].map((item) => (
                            <Link key={item.label} to={item.path}
                                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '500', fontSize: '0.9rem', color: '#444', textDecoration: 'none', letterSpacing: '0.02em' }}>
                                {item.label}
                            </Link>
                        ))}

                        {/* Contact Us */}
                        <button
                            onClick={handleContactClick}
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '500', fontSize: '0.9rem', color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.02em' }}
                        >
                            Contact Us
                        </button>
                    </div>

                    {/* Right Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                        {/* Search */}
                        <button onClick={() => setSearchOpen(!searchOpen)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Search color="#000" size={20} strokeWidth={2} />
                        </button>

                        {/* User Dropdown */}
                        <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                title={user ? user.name : 'Login'}
                            >
                                <User color="#000" size={20} strokeWidth={2} />
                            </button>

                            {userMenuOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0,
                                    backgroundColor: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    borderRadius: '8px', padding: '12px 0', minWidth: '160px',
                                    zIndex: 1000, marginTop: '15px', border: '1px solid #eee'
                                }}>
                                    {user ? (
                                        <>
                                            <div style={{ padding: '4px 16px 8px', borderBottom: '1px solid #F5F5F5', marginBottom: '8px' }}>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>Account</p>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                                            </div>
                                            <Link to="/my-orders" onClick={() => setUserMenuOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', textDecoration: 'none', color: '#444', fontSize: '0.85rem' }}>
                                                <Package color="#000" size={16} /> My Orders
                                            </Link>
                                            <button onClick={handleLogout}
                                                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', color: '#D9534F', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <LogOut color="#D9534F" size={16} /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setUserMenuOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px 5px', textDecoration: 'none', color: '#1A1A1A', fontSize: '0.85rem', fontWeight: '600' }}>
                                                <KeyRound color="#000" size={16} /> Login
                                            </Link>
                                            <Link to="/register" onClick={() => setUserMenuOpen(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 16px 10px', textDecoration: 'none', color: '#1A1A1A', fontSize: '0.85rem', fontWeight: '600' }}>
                                                <User color="#000" size={16} /> Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart — with count badge */}
                        <button
                            onClick={() => user ? setCartOpen(true) : navigate('/login')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
                        >
                            <ShoppingCart color="#000" size={20} strokeWidth={2} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: '#1a1a1a',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '0.62rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1,
                                }}>
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
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