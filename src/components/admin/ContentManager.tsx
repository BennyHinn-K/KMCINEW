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
import { motion, useReducedMotion } from 'framer-motion';
import { api } from '../../lib/api';
import { ContentItem, ManagedCategory } from '../../types';
import MediaDropzone from '../ui/MediaDropzone';
import { Logger } from '../../lib/logger';
import { cn } from '../../lib/utils';

interface ContentManagerProps {
  category: ManagedCategory;
  title: string;
  onNotify: (msg: string, type: 'success' | 'error') => void;
  searchDebounce?: number;
}

const CATEGORY_EYEBROW: Record<ManagedCategory, string> = {
  event: 'Calendar · Gatherings',
  announcement: 'Comms · Notices',
};

const ContentManager: React.FC<ContentManagerProps> = ({ category, title, onNotify, searchDebounce = 200 }) => {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [category]);

  useEffect(() => {
    if (searchDebounce <= 0) {
      setDebouncedSearch(searchTerm);
      return;
    }
    const t = setTimeout(() => setDebouncedSearch(searchTerm), searchDebounce);
    return () => clearTimeout(t);
  }, [searchTerm, searchDebounce]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetItems(category);
      if (res.status === 200 && res.data) {
        setItems(res.data);
        Logger.info('Admin data loaded', { category, count: res.data.length });
      } else {
        onNotify('Failed to load data', 'error');
        Logger.error('Admin data load error', { category, error: res.error });
      }
    } catch (e) {
      onNotify('Failed to load data', 'error');
      Logger.error('Admin data load exception', { category, error: e });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await api.adminDeleteItem(category, id);
      if (res.status === 200) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        onNotify('Item deleted successfully', 'success');
        Logger.access('Admin delete item', { category, id });
      } else {
        onNotify(res.error?.message || 'Failed to delete item', 'error');
        Logger.error('Admin delete error', { category, id, error: res.error });
      }
    } catch (e) {
      onNotify('Failed to delete item', 'error');
      Logger.error('Admin delete exception', { category, id, error: e });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGenericForm()) return;
    await processSave(formData);
  };

  const validateGenericForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';

    if (category === 'event') {
      const eventData = formData as Record<string, unknown>;
      if (!(eventData.time as string)?.trim()) errors.time = 'Time is required';
      if (!(eventData.location as string)?.trim()) errors.location = 'Location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processSave = async (data: Partial<ContentItem>) => {
    try {
      const itemData = { ...data, category } as Omit<ContentItem, 'id'>;

      if (editingItem) {
        const res = await api.adminUpdateItem(category, editingItem.id, itemData);
        if (res.status === 200) {
          onNotify('Item updated successfully', 'success');
          Logger.access('Admin update item', { category, id: editingItem.id });
        } else {
          onNotify(res.error?.message || 'Failed to update item', 'error');
          Logger.error('Admin update error', { category, id: editingItem.id, error: res.error });
          return;
        }
      } else {
        const res = await api.adminCreateItem(category, itemData);
        if (res.status === 200) {
          onNotify('Item created successfully', 'success');
          Logger.access('Admin create item', { category });
        } else {
          onNotify(res.error?.message || 'Failed to create item', 'error');
          Logger.error('Admin create error', { category, error: res.error });
          return;
        }
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      onNotify('Failed to save item', 'error');
      Logger.error('Admin save exception', { category, error: e });
    }
  };

  const openModal = (item: ContentItem | null = null) => {
    setFormErrors({});
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
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
      const res = await api.adminUpdateItem(category, item.id, { featured: !item.featured });
      if (res.status === 200) {
        loadData();
        onNotify(`Item ${!item.featured ? 'featured' : 'unfeatured'}`, 'success');
        Logger.access('Admin toggle featured', { category, id: item.id, featured: !item.featured });
      } else {
        onNotify(res.error?.message || 'Failed to update status', 'error');
        Logger.error('Admin toggle error', { category, id: item.id, error: res.error });
      }
    } catch (e) {
      onNotify('Failed to update status', 'error');
      Logger.error('Admin toggle exception', { category, id: item.id, error: e });
    }
  };

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

  const filterKey = (searchDebounce <= 0 ? searchTerm : debouncedSearch).toLowerCase();
  const filteredItems = items.filter((item) => (item.title || '').toLowerCase().includes(filterKey));

  return (
    <div className="space-y-xl">
      {/* Header Actions */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'surface-glass flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between',
          'rounded-xl border border-border/60 p-xs sm:p-sm shadow-1'
        )}
      >
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle h-4 w-4" />
          <input
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              'w-full rounded-lg pl-10 pr-4 py-2 text-sm',
              'bg-surface border border-border/70 text-primary placeholder:text-ink-subtle',
              'outline-none transition-all duration-fast ease-standard',
              'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className={cn(
            'inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-pill',
            'px-4 py-2 text-sm font-bold text-accent-foreground bg-accent',
            'press-lift shadow-2 hover:shadow-glow',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_7%)]'
          )}
        >
          <Plus className="h-4 w-4" />
          <span>Add New {title.slice(0, -1)}</span>
        </button>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : 0.08 }}
        className={cn(
          'bg-surface/80 backdrop-blur-sm border border-border/60 rounded-xl shadow-1 overflow-hidden'
        )}
      >
        <div className="border-b border-border/60 px-md py-sm flex items-start sm:items-center flex-col sm:flex-row sm:justify-between gap-xs">
          <div className="min-w-0">
            <span className="eyebrow text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">
              {CATEGORY_EYEBROW[category]}
            </span>
            <h3 className="headline font-bold text-lg text-primary leading-tight">{title}</h3>
          </div>
          <div className="text-xs text-ink-muted">
            {filteredItems.length} of {items.length} shown
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/60">
              <tr>
                <th className="px-md py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Title
                </th>
                <th className="px-md py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Date
                </th>
                <th className="px-md py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Status
                </th>
                <th className="px-md py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-md py-12 text-center text-ink-muted">
                    Loading data…
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-md py-12 text-center">
                    <p className="text-sm font-semibold text-primary mb-1">No items found.</p>
                    <p className="text-xs text-ink-muted">
                      {searchTerm ? 'Try a different search term.' : `Click “Add New ${title.slice(0, -1)}” to get started.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors duration-fast ease-standard hover:bg-surface-elevated/60"
                  >
                    <td className="px-md py-3">
                      <div className="font-semibold text-primary truncate max-w-md">{item.title}</div>
                      <div className="text-xs text-ink-subtle truncate max-w-md">{item.description}</div>
                    </td>
                    <td className="px-md py-3 text-sm text-ink-muted whitespace-nowrap">{item.date}</td>
                    <td className="px-md py-3">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(item)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider',
                          'press-lift transition-colors duration-normal ease-emphasis',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_7%)]',
                          item.featured
                            ? 'bg-accent/15 text-accent border-accent/40 shadow-1'
                            : 'bg-surface-elevated/60 text-ink-subtle border-border/60 hover:bg-surface-elevated hover:text-ink-muted'
                        )}
                      >
                        <Star className={cn('h-3 w-3', item.featured ? 'fill-current' : '')} />
                        {item.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="px-md py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Edit Item"
                          onClick={() => openModal(item)}
                          className={cn(
                            'inline-flex h-8 w-8 items-center justify-center rounded-md',
                            'text-primary/80 hover:bg-accent/15 hover:text-accent',
                            'press-lift transition-colors duration-fast',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_7%)]'
                          )}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete Item"
                          onClick={() => handleDelete(item.id)}
                          className={cn(
                            'inline-flex h-8 w-8 items-center justify-center rounded-md',
                            'text-destructive/80 hover:bg-destructive/10 hover:text-destructive',
                            'press-lift transition-colors duration-fast',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_47%_7%)]'
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-surface rounded-t-2xl sm:rounded-2xl shadow-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col border border-border/70"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-surface-elevated/90 backdrop-blur px-md py-sm">
                <div>
                  <h3 className="headline font-bold text-lg text-primary">
                    {editingItem ? 'Edit Item' : `New ${title.slice(0, -1)}`}
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Fill in the details below. Fields marked with * are required.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md',
                    'text-ink-subtle hover:text-primary hover:bg-surface',
                    'press-lift transition-colors duration-fast',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]'
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-md py-sm space-y-md">
                <div>
                  <label htmlFor={`cm-title-${category}`} className="block text-sm font-semibold text-primary mb-1">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    id={`cm-title-${category}`}
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={cn(
                      'w-full rounded-lg px-3 py-2.5 text-sm',
                      'bg-surface-elevated/60 border text-primary placeholder:text-ink-subtle',
                      formErrors.title ? 'border-destructive/60' : 'border-border/70',
                      'outline-none transition-all duration-fast ease-standard',
                      'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                    )}
                  />
                  {formErrors.title && (
                    <p className="text-xs text-destructive mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div>
                    <label htmlFor={`cm-date-${category}`} className="block text-sm font-semibold text-primary mb-1">
                      Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={`cm-date-${category}`}
                      type="date"
                      required
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={cn(
                        'w-full rounded-lg px-3 py-2.5 text-sm',
                        'bg-surface-elevated/60 border text-primary',
                        formErrors.date ? 'border-destructive/60' : 'border-border/70',
                        'outline-none transition-all duration-fast ease-standard',
                        'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                      )}
                    />
                    {formErrors.date && (
                      <p className="text-xs text-destructive mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  {category === 'event' && (
                    <div>
                      <label htmlFor={`cm-time-${category}`} className="block text-sm font-semibold text-primary mb-1">
                        Time <span className="text-destructive">*</span>
                      </label>
                      <input
                        id={`cm-time-${category}`}
                        type="text"
                        value={(formData as Record<string, unknown>).time as string || ''}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value } as Partial<ContentItem>)}
                        className={cn(
                          'w-full rounded-lg px-3 py-2.5 text-sm',
                          'bg-surface-elevated/60 border text-primary placeholder:text-ink-subtle',
                          formErrors.time ? 'border-destructive/60' : 'border-border/70',
                          'outline-none transition-all duration-fast ease-standard',
                          'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                        )}
                        placeholder="10:00 AM"
                      />
                      {formErrors.time && (
                        <p className="text-xs text-destructive mt-1">{formErrors.time}</p>
                      )}
                    </div>
                  )}
                </div>

                {category === 'event' && (
                  <div>
                    <label htmlFor={`cm-loc-${category}`} className="block text-sm font-semibold text-primary mb-1">
                      Location <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={`cm-loc-${category}`}
                      type="text"
                      value={(formData as Record<string, unknown>).location as string || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value } as Partial<ContentItem>)}
                      className={cn(
                        'w-full rounded-lg px-3 py-2.5 text-sm',
                        'bg-surface-elevated/60 border text-primary placeholder:text-ink-subtle',
                        formErrors.location ? 'border-destructive/60' : 'border-border/70',
                        'outline-none transition-all duration-fast ease-standard',
                        'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                      )}
                    />
                    {formErrors.location && (
                      <p className="text-xs text-destructive mt-1">{formErrors.location}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor={`cm-desc-${category}`} className="block text-sm font-semibold text-primary mb-1">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id={`cm-desc-${category}`}
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={cn(
                      'w-full rounded-lg px-3 py-2.5 text-sm resize-none',
                      'bg-surface-elevated/60 border border-border/70 text-primary placeholder:text-ink-subtle',
                      'outline-none transition-all duration-fast ease-standard',
                      'focus:border-accent/60 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">Cover Image</label>
                  <MediaDropzone
                    onDrop={handleFileDrop}
                    initialPreview={(formData as Partial<ContentItem> & { imageUrl?: string }).imageUrl || ''}
                    onClear={handleClearFile}
                    accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
                  />
                </div>

                <label className="flex items-start gap-2 cursor-pointer select-none pt-xs">
                  <input
                    type="checkbox"
                    id={`cm-featured-${category}`}
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className={cn(
                      'mt-0.5 h-4 w-4 rounded border-border/70 text-accent bg-surface-elevated/70',
                      'focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[hsl(222_47%_7%)]'
                    )}
                  />
                  <span className="text-sm text-primary leading-snug">
                    <span className="font-semibold">Mark as Featured</span>
                    <span className="block text-xs text-ink-muted">
                      Pins this item at the top of the dashboard overview and the public-site listings.
                    </span>
                  </span>
                </label>
              </form>

              <div className="sticky bottom-0 border-t border-border/60 bg-surface-elevated/90 backdrop-blur px-md py-sm flex flex-col sm:flex-row gap-xs sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 text-sm font-bold',
                    'text-ink-muted bg-surface/70 border border-border/70',
                    'press-lift hover:bg-surface hover:text-primary',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={undefined}
                  onClick={handleSave}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 text-sm font-bold',
                    'text-accent-foreground bg-accent',
                    'press-lift shadow-2 hover:shadow-glow',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_42%_9%)]'
                  )}
                >
                  <Save className="h-4 w-4" />
                  Save Item
                </button>
              </div>
            </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
