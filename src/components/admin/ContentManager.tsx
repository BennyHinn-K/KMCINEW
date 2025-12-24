import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  X,
  Save,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ContentCategory, ContentItem, ISermon } from '../../types';
import MediaDropzone from '../ui/MediaDropzone';
import SermonForm from './SermonForm';

interface ContentManagerProps {
  category: ContentCategory;
  title: string;
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({ category, onNotify }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  
  // Form State for Non-Sermon items
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    setLoading(true);
    try {
      let data: ContentItem[];
      if (category === 'sermon') data = await api.getSermons();
      else if (category === 'event') data = await api.getEvents();
      else data = await api.getNews();
      setItems(data);
    } catch {
      onNotify("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.deleteItem(category, id);
      setItems(prev => prev.filter(i => i.id !== id));
      onNotify("Item deleted successfully", "success");
    } catch {
      onNotify("Failed to delete item", "error");
    }
  };

  // Handler for generic save (Events/News)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGenericForm()) return;
    await processSave(formData);
  };

  const validateGenericForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title?.trim()) errors.title = "Title is required";
    if (!formData.date) errors.date = "Date is required";
    
    if (category === 'event') {
      const eventData = formData as Record<string, unknown>;
      if (!(eventData.time as string)?.trim()) errors.time = "Time is required";
      if (!(eventData.location as string)?.trim()) errors.location = "Location is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler for SermonForm save
  const handleSermonSave = async (data: Partial<ISermon>) => {
    await processSave(data);
  };

  const processSave = async (data: Partial<ContentItem>) => {
    try {
      // Ensure category is set
      const itemData = {
        ...data,
        category
      } as Omit<ContentItem, 'id'>;

      if (editingItem) {
        await api.updateItem(category, editingItem.id, itemData);
        onNotify("Item updated successfully", "success");
      } else {
        await api.createItem(category, itemData);
        onNotify("Item created successfully", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch {
      onNotify("Failed to save item", "error");
    }
  };

  const openModal = (item: ContentItem | null = null) => {
    setFormErrors({});
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      // Default empty state based on category
      const base: Partial<ContentItem> = { title: '', date: '', description: '', featured: false };
      if (category === 'event') {
        setFormData({ ...base, time: '', location: '' });
      } else {
        setFormData(base);
      }
    }
    setIsModalOpen(true);
  };

  const toggleFeatured = async (item: ContentItem) => {
    try {
      await api.updateItem(category, item.id, { featured: !item.featured });
      loadData(); // Reload to reflect changes
      onNotify(`Item ${!item.featured ? 'featured' : 'unfeatured'}`, "success");
    } catch {
      onNotify("Failed to update status", "error");
    }
  };

  // Handle file drop for generic form
  const handleFileDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, imageUrl: result } as Partial<ContentItem>);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setFormData({ ...formData, imageUrl: '' } as Partial<ContentItem>);
  };

  // Filtering
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-amber-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-amber-600 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading data...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No items found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleFeatured(item)}
                        className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border transition-colors ${
                          item.featured 
                            ? 'bg-amber-100 text-amber-700 border-amber-200' 
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <Star className={`w-3 h-3 mr-1 ${item.featured ? 'fill-current' : ''}`} />
                        {item.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          
          {category === 'sermon' ? (
            // Use Specialized Sermon Form
            <SermonForm 
              initialData={editingItem as Partial<ISermon> || undefined}
              onSubmit={handleSermonSave}
              onCancel={() => setIsModalOpen(false)}
            />
          ) : (
            // Use Generic Form for Events/News
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Item' : 'Create New Item'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title || ''}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 outline-none`}
                  />
                  {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date || ''}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className={`w-full px-3 py-2 border ${formErrors.date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 outline-none`}
                    />
                    {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                  </div>
                  
                  {category === 'event' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input 
                        type="text" 
                        value={(formData as Record<string, unknown>).time as string || ''}
                        onChange={e => setFormData({...formData, time: e.target.value} as Partial<ContentItem>)}
                        className={`w-full px-3 py-2 border ${formErrors.time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 outline-none`}
                        placeholder="10:00 AM"
                      />
                      {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                    </div>
                  )}
                </div>

                {category === 'event' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={(formData as Record<string, unknown>).location as string || ''}
                      onChange={e => setFormData({...formData, location: e.target.value} as Partial<ContentItem>)}
                      className={`w-full px-3 py-2 border ${formErrors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 outline-none`}
                    />
                    {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                  </label>
                  <MediaDropzone 
                      onDrop={handleFileDrop}
                      initialPreview={(formData as ContentItem).imageUrl || (formData as ISermon).thumbnail || ''}
                      onClear={handleClearFile}
                      accept={{
                          'image/jpeg': [],
                          'image/png': [],
                          'image/webp': []
                      }}
                  />
                </div>

                <div className="flex items-center pt-4">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured || false}
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Mark as Featured
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Item
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
