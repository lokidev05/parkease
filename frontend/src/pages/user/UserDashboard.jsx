import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('slots');

  useEffect(() => {
    fetchSlots();
    fetchMyBookings();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await API.get('/slots');
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await API.get('/bookings/my');
      setMyBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    setMessage('');
    try {
      await API.post('/bookings', {
        slotId: selectedSlot.id,
        durationHours: duration
      });
      setMessage('Booking confirmed!');
      setSelectedSlot(null);
      fetchSlots();
      fetchMyBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const getSlotColor = (status, type) => {
    if (status === 'OCCUPIED') return 'bg-red-500/20 border-red-500/50 text-red-400';
    if (status === 'MAINTENANCE') return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    if (type === 'EV') return 'bg-green-500/20 border-green-500/50 text-green-400 cursor-pointer hover:bg-green-500/30';
    if (type === 'BIKE') return 'bg-blue-500/20 border-blue-500/50 text-blue-400 cursor-pointer hover:bg-blue-500/30';
    return 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-600/50';
  };

  const getSlotIcon = (type) => {
    if (type === 'BIKE') return '🏍️';
    if (type === 'EV') return '⚡';
    return '🚗';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">ParkEase</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'slots'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Book a Slot
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>

        {/* Slots View */}
        {activeTab === 'slots' && (
          <div>
            {/* Legend */}
            <div className="flex gap-6 mb-6 text-sm">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-600"></span>Available (Car)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span>Available (Bike)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500"></span>Available (EV)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500"></span>Occupied</span>
            </div>

            {/* Parking Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-8">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  onClick={() => slot.status === 'AVAILABLE' && setSelectedSlot(slot)}
                  className={`border rounded-xl p-3 text-center transition ${getSlotColor(slot.status, slot.type)} ${
                    selectedSlot?.id === slot.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <div className="text-lg mb-1">{getSlotIcon(slot.type)}</div>
                  <div className="text-xs font-bold">{slot.slotNumber}</div>
                  <div className="text-xs opacity-70">{slot.floor}</div>
                  <div className="text-xs opacity-70">₹{slot.pricePerHour}/hr</div>
                </div>
              ))}
            </div>

            {/* Booking Panel */}
            {selectedSlot && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  Book Slot {selectedSlot.slotNumber}
                </h3>
                <div className="space-y-3 mb-4 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="text-white">{selectedSlot.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Floor</span>
                    <span className="text-white">{selectedSlot.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="text-white">₹{selectedSlot.pricePerHour}/hr</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-xl font-bold text-green-400">
                    ₹{selectedSlot.pricePerHour * duration}
                  </span>
                </div>
                {message && (
                  <div className={`text-sm mb-3 p-3 rounded-lg ${
                    message.includes('confirmed')
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {message}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition text-sm disabled:opacity-50"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                No bookings yet. Book a slot to get started.
              </div>
            ) : (
              myBookings.map(booking => (
                <div key={booking.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Slot {booking.slotNumber}
                        <span className="text-sm text-gray-400 ml-2">{booking.slotType}</span>
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">Floor: {booking.floor}</p>
                      <p className="text-gray-400 text-sm">
                        Duration: {booking.durationHours} hour(s)
                      </p>
                      <p className="text-gray-400 text-sm">
                        Start: {new Date(booking.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-500/20 text-green-400'
                          : booking.status === 'COMPLETED'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-green-400 font-bold mt-2">₹{booking.totalAmount}</p>
                      {booking.penaltyAmount > 0 && (
                        <p className="text-red-400 text-sm">
                          Penalty: ₹{booking.penaltyAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}