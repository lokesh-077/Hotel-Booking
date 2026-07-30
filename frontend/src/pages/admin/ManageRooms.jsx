import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const ManageRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null,
        room_number: '',
        type: 'Single',
        price_per_night: '',
        capacity: 1,
        description: '',
        facilities: '',
        image: null,
        gallery_images: []
    });

    const fetchRooms = async () => {
        try {
            const res = await api.get('rooms/');
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else if (e.target.name === 'gallery_images') {
            setFormData({ ...formData, gallery_images: Array.from(e.target.files) });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleEdit = (room) => {
        setFormData({
            id: room.id,
            room_number: room.room_number,
            type: room.type,
            price_per_night: room.price_per_night,
            capacity: room.capacity,
            description: room.description,
            facilities: room.facilities.join(', '),
            image: null,
            gallery_images: []
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this room?")) {
            try {
                await api.delete(`rooms/${id}/`);
                fetchRooms();
            } catch (err) {
                alert("Failed to delete room.");
            }
        }
    }

    const handleToggleVisibility = async (room) => {
        try {
            await api.patch(`rooms/${room.id}/`, { is_visible: !room.is_visible });
            fetchRooms(); // refresh the list
        } catch (err) {
            console.error(err);
            alert("Failed to update visibility.");
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            room_number: '',
            type: 'Single',
            price_per_night: '',
            capacity: 1,
            description: '',
            facilities: '',
            image: null,
            gallery_images: []
        });
        const fileInput = document.getElementById('room_image');
        if (fileInput) fileInput.value = '';
        const galleryInput = document.getElementById('gallery_images');
        if (galleryInput) galleryInput.value = '';
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const facilitiesArray = formData.facilities.split(',').map(item => item.trim()).filter(item => item !== '');

        const payload = new FormData();
        payload.append('room_number', formData.room_number);
        payload.append('type', formData.type);
        payload.append('price_per_night', formData.price_per_night);
        payload.append('capacity', formData.capacity);
        payload.append('description', formData.description);
        payload.append('facilities', JSON.stringify(facilitiesArray));

        if (formData.image) {
            payload.append('image', formData.image);
        }
        
        if (formData.gallery_images.length > 0) {
            formData.gallery_images.forEach(file => {
                payload.append('gallery_images', file);
            });
        }

        try {
            if (isEditing) {
                await api.put(`rooms/${formData.id}/`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('rooms/', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchRooms();
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Failed to save room details.");
        }
    };

    return (
        <div className="container grid-1-2" style={{ padding: '4rem 1.5rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2>{isEditing ? 'Edit Room' : 'Add New Room'}</h2>
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginTop: '1.5rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Room Number</label>
                            <input type="text" name="room_number" value={formData.room_number} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Price per Night (₹)</label>
                            <input type="number" step="0.01" name="price_per_night" value={formData.price_per_night} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Room Thumbnail Image</label>
                            <input type="file" name="image" id="room_image" onChange={handleChange} accept="image/*" />
                        </div>
                        <div className="input-group">
                            <label>Gallery Images (Select Multiple)</label>
                            <input type="file" name="gallery_images" id="gallery_images" onChange={handleChange} accept="image/*" multiple />
                        </div>
                        <div className="input-group">
                            <label>Facilities (comma separated)</label>
                            <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Wifi, TV, Pool..." />
                        </div>
                        <div className="input-group">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update Room' : 'Add Room'}</button>
                            {isEditing && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
                        </div>
                    </form>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2>Manage Existing Rooms</h2>
                {loading ? <p>Loading rooms...</p> : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        {rooms.map(room => (
                            <div key={room.id} style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {room.image && <img src={room.image} alt={room.type} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Room {room.room_number} ({room.type})</h3>
                                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>₹{room.price_per_night}/night • Capacity: {room.capacity}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button onClick={() => handleToggleVisibility(room)} className="btn" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: room.is_visible ? '#D1FAE5' : '#FEE2E2', border: `1px solid ${room.is_visible ? '#10B981' : '#EF4444'}` }} title={room.is_visible ? "Hide room from users" : "Show room to users"}>
                                        {room.is_visible ? <Eye size={18} color="#065F46" /> : <EyeOff size={18} color="#991B1B" />}
                                    </button>
                                    <button onClick={() => handleEdit(room)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Edit</button>
                                    <button onClick={() => handleDelete(room.id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                        {rooms.length === 0 && <p>No rooms found. Add one on the left!</p>}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageRooms;
