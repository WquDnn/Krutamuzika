import React, { useState } from "react";
import { Box, Button, Modal, Paper, Stack, TextField, Typography } from "@mui/material";

export default function AddTrackModal({ open, handleClose }) {
    const [form, setForm] = useState({ name: "", author: "", genre: "" });
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [preview, setPreview] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("author", form.author);
        formData.append("genre", form.genre);
        formData.append("image", image);
        formData.append("audio", audio);

        const res = await fetch("http://localhost:3000/add", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            alert("Трек додано!");
            handleClose(); // Закриваємо модалку після успіху
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400 }}>
                <Paper sx={{ p: 4, bgcolor: "#1e293b", color: 'white' }}>
                    <Typography variant="h6" mb={2}>Додати новий трек</Typography>
                    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                        <TextField label="Назва" fullWidth onChange={(e) => setForm({...form, name: e.target.value})} sx={inputStyle} />
                        <TextField label="Автор" fullWidth onChange={(e) => setForm({...form, author: e.target.value})} sx={inputStyle} />
                        <Button component="label" variant="outlined">📷 Обкладинка
                            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                        </Button>
                        <Button component="label" variant="outlined">🎧 Аудіо
                            <input hidden type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
                        </Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: "#22c55e" }}>Додати</Button>
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
}

const inputStyle = {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } }
};