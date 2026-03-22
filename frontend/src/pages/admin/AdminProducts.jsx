import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'green-tea',
    flavor: '',
    rating: 4.0,
    images: [''],
    variants: [{ name: '250g', price: 15.00, stock: 50 }],
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ limit: 50 })
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleAddVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, { name: '', price: 0, stock: 0 }] }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = field === 'price' || field === 'stock' ? Number(value) : value;
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { ...form, images: form.images.filter((img) => img.trim() !== '') };
      await createProduct(productData);
      setShowForm(false);
      setForm({ name: '', description: '', category: 'green-tea', flavor: '', rating: 4.0, images: [''], variants: [{ name: '250g', price: 15.00, stock: 50 }] });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
    .product-row:hover { background-color: rgba(74,222,128,0.04) !important; }
    .nav-btn:hover { opacity: 0.85; }
    .form-input { background-color: #0d1a12 !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; padding: 9px 12px; font-size: 0.85rem; outline: none; box-sizing: border-box; border-radius: 6px; width: 100%; font-family: 'DM Sans', sans-serif; }
    .form-input::placeholder { color: rgba(255,255,255,0.25); }
    .form-input:focus { border-color: rgba(74,222,128,0.4) !important; }
    .form-input option { background-color: #111f17; }
    .delete-btn:hover { background-color: rgba(239,68,68,0.25) !important; }
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
                Product Inventory
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: '8px 0 0' }}>
                {products.length} products in catalog
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
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
              <button
                onClick={() => setShowForm(!showForm)}
                className="nav-btn"
                style={{
                  padding: '9px 20px',
                  backgroundColor: showForm ? 'rgba(239,68,68,0.15)' : '#4ade80',
                  color: showForm ? '#fca5a5' : '#0b1912',
                  border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  fontWeight: '700',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {showForm ? '✕ CANCEL' : '+ ADD PRODUCT'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 48px 64px' }}>

          {/* Add Product Form */}
          {showForm && (
            <div style={{
              backgroundColor: '#111f17',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '14px',
              padding: '28px 32px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '3px', height: '18px', backgroundColor: '#4ade80', borderRadius: '2px' }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#fff', fontWeight: 'normal', margin: 0 }}>
                  Add New Product
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Product Name</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Jasmine Green Tea" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
                    <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {['green-tea', 'black-tea', 'white-tea', 'herbal-tea', 'oolong-tea'].map((c) => (
                        <option key={c} value={c}>{c.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Description</label>
                  <textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
                    placeholder="Describe the tea..." style={{ resize: 'vertical' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Product Image URL</label>
                  <input className="form-input" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} placeholder="https://example.com/tea-image.jpg" />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textTransform: 'uppercase' }}>
                    Variants & Pricing (USD)
                  </label>
                  {form.variants.map((variant, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                      <input className="form-input" placeholder="Size (e.g. 250g)" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} />
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', zIndex: 1 }}>$</span>
                        <input className="form-input" placeholder="0.00" type="number" step="0.01" value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          style={{ paddingLeft: '24px' }} />
                      </div>
                      <input className="form-input" placeholder="Stock qty" type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} />
                    </div>
                  ))}
                  <button type="button" onClick={handleAddVariant} style={{
                    background: 'none',
                    border: '1px dashed rgba(74,222,128,0.25)',
                    padding: '7px 18px',
                    fontSize: '0.72rem',
                    color: 'rgba(74,222,128,0.6)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.05em',
                  }}>
                    + Add Variant
                  </button>
                </div>

                <button type="submit" style={{
                  backgroundColor: '#4ade80',
                  color: '#0b1912',
                  border: 'none',
                  padding: '11px 32px',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  CREATE PRODUCT
                </button>
              </form>
            </div>
          )}

          {/* Products Table */}
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
                <span style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'Georgia, serif' }}>All Products</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {products.length} total
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>LOADING PRODUCTS...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ padding: '56px', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🍵</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No products yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0d1a12' }}>
                      {['Product', 'Category', 'Variants & Pricing', 'Rating', 'Action'].map((h) => (
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
                    {products.map((product, index) => (
                      <tr key={product._id} className="product-row" style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background-color 0.15s',
                      }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', backgroundColor: 'rgba(74,222,128,0.08)', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(74,222,128,0.1)' }}>
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🍵</div>
                              )}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>{product.name}</p>
                              <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{product._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: '0.68rem', color: '#6ee7b7', backgroundColor: 'rgba(16,185,129,0.1)',
                            padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)',
                            textTransform: 'capitalize', letterSpacing: '0.04em',
                          }}>
                            {product.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          {product.variants.map((v, i) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>
                              <span style={{ color: '#fff', fontWeight: '500' }}>{v.name}</span>
                              <span style={{ color: '#4ade80', marginLeft: '6px' }}>${v.price.toFixed(2)}</span>
                              <span style={{ color: 'rgba(255,255,255,0.28)', marginLeft: '6px' }}>· {v.stock} in stock</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#fbbf24' }}>⭐ {product.rating}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(product._id)}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.25)',
                              color: '#fca5a5',
                              padding: '6px 14px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              letterSpacing: '0.05em',
                              fontFamily: "'DM Sans', sans-serif",
                              transition: 'background-color 0.15s',
                            }}
                          >
                            DELETE
                          </button>
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

export default AdminProducts;