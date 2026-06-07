import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import ReactDOM from "react-dom/client";
import { CssBaseline } from '@mui/material';

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <CssBaseline />
        <App />
    </>
);

createRoot(document.getElementById('root')).render(<App />)
