import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import ReactDOM from "react-dom/client";
import { CssBaseline } from '@mui/material';
import {Provider} from 'react-redux'
import { store } from './store.js';

import "./i18next.js"

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
    
        <CssBaseline />
        <App />
    </Provider>
);

