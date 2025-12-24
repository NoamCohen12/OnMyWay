import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'


// Icons
const busIcon = new L.Icon({
    iconUrl: '/icons/bus.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
})

const greenIcon = new L.Icon({
    iconUrl: '/icons/marker-green.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
})

const redIcon = new L.Icon({
    iconUrl: '/icons/marker-red.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
})


export default function Map() {
    const position = [32.0853, 34.7818] // Tel Aviv Center
    const [passengers, setPassengers] = useState([])
    const [route, setRoute] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Add User Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ f_name: '', l_name: '', address: '' });
    const [addError, setAddError] = useState('');
    const [adding, setAdding] = useState(false);


    useEffect(() => {
        fetchPassengers()
        fetchRoute()
    }, [])

    const fetchPassengers = async () => {
        try {
            const response = await fetch('http://localhost:3000/users')
            if (!response.ok) throw new Error('Failed to fetch passengers')
            const data = await response.json()
            setPassengers(data)
            setLoading(false)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const fetchRoute = async () => {
        try {
            const response = await fetch('http://localhost:3000/route')
            if (!response.ok) throw new Error('Failed to fetch route')
            const data = await response.json()
            setRoute(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAdding(true);
        setAddError('');

        try {
            const response = await fetch('http://localhost:3000/addUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add user');
            }

            // Success: Refresh list and clear form
            await fetchPassengers();
            setNewUser({ f_name: '', l_name: '', address: '' });
            setShowAddForm(false);
        } catch (err) {
            setAddError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteUser = async (id, e) => {
        e.stopPropagation(); // Prevent li click logic if added later
        if (!confirm('Are you sure you want to delete this passenger?')) return;

        try {
            const response = await fetch(`http://localhost:3000/deleteUser/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');

            // Optimistic update or refresh
            setPassengers(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };


    return (
        <div className="Map">
            <div className="PassengersList">
                <h3>Passengers</h3>

                <button
                    className="add-passenger-btn"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : '+ Add Passenger'}
                </button>

                {showAddForm && (
                    <form className="add-user-form" onSubmit={handleAddUser}>
                        <input
                            type="text"
                            placeholder="First Name"
                            required
                            value={newUser.f_name}
                            onChange={e => setNewUser({ ...newUser, f_name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            required
                            value={newUser.l_name}
                            onChange={e => setNewUser({ ...newUser, l_name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address (Israel)"
                            required
                            value={newUser.address}
                            onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                        />
                        <button type="submit" disabled={adding}>
                            {adding ? 'Adding...' : 'Save Passenger'}
                        </button>
                        {addError && <div className="error-message">{addError}</div>}
                    </form>
                )}

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {!loading && !error && (
                    <ul>
                        {passengers.map((passenger) => (
                            <li
                                key={passenger.id}
                                className={passenger.status_ride ? 'active-ride' : 'inactive-ride'}
                            >
                                <span className="passenger-name">
                                    {passenger.f_name} {passenger.l_name}
                                </span>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => handleDeleteUser(passenger.id, e)}
                                    title="Delete Passenger"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <MapContainer id="mapContainer" center={position} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={busIcon}>
                    <Popup>
                        Where the ride begins
                    </Popup>
                </Marker>
                {passengers.map((passenger) => (
                    passenger.x_coordinate && passenger.y_coordinate ? (
                        <Marker
                            key={passenger.id}
                            position={[passenger.x_coordinate, passenger.y_coordinate]}
                            icon={passenger.status_ride ? greenIcon : redIcon}
                        >
                            <Popup>
                                {passenger.f_name} {passenger.l_name}
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
            <div className="Route">
                <h3>The route</h3>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {!loading && !error && (
                    <ol className="route-steps">
                        {route.map((point) => (
                            <li key={point.id} className="route-step">
                                <span className="step-name">{point.name}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    )
}
