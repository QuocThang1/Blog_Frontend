import React, { useEffect, useState } from 'react';
import { Modal, Select, Tag, Button } from 'antd';
import { getAllCategoriesApi } from '../utils/Api/categoryApi';
import { updateProfileApi } from '../utils/Api/accountApi';
import { toast } from 'react-toastify';

const { Option } = Select;

const FavoriteCategoriesModal = ({ open, onClose, onSaved, initialSelected = [] }) => {
    const [allCategories, setAllCategories] = useState([]);
    const [selected, setSelected] = useState(initialSelected);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) fetchCategories();
    }, [open]);

    useEffect(() => {
        // Normalize initialSelected (could be array of objects or ids)
        if (!initialSelected) {
            setSelected([]);
            return;
        }
        const ids = initialSelected.map(item => (typeof item === 'object' ? (item._id || item.id) : item));
        setSelected(ids);
    }, [initialSelected]);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesApi();
            if (res && res.data) {
                setAllCategories(res.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfileApi({ categories: selected });
            toast.success('Favorite topics saved');
            onSaved && onSaved();
            onClose && onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Failed to save topics');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title={<div>Pick topics you like <span role="img" aria-label="tag">🏷️</span></div>}
            onCancel={onClose}
            footer={(
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Skip for now</Button>
                    <Button type="primary" onClick={handleSave} loading={saving}>
                        Save
                    </Button>
                </div>
            )}
        >
            <p>Select topics (you can pick multiple). Click to toggle a topic — we'll use this to personalize your feed.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {allCategories.map(cat => {
                    const isChecked = selected.includes(cat._id);
                    return (
                        <div
                            key={cat._id}
                            onClick={() => {
                                if (isChecked) setSelected(prev => prev.filter(id => id !== cat._id));
                                else setSelected(prev => [...prev, cat._id]);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') {
                                if (isChecked) setSelected(prev => prev.filter(id => id !== cat._id));
                                else setSelected(prev => [...prev, cat._id]);
                            } }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: isChecked ? '2px solid #1890ff' : '1px solid #e6e6e6',
                                background: isChecked ? '#e6f7ff' : '#fff',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                        >
                            <div style={{ fontWeight: 600, color: isChecked ? '#1890ff' : '#333' }}>{cat.name}</div>
                            {cat.description && <div style={{ fontSize: 12, color: '#666' }}>{cat.description}</div>}
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};

export default FavoriteCategoriesModal;
