import { useState } from 'react';
import './AttendantSignIn.css';

export default function AttendantSignIn({ onLogin, onBack }) {
    const [attendantId, setAttendantId] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/login/attendant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendantId }),
            });

            const data = await response.json();

            if (data.success) {
                onLogin();
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h2>Attendant Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="attendantId">Attendant ID</label>
                        <input
                            type="text"
                            id="attendantId"
                            value={attendantId}
                            onChange={(e) => setAttendantId(e.target.value)}
                            placeholder="Enter your Attendant ID"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>
                    <button type="button" className="back-btn" onClick={() => onBack()}>
                        Back
                    </button>
                </form>
            </div>
        </div>
    );
}
