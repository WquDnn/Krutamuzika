import React, { useState, useEffect } from 'react';

function TrackList() {
    // Стан для зберігання масиву треків
    const [tracks, setTracks] = useState([]);
    // Стан для відображення завантаження або помилок
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Базовий URL твого Node.js сервера
    const SERVER_URL = 'http://localhost:3000';

    useEffect(() => {
        // Функція для отримання даних з сервера
        fetch(`${SERVER_URL}/tracks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Не вдалося завантажити треки');
                }
                return response.json();
            })
            .then((data) => {
                setTracks(data); // Записуємо отримані треки в стейт
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ color: 'white' }}>Завантаження треків...</p>;
    if (error) return <p style={{ color: 'red' }}>Помилка: {error}</p>;

    return (
        <div style={{ padding: '20px', background: '#121212', color: 'white', minHeight: '100vh' }}>
            <h2>Музична Бібліотека</h2>
            
            {tracks.length === 0 ? (
                <p>Треків ще немає. Додай щось через форму!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tracks.map((track) => (
                        <div key={track.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#1e1e1e',
                            padding: '10px',
                            borderRadius: '8px',
                            gap: '15px'
                        }}>
                            {/* ОБКЛАДИНКА ТРЕКУ:
                              Прибираємо шлях "/uploads/". Оскільки сервер роздає статику з папки static,
                              файл доступний напряму за адресою сервера.
                            */}
                            <img 
                                src={`${SERVER_URL}/${track.image}`} 
                                alt={track.name} 
                                style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                            />
                            
                            {/* Інформація про трек */}
                            <div style={{ flexGrow: 1 }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>{track.name}</h3>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                                    {track.author} • <span style={{ fontStyle: 'italic' }}>{track.genre}</span>
                                </p>
                            </div>
                            
                            {/* ПЛЕЄР ДЛЯ СТРІМІНГУ АУДІО:
                              Замість прямого посилання на файл використовуємо наш новий ендпоінт,
                              який передає аудіо шматками за його унікальним ID.
                            */}
                            <audio controls src={`${SERVER_URL}/tracks/${track.id}/stream`}>
                                Ваш браузер не підтримує аудіо-елемент.
                            </audio>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TrackList;
