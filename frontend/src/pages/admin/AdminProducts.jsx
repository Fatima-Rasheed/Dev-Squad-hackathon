import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct } from '../../api/products';
import Navbar from '../../components/layout/Navbar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', 
    description: '', 
    category: 'green-tea',
    flavor: '', 
    rating: 4.0, 
    images: [''],
    variants: [{ name: '250g', price: 15.00, stock: 50 }],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setForm((prev) => ({ 
      ...prev, 
      variants: [...prev.variants, { name: '', price: 0, stock: 0 }] 
    }));
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
      setForm({ 
        name: '', 
        description: '', 
        category: 'green-tea', 
        flavor: '', 
        rating: 4.0, 
        images: [''], 
        variants: [{ name: '250g', price: 15.00, stock: 50 }] 
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin" style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none' }}>← Dashboard</Link>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#1a1a1a', fontWeight: 'normal', margin: 0 }}>
              Product Inventory
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '10px 24px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontSize: '0.8rem', letterSpacing: '0.08em', cursor: 'pointer' }}
          >
            {showForm ? 'CANCEL' : '+ ADD PRODUCT'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '28px', borderRadius: '8px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#1a1a1a', marginBottom: '20px', fontWeight: 'normal' }}>
              Add New Product (Prices in USD)
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '6px' }}>Product Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    style={{ width: '100%', border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '6px' }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}>
                    {['green-tea', 'black-tea', 'white-tea', 'herbal-tea', 'oolong-tea'].map((c) => (
                      <option key={c} value={c}>{c.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '6px' }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
                  style={{ width: '100%', border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              {/* RE-ADDED IMAGE SECTION */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '6px' }}>Product Image URL</label>
                <input 
                  value={form.images[0]} 
                  onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                  placeholder="https://example.com/tea-image.jpg"
                  style={{ width: '100%', border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>

              {/* Variants Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '10px' }}>Variants & Pricing ($)</label>
                {form.variants.map((variant, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <input placeholder="Size (e.g. 250g)" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      style={{ border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none' }} />
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#888' }}>$</span>
                      <input placeholder="0.00" type="number" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        style={{ width: '100%', border: '1px solid #ddd', padding: '8px 12px 8px 24px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <input placeholder="Stock" type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      style={{ border: '1px solid #ddd', padding: '8px 12px', fontSize: '0.85rem', outline: 'none' }} />
                  </div>
                ))}
                <button type="button" onClick={handleAddVariant}
                  style={{ background: 'none', border: '1px dashed #ddd', padding: '6px 16px', fontSize: '0.78rem', color: '#888', cursor: 'pointer' }}>
                  + Add Another Variant
                </button>
              </div>

              <button type="submit"
                style={{ backgroundColor: '#1a1a1a', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.82rem', letterSpacing: '0.08em', cursor: 'pointer' }}>
                CREATE PRODUCT
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}>Fetching latest products...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9' }}>
                  {['Product', 'Category', 'Variants & Pricing', 'Rating', 'Action'].map((h) => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#888', fontWeight: '600', borderBottom: '1px solid #eee', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🍵</span>}
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#333', fontWeight: '500' }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.78rem', color: '#888' }}>{product.category}</td>
                    <td style={{ padding: '16px', fontSize: '0.78rem', color: '#555' }}>
                      {product.variants.map((v, i) => (
                        <div key={i}>
                          <strong>{v.name}</strong>: ${v.price.toFixed(2)} <span style={{ color: '#aaa' }}>({v.stock} in stock)</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.78rem', color: '#555' }}>
                      ⭐ {product.rating}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => handleDelete(product._id)}
                        style={{ background: 'none', border: '1px solid #fed7d7', color: '#e53e3e', padding: '6px 12px', fontSize: '0.72rem', cursor: 'pointer', borderRadius: '4px' }}>
                        Delete
                      </button>
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

export default AdminProducts;