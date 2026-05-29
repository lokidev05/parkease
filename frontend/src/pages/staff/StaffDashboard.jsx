import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await API.get('/slots');
      setSlots(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings/all');
      setBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleComplete = async (id) => {
    try {
      await API.put(`/bookings/${id}/complete`);
      setMessage('Booking completed successfully');
      fetchSlots();
      fetchBookings();
    } catch (err) {
      setMessage('Failed to complete booking');
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-blue-400">ParkEase</h1>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Staff</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total Slots</p>
            <p className="text-2xl font-bold text-blue-400">{slots.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Active Bookings</p>
            <p className="text-2xl font-bold text-green-400">{activeBookings.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Available Slots</p>
            <p className="text-2xl font-bold text-yellow-400">
              {slots.filter(s => s.status === 'AVAILABLE').length}
            </p>
          </div>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        {/* Active Bookings */}
        <h2 className="text-lg font-semibold mb-4">Active Bookings</h2>
        <div className="space-y-4">
          {activeBookings.length === 0 ? (
            <div className="text-center text-gray-500 py-16 bg-gray-900 border border-gray-800 rounded-xl">
              No active bookings right now.
            </div>
          ) : (
            activeBookings.map(b => (
              <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Slot {b.slotNumber}
                    <span className="text-gray-400 text-sm ml-2">{b.slotType}</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Floor: {b.floor}</p>
                  <p className="text-gray-400 text-sm">Duration: {b.durationHours} hour(s)</p>
                  <p className="text-gray-400 text-sm">
                    End time: {new Date(b.endTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg mb-3">₹{b.totalAmount}</p>
                  <button
                    onClick={() => handleComplete(b.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Slot Grid */}
        <h2 className="text-lg font-semibold mt-8 mb-4">Slot Overview</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {slots.map(slot => (
            <div
              key={slot.id}
              className={`border rounded-xl p-3 text-center ${
                slot.status === 'AVAILABLE' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                slot.status === 'OCCUPIED' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              <div className="text-xs font-bold">{slot.slotNumber}</div>
              <div className="text-xs opacity-70">{slot.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}