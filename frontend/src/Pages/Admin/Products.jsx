import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createCategoryApi, createProductApi, deleteProductApi, listCategoriesApi, listProductsApi, updateProductApi } from "../../utils/api";

const emptyProduct = { name: "", slug: "", price: "", stock: "", category: "", sizes: "", colors: "", images: "", description: "" };

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSaving, setCatSaving] = useState(false);

  const parseArray = (val) => val.split(",").map(s=>s.trim()).filter(Boolean);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [ps, cs] = await Promise.all([listProductsApi(), listCategoriesApi()]);
      setProducts(ps);
      setCategories(cs);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      slug: p.slug || "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      category: p.category?._id || "",
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      images: (p.images || []).join(", "),
      description: p.description || "",
    });
  };

  const resetForm = () => { setEditingId(null); setForm(emptyProduct); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g,'-'),
        price: Number(form.price),
        stock: Number(form.stock || 0),
        category: form.category || null,
        sizes: parseArray(form.sizes),
        colors: parseArray(form.colors),
        images: parseArray(form.images),
        description: form.description,
      };
      if (!payload.name || !payload.price) throw new Error('Name and price are required');
      if (editingId) {
        const updated = await updateProductApi(token, editingId, payload);
        setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
      } else {
        const created = await createProductApi(token, payload);
        setProducts(prev => [created, ...prev]);
      }
      resetForm();
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProductApi(token, id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  const onCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setCatSaving(true);
    try {
      const slug = catName.trim().toLowerCase().replace(/\s+/g,'-');
      const c = await createCategoryApi(token, { name: catName.trim(), slug });
      setCategories(prev => [c, ...prev]);
      setCatName("");
    } catch (e) {
      alert(e.message || 'Create category failed');
    } finally { setCatSaving(false); }
  };

  const productCount = useMemo(() => products.length, [products]);

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Manage Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div style={{color:'#dc2626',marginBottom:12}}>{error}</div>}

          <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:16,alignItems:'start'}}>
            {/* List */}
            <div>
              <div style={{marginBottom:8,fontWeight:600}}>Products ({productCount})</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Name</th>
                      <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Price</th>
                      <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Stock</th>
                      <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Category</th>
                      <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:8}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{p.name}</td>
                        <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>₹{p.price}</td>
                        <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{p.stock}</td>
                        <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>{p.category?.name || '-'}</td>
                        <td style={{padding:8,borderBottom:'1px solid #f3f4f6'}}>
                          <button onClick={()=>onEdit(p)} style={{marginRight:8,background:'transparent',border:'1px solid #9ca3af',color:'#374151',padding:'4px 8px',borderRadius:4}}>Edit</button>
                          <button onClick={()=>onDelete(p._id)} style={{background:'transparent',border:'1px solid #dc2626',color:'#dc2626',padding:'4px 8px',borderRadius:4}}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form */}
            <div style={{border:'1px solid #e5e7eb',borderRadius:8,padding:12}}>
              <div style={{fontWeight:700,marginBottom:10}}>{editingId ? 'Edit Product' : 'Create Product'}</div>
              <form onSubmit={onSubmit}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <div>
                    <label>Name</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Slug</label>
                    <input value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} placeholder="auto from name" style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Price</label>
                    <input type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Category</label>
                    <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}}>
                      <option value="">-- None --</option>
                      {categories.map(c=> (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Sizes (comma)</label>
                    <input value={form.sizes} onChange={e=>setForm(f=>({...f,sizes:e.target.value}))} placeholder="S, M, L" style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Colors (comma)</label>
                    <input value={form.colors} onChange={e=>setForm(f=>({...f,colors:e.target.value}))} placeholder="red, blue" style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div>
                    <label>Images (comma URLs)</label>
                    <input value={form.images} onChange={e=>setForm(f=>({...f,images:e.target.value}))} placeholder="https://..." style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                  <div style={{gridColumn:'1 / span 2'}}>
                    <label>Description</label>
                    <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  </div>
                </div>
                <div style={{marginTop:12,display:'flex',gap:8}}>
                  <button disabled={saving} type="submit" style={{background:'transparent',color:'#111827',border:'1px solid #111827',borderRadius:6,padding:'8px 12px'}}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
                  {editingId && <button type="button" onClick={resetForm} style={{border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 12px'}}>Cancel</button>}
                </div>
              </form>
              <hr style={{margin:'16px 0'}} />
              <form onSubmit={onCreateCategory}>
                <div style={{display:'flex',gap:8}}>
                  <input placeholder="New category name" value={catName} onChange={e=>setCatName(e.target.value)} style={{flex:1,border:'1px solid #e5e7eb',borderRadius:6,padding:'8px 10px'}} />
                  <button disabled={catSaving} type="submit" style={{background:'transparent',color:'#ef4444',border:'1px solid #ef4444',borderRadius:6,padding:'8px 12px'}}>{catSaving ? 'Adding...' : 'Add Category'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
