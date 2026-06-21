import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Імпортуємо fetchTracks та новий екшен для вибору треку
import { fetchTracks, setCurrentTrack } from './trackSlice';
import { useMediaQuery } from "@mui/material";

const TrackList = ({ SERVER_URL }) => {
    const dispatch = useDispatch();
        const isPhone = useMediaQuery("(max-width: 768px)");
    
    // Отримуємо дані зі стору Redux (додали currentTrack)
    const { items: tracks, loading, error, currentTrack } = useSelector((state) => state.tracks);

    // Завантажуємо треки при монтуванні компонента
    useEffect(() => {
        dispatch(fetchTracks());
    }, [dispatch, SERVER_URL]);

    if (loading) return <div style={{ padding: '20px', color: 'white' }}>Завантаження...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Помилка: {error}</div>;
    
    return (
        <div style={{ 
            width: isPhone ? "100wh": '300px', 
            background: '#181818', 
            padding: '20px', 
            overflowY: 'auto', 
            borderRight: '1px solid #333', 
            // Зменшуємо висоту на 90px, щоб список не перекривався нижнім плеєром
            // height: "calc(100vh - 10px)", 
            color: 'white',
            boxSizing: 'border-box'
        }}>
            <h2 style={{ color: "white", marginBottom: '20px' }}>Твоя бібліотека</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tracks.map(track => {
                    // Перевіряємо, чи цей трек зараз є активним у плеєрі
                    const isCurrent = currentTrack?.id === track.id;

                    return (
                        <div 
                            key={track.id} 
                            // 🔥 При кліку робимо трек активним у Redux
                            onClick={() => dispatch(setCurrentTrack(track))} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px', 
                                gap: '10px', 
                                cursor: 'pointer',
                                borderRadius: '6px',
                                // Якщо трек активний — робимо сірий фон
                                background: isCurrent ? '#282828' : 'transparent', 
                                transition: 'background 0.2s ease'
                            }}
                            // Ефект наведення мишки (для неактивних треків)
                            onMouseEnter={(e) => !isCurrent && (e.currentTarget.style.background = '#1a1a1a')}
                            onMouseLeave={(e) => !isCurrent && (e.currentTarget.style.background = 'transparent')}
                        >
                            <img 
                                src={`${SERVER_URL}/${track.image}`} 
                                alt={track.name} 
                                style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
                            />
                            <div>
                                {/* 🔥 Якщо трек активний — підсвічуємо назву фірмовим зеленим кольором */}
                                <h3 style={{ 
                                    fontSize: '14px', 
                                    margin: 0, 
                                    color: isCurrent ? '#1db954' : 'white',
                                    transition: 'color 0.2s ease'
                                }}>
                                    {track.name}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>{track.author}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackList;


