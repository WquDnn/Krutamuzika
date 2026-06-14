import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsPlaying } from './trackSlice'; // Переконайся, що шлях правильний

const AudioPlayer = ({ SERVER_URL }) => {
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const { currentTrack, isPlaying } = useSelector((state) => state.tracks);

    // 1. Завантаження нового треку при зміні
    useEffect(() => {
        if (!currentTrack || !audioRef.current) return;

        audioRef.current.src = `${SERVER_URL}/tracks/${currentTrack.id}/stream`;
        audioRef.current.load();
    }, [currentTrack, SERVER_URL]);

    // 2. Керування Play/Pause
    useEffect(() => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.play().catch(err => {
                console.warn("Помилка автоплею:", err);
                dispatch(setIsPlaying(false));
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, dispatch]);

    // 3. Обробка часу та метаданих
    const onLoadedMetadata = (e) => {
        const dur = isFinite(e.target.duration) ? e.target.duration : 0;
        setDuration(dur);
    };

    const onTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Форматування часу (0:00)
    const formatTime = (time) => {
        return `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
    };

    // Якщо трек не вибрано — показуємо порожній екран, який заповнює простір
    if (!currentTrack) {
        return (
            <div style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#121212',
                color: '#555',
                fontSize: '20px'
            }}>
                Виберіть трек для відтворення
            </div>
        );
    }

    // URL для картинки треку (якщо картинки немає, ставимо дефолтну іконку)
    const imageUrl = currentTrack.image ? `${SERVER_URL}/${currentTrack.image}` : null;

    return (
        <div style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // Робимо градієнтний фон, як у Spotify (можеш налаштувати колір під себе)
            background: 'linear-gradient(to bottom, #3b4d2b, #121212)', 
            padding: '40px',
            boxSizing: 'border-box',
            height: '100vh',
            position: 'relative'
        }}>
            <audio 
                ref={audioRef}
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => dispatch(setIsPlaying(false))}
            />

            {/* Контейнер плеєра по центру */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '420px'
            }}>
                
                {/* ВЕЛИКА ОБКЛАДИНКА ТРЕКУ */}
                <div style={{
                    width: '320px',
                    height: '320px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    background: '#282828',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px'
                }}>
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={currentTrack.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: '80px' }}>🎵</span>
                    )}
                </div>

                {/* НАЗВА ТА АВТОР */}
                <div style={{ width: '100%', textAlign: 'left', marginBottom: '25px' }}>
                    <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {currentTrack.name}
                    </div>
                    <div style={{ 
                        fontSize: '16px', 
                        color: '#b3b3b3', 
                        marginTop: '5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {currentTrack.author}
                    </div>
                </div>

                {/* СЛАЙДЕР ТА ЧАС */}
                <div style={{ width: '100%', marginBottom: '30px' }}>
                    <input 
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{ 
                            width: '100%', 
                            accentColor: '#1db954', 
                            cursor: 'pointer',
                            height: '4px',
                            borderRadius: '2px'
                        }}
                    />
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '12px', 
                        color: '#b3b3b3', 
                        marginTop: '8px' 
                    }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* КНОПКИ КЕРУВАННЯ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    {/* Кнопка назад (Заглушка) */}
                    <button style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '24px', cursor: 'pointer' }}>
                        ⏮
                    </button>

                    {/* Головна кнопка PLAY / PAUSE */}
                    <button 
                        onClick={() => dispatch(setIsPlaying(!isPlaying))}
                        style={{ 
                            width: '64px', 
                            height: '64px', 
                            borderRadius: '50%', 
                            border: 'none',
                            background: 'white', 
                            color: 'black',
                            cursor: 'pointer',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    {/* Кнопка вперед (Заглушка) */}
                    <button style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '24px', cursor: 'pointer' }}>
                        ⏭
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AudioPlayer;