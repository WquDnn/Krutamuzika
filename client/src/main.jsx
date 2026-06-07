import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

createRoot(document.getElementById('root')).render(<App />)
