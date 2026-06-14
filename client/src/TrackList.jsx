import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTracks } from './trackSlice';

const TrackList = ({ SERVER_URL }) => {
    const dispatch = useDispatch();
    
    // Отримуємо дані зі стору Redux
    const { items: tracks, loading, error } = useSelector((state) => state.tracks);

    // Завантажуємо треки при монтуванні компонента
    useEffect(() => {
        dispatch(fetchTracks(SERVER_URL));
    }, [dispatch, SERVER_URL]);

    if (loading) return <div style={{ padding: '20px', color: 'white' }}>Завантаження...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Помилка: {error}</div>;
    
    return (
        <div style={{ width: '300px', background: '#181818', padding: '20px', overflowY: 'auto', borderRight: '1px solid #333', height: "95vh", color: 'white' }}>
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


