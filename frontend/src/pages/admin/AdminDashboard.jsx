import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newSlot, setNewSlot] = useState({ slotNumber: '', type: 'CAR', pricePerHour: '', floor: '' });
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

  const handleCreateSlot = async () => {
    try {
      await API.post('/slots', newSlot);
      setMessage('Slot created successfully');
      setNewSlot({ slotNumber: '', type: 'CAR', pricePerHour: '', floor: '' });
      fetchSlots();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await API.delete(`/slots/${id}`);
      fetchSlots();
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/slots/${id}/status?status=${status}`);
      fetchSlots();
    } catch (err) { console.error(err); }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const availableSlots = slots.filter(s => s.status === 'AVAILABLE').length;
  const occupiedSlots = slots.filter(s => s.status === 'OCCUPIED').length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-blue-400">ParkEase</h1>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Slots', value: slots.length, color: 'text-blue-400' },
            { label: 'Available', value: availableSlots, color: 'text-green-400' },
            { label: 'Occupied', value: occupiedSlots, color: 'text-red-400' },
            { label: 'Total Revenue', value: `₹${totalRevenue}`, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['overview', 'slots', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Slot Status Overview</h3>
              <div className="space-y-3">
                {['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'].map(status => {
                  const count = slots.filter(s => s.status === status).length;
                  const pct = slots.length ? (count / slots.length) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{status}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'AVAILABLE' ? 'bg-green-500' :
                            status === 'OCCUPIED' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-white">Slot {b.slotNumber}</span>
                      <span className="text-gray-500 ml-2">{b.slotType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400">₹{b.totalAmount}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        b.status === 'COMPLETED' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slots Management */}
        {activeTab === 'slots' && (
          <div>
            {/* Add Slot Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4">Add New Slot</h3>
              {message && (
                <div className={`text-sm mb-4 p-3 rounded-lg ${
                  message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>{message}</div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  placeholder="Slot Number (e.g. C1)"
                  value={newSlot.slotNumber}
                  onChange={e => setNewSlot({...newSlot, slotNumber: e.target.value})}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <select
                  value={newSlot.type}
                  onChange={e => setNewSlot({...newSlot, type: e.target.value})}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option>CAR</option>
                  <option>BIKE</option>
                  <option>EV</option>
                </select>
                <input
                  placeholder="Price per hour"
                  type="number"
                  value={newSlot.pricePerHour}
                  onChange={e => setNewSlot({...newSlot, pricePerHour: e.target.value})}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <input
                  placeholder="Floor (e.g. Ground)"
                  value={newSlot.floor}
                  onChange={e => setNewSlot({...newSlot, floor: e.target.value})}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <button
                onClick={handleCreateSlot}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition text-sm"
              >
                Add Slot
              </button>
            </div>

            {/* Slots Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    {['Slot', 'Type', 'Floor', 'Price/hr', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map(slot => (
                    <tr key={slot.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-medium">{slot.slotNumber}</td>
                      <td className="px-4 py-3 text-gray-400">{slot.type}</td>
                      <td className="px-4 py-3 text-gray-400">{slot.floor}</td>
                      <td className="px-4 py-3 text-gray-400">₹{slot.pricePerHour}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          slot.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' :
                          slot.status === 'OCCUPIED' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>{slot.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(slot.id, 'MAINTENANCE')}
                            className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/30"
                          >
                            Maintenance
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(slot.id, 'AVAILABLE')}
                            className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30"
                          >
                            Available
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400">
                <tr>
                  {['ID', 'Slot', 'Type', 'Duration', 'Amount', 'Penalty', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-400">#{b.id}</td>
                    <td className="px-4 py-3 font-medium">{b.slotNumber}</td>
                    <td className="px-4 py-3 text-gray-400">{b.slotType}</td>
                    <td className="px-4 py-3 text-gray-400">{b.durationHours}h</td>
                    <td className="px-4 py-3 text-green-400">₹{b.totalAmount}</td>
                    <td className="px-4 py-3 text-red-400">
                      {b.penaltyAmount > 0 ? `₹${b.penaltyAmount}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        b.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        b.status === 'COMPLETED' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}