import React, { useState, useEffect } from 'react';

const TrackList = ({ SERVER_URL }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${SERVER_URL}/tracks`)
            .then(res => res.json())
            .then(data => { setTracks(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [SERVER_URL]);

    if (loading) return <div style={{ padding: '20px' }}>Завантаження...</div>;
    
    return (
        <div style={{ width: '300px', background: '#181818', padding: '20px', overflowY: 'auto', borderRight: '1px solid #333', height: "95vh" }}>
            <h2 style={{ color: "white"}}>Твоя бібліотека</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tracks.map(track => (
                    <div key={track.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', gap: '10px', cursor: 'pointer' }}>
                        <img src={`${SERVER_URL}/${track.image}`} alt={track.name} style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                        <div>
                            <h3 style={{ fontSize: '14px', margin: 0 }}>{track.name}</h3>
                            <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{track.author}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackList;
