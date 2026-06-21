import React from 'react';

const Header = () => (
    <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: '#000',
        borderBottom: '1px solid #333',
        zIndex: 10
    }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <a href="/" style={{ textDecoration: 'none', color: 'white' }}>MyMusic</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="text" placeholder="Пошук..." style={{ padding: '6px 12px', borderRadius: '15px', border: '1px solid #444', background: '#222', color: 'white' }} />
            </div>
    </header>
);

export default Header;