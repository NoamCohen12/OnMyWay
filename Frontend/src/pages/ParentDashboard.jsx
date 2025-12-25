import { useState } from 'react';
import './ParentDashboard.css';

export default function ParentDashboard() {
    const [childId, setChildId] = useState('');
    const [childData, setChildData] = useState(null); // Stores fetched child details
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChild = async () => {
        if (!childId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/users/${childId}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Child not found');
                throw new Error('Failed to fetch child');
            }
            const data = await response.json();
            setChildData(data);
        } catch (err) {
            setError(err.message);
            setChildData(null);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        if (!childData) return;

        // Optimistic update
        const previousStatus = childData.status_ride;
        setChildData(prev => ({ ...prev, status_ride: newStatus ? 1 : 0 })); // Adjust for DB boolean 1/0

        try {
            const response = await fetch(`http://localhost:3000/users/${childId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_ride: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

        } catch (err) {
            console.error(err);
            alert('Failed to update status');
            // Revert on error
            setChildData(prev => ({ ...prev, status_ride: previousStatus }));
        }
    };


    if (!childData) {
        return (
            <div className="parent-dashboard-container">
                <div className="parent-card">
                    <h2 className="dashboard-title">Enter child ID 👋</h2>

                    <div className="input-group">
                        <input
                            className="child-id-input"
                            type="text"
                            placeholder="Enter child ID"
                            value={childId}
                            onChange={(e) => setChildId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchChild()}
                        />

                        <button
                            className="primary-btn"
                            onClick={fetchChild}
                            disabled={!childId || loading}
                        >
                            {loading ? 'Searching...' : 'Continue'}
                        </button>
                    </div>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="parent-dashboard-container">
            <div className="parent-card">
                <h2 className="dashboard-title">Hello, Parent 👋</h2>

                <div className="child-info">
                    <div className="info-row">
                        <span className="info-label">Child Name:</span>
                        <span className="info-value">{childData.f_name} {childData.l_name}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Child ID:</span>
                        <span className="info-value">{childData.id}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Ride Status:</span>
                        <span className="info-value" style={{ color: childData.status_ride ? 'green' : 'red' }}>
                            {childData.status_ride ? 'Going' : 'Not Going'}
                        </span>
                    </div>
                </div>

                <div className="status-actions">
                    <button
                        className="status-btn going"
                        onClick={() => updateStatus(true)}
                        style={{ opacity: childData.status_ride ? 1 : 0.6 }}
                    >
                        <span className="status-check">✔</span>
                        The child is going
                    </button>

                    <button
                        className="status-btn not-going"
                        onClick={() => updateStatus(false)}
                        style={{ opacity: !childData.status_ride ? 1 : 0.6 }}
                    >
                        <span className="status-check">❌</span>
                        The child is not going
                    </button>
                </div>

                <button
                    className="text-btn"
                    onClick={() => { setChildData(null); setChildId(''); setError(null); }}
                    style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Back to search
                </button>

            </div>
        </div>
    );
}
