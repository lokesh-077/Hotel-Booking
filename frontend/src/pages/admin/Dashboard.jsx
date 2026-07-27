import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [filterMode, setFilterMode] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsRes = await api.get('bookings/');
                const roomsRes = await api.get('rooms/');
                setBookings(bookingsRes.data);
                setRooms(roomsRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            }
        };
        fetchData();
    }, []);

    const getWeek = (dateStr) => {
        const date = new Date(dateStr);
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
        return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    };

    const filteredBookings = bookings.filter(b => {
        if (filterMode === 'all') return true;
        if (!filterValue) return true;
        
        if (filterMode === 'date') {
            return b.check_in === filterValue || b.check_out === filterValue;
        }
        if (filterMode === 'month') {
            return b.check_in.startsWith(filterValue) || b.check_out.startsWith(filterValue);
        }
        if (filterMode === 'week') {
            return getWeek(b.check_in) === filterValue || getWeek(b.check_out) === filterValue;
        }
        return true;
    }).reverse();

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '2rem', gap: '1.5rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/reviews" className="btn btn-primary btn-mobile-sm">Manage Reviews</Link>
                    <Link to="/admin/settings" className="btn btn-primary btn-mobile-sm">Settings</Link>
                    <Link to="/admin/rooms" className="btn btn-primary btn-mobile-sm">Manage Rooms</Link>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select 
                        value={filterMode} 
                        onChange={(e) => {setFilterMode(e.target.value); setFilterValue(''); setCurrentPage(1);}} 
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                    >
                        <option value="all">All Time</option>
                        <option value="date">Specific Date</option>
                        <option value="week">By Week</option>
                        <option value="month">By Month</option>
                    </select>
                    {filterMode === 'date' && <input type="date" value={filterValue} onChange={(e) => {setFilterValue(e.target.value); setCurrentPage(1);}} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)' }} />}
                    {filterMode === 'week' && <input type="week" value={filterValue} onChange={(e) => {setFilterValue(e.target.value); setCurrentPage(1);}} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)' }} />}
                    {filterMode === 'month' && <input type="month" value={filterValue} onChange={(e) => {setFilterValue(e.target.value); setCurrentPage(1);}} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)' }} />}
                </div>
            </div>

            <div className="grid-1-1" style={{ marginBottom: '3rem' }}>
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Rooms Booked</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>{new Set(filteredBookings.map(b => b.room)).size}</div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Bookings</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>{filteredBookings.length}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Booking Details</h3>
            </div>
            
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--color-bg)' }}>
                        <tr>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Booking ID</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>User</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Room</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Dates</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Total</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Guest Info</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBookings.map(b => (
                            <tr key={b.id}>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>#{b.id}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.user_detail?.username}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.room_detail?.type}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{b.check_in} to {b.check_out}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>₹{b.total_price}</td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>📞 {b.mobile_number || 'N/A'}</div>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>🏠 {b.address || 'N/A'}</div>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>💳 {b.aadhar_number || 'N/A'}</div>
                                    {b.aadhar_photo && (
                                        <a href={b.aadhar_photo} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'inline-block', marginTop: '0.25rem' }}>View Aadhar Photo</a>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: 'var(--radius-sm)', 
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        background: b.status === 'confirmed' ? '#D1FAE5' : '#FEF3C7',
                                        color: b.status === 'confirmed' ? '#065F46' : '#92400E'
                                    }}>
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>No bookings found.</p>}
                
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Previous</button>
                        <span style={{ fontWeight: 500, color: 'var(--color-text-light)' }}>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
