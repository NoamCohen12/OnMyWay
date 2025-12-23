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
    const position = [32.09, 34.7818] // Tel Aviv
    const [passengers, setPassengers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch passengers from backend
    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const response = await fetch('http://localhost:3000/users')
                if (!response.ok) {
                    throw new Error('Failed to fetch passengers')
                }
                const data = await response.json()
                setPassengers(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchPassengers()
    }, []) // Empty dependency array means this runs once on mount

    return (
        <div className="Map">
            <div className="PassengersList">
                <h3>Passengers</h3>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {!loading && !error && (
                    <ul>
                        {passengers.map((passenger) => (
                            <li
                                key={passenger.id}
                                className={passenger.status_ride ? 'active-ride' : 'inactive-ride'}
                            >
                                {passenger.f_name} {passenger.l_name}
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
            <div className="Statistics">
                statistics
            </div>
        </div>
    )
}
