import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
    const [role, setRole] = useState(null);

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome to OnMyWay! </h2>

                <div className="role-selection">
                    <button className="role-btn" onClick={() => setRole('driver')}>
                        <span className="role-icon">🚐</span>
                        <span>Driver</span>
                    </button>

                    <button className="role-btn" onClick={() => setRole('parent')}>
                        <span className="role-icon">👨</span>
                        <span>Parent</span>
                    </button>
                </div>
                {role && (
                    <>
                        <p className="role-display">
                            Selected: {role === 'driver' ? 'Driver' : 'Parent'}
                        </p>

                        <button
                            className="login-btn"
                            onClick={() => onLogin(role)}
                        >
                            Login as {role}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
