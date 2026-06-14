import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsPlaying } from './trackSlice'; // Переконайся, що імпорт відповідає твоїй назві файлу

const AudioPlayer = ({ SERVER_URL }) => {
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const { currentTrack, isPlaying } = useSelector((state) => state.tracks);

    // 1. При зміні треку — завантажуємо новий ресурс
    useEffect(() => {
        if (!currentTrack || !audioRef.current) return;

        audioRef.current.src = `${SERVER_URL}/tracks/${currentTrack.id}/stream`;
        audioRef.current.load(); // Обов'язково для оновлення джерела
    }, [currentTrack]);

    // 2. Керування відтворенням (Play/Pause)
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
    }, [isPlaying]);

    // 3. Обробка подій аудіо
    const onLoadedMetadata = (e) => {
        // Захист від NaN (якщо трек короткий або не вантажиться)
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

    if (!currentTrack) return null;

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: '90px',
            background: '#181818', borderTop: '1px solid #333',
            display: 'flex', alignItems: 'center', padding: '0 20px', 
            color: 'white', zIndex: 9999, boxSizing: 'border-box'
        }}>
            <audio 
                ref={audioRef}
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => dispatch(setIsPlaying(false))}
            />

            {/* Кнопка керування */}
            <button 
                onClick={() => dispatch(setIsPlaying(!isPlaying))}
                style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                    background: '#fff', cursor: 'pointer', marginRight: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {isPlaying ? '⏸️' : '▶️'}
            </button>

            {/* Таймлайн та інформація */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa' }}>
                    <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                    <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                </div>
                <input 
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: '100%', accentColor: '#1db954', cursor: 'pointer' }}
                />
            </div>

            <div style={{ marginLeft: '20px', width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currentTrack.name}</div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{currentTrack.author}</div>
            </div>
        </div>
    );
};

export default AudioPlayer;