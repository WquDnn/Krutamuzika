import React from 'react';
import Sidebar from './Sidebar'; // Твоя бібліотека ліворуч
import AudioPlayer from './AudioPlayer'; // Наш новий великий плеєр

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', background: '#000', overflow: 'hidden' }}>
            
            {/* Лівий блок (Твоя бібліотека) */}
            <div style={{ width: '300px', background: '#121212', padding: '20px' }}>
                {/* Тут твій код бібліотеки */}
                <h3>Твоя бібліотека</h3>
            </div>

            {/* Правий блок (Наш великий плеєр займе все інше місце) */}
            <AudioPlayer SERVER_URL="http://localhost:3000" />

        </div>
    );
};

export default MainLayout;