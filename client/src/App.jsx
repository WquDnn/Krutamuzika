import { useEffect, useState } from "react";
import Form from "./Form"
import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MusicNoteIcon from "@mui/icons-material/MusicNote";


export default function App() {
    let [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        fetch("http://localhost:3000/")
            .then((res) => res.json())
            .then((data) => setIsConnected(!!data));
    }, []);
    return (
        <div>
            {isConnected ? (
                <h1>Server connected</h1>
            ) : (
                <h1>Server NOT connected</h1>
            )}
            <Form/>
        </div>

    );
}

