import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [secretKey, setSecretKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ title: '', desc: '', link: '', imageUrl: '', tags: '' });
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('https://samwel-portfolio-backend-api.onrender.com/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (secretKey.trim() !== '') {
      setIsAuthenticated(true);
      setMessage('Logged in. Secret Key set.');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('Adding project...');

    const formattedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      const res = await fetch('https://samwel-portfolio-backend-api.onrender.com/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags: formattedTags, secretKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Project added successfully!');
      setProjects([data.project, ...projects]); // Update UI
      setFormData({ title: '', desc: '', link: '', imageUrl: '', tags: '' }); // Reset form
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch(`https://samwel-portfolio-backend-api.onrender.com/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjects(projects.filter(p => p._id !== id));
      setMessage('Project deleted successfully.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  
  // 1. Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-lg w-96 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#f4b316]">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Admin Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full bg-slate-700 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-[#f4b316] text-white placeholder-slate-400"
            required
          />
          <button type="submit" className="w-full bg-[#1e4635] p-3 rounded-lg font-bold hover:bg-[#2a5a45] transition">
            Unlock Dashboard
          </button>
          <Link to="/" className="block text-center mt-4 text-sm text-slate-400 hover:text-white transition">← Back to Portfolio</Link>
        </form>
      </div>
    );
  }

  // 2. Dashboard Screen
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-8 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-[#1e4635] serif">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your portfolio projects.</p>
          </div>
          <Link to="/" className="bg-[#1e4635] text-white px-6 py-2 rounded-full font-medium hover:bg-[#153427] transition flex items-center gap-2">
            View Live Site
          </Link>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 font-medium shadow-sm transition-all ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-[#f4b316] text-[#1e4635]'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Project Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit lg:col-span-1">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-[#f4b316] text-white p-1.5 rounded-md text-sm">+</span> Add New Project
            </h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1e4635] outline-none transition" required />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1e4635] outline-none transition" rows="3" required />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Live Link</label>
                <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1e4635] outline-none transition" required />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Image URL (Optional)</label>
                <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Leave blank for default image" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1e4635] outline-none transition" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Tags (Comma Separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="React, Node.js, MongoDB" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1e4635] outline-none transition" />
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-[#1e4635] text-white py-3 rounded-lg font-bold hover:bg-[#2a5a45] transition disabled:opacity-50 mt-4 shadow-md">
                {isProcessing ? 'Saving...' : 'Add Project'}
              </button>
            </form>
          </div>

          {/* Project List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-[#1e4635] text-white p-1.5 rounded-md text-sm">📁</span> Manage Existing Projects
            </h2>
            
            {projects.length === 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-slate-500 border border-slate-100">
                No projects found in the database.
              </div>
            )}

            {projects.map(project => (
              <div key={project._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                
                {/* Project Info */}
                <div className="flex items-center gap-4 flex-1">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 border border-slate-200">No Img</div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{project.desc}</p>
                    <div className="flex gap-2 mt-2">
                      {project.tags && project.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#f4b316]/20 text-[#d99b06] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    disabled={isProcessing}
                    className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;