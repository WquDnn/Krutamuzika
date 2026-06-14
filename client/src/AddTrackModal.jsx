import React, { useState } from "react";
import { Box, Button, Modal, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addTrack } from "./trackSlice";

// Передаємо SERVER_URL як проп (або читай його з конфігу/контексту)
export default function AddTrackModal({ open, handleClose, SERVER_URL }) {
    const dispatch = useDispatch();
    const { isSubmitting } = useSelector((state) => state.tracks);

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
        
        // Перевірка на заповненість файлів перед відправкою
        if (!image || !audio) {
            alert("Будь ласка, виберіть обкладинку та аудіофайл");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("author", form.author);
        formData.append("genre", form.genre);
        formData.append("image", image);
        formData.append("audio", audio);

        // Викликаємо Redux екшен
        dispatch(addTrack({ formData, SERVER_URL }))
            .unwrap() // Дозволяє обробити результат промісу прямо тут
            .then(() => {
                alert("Трек додано!");
                // Очищаємо локальний стейт форми
                setForm({ name: "", author: "", genre: "" });
                setImage(null);
                setAudio(null);
                setPreview("");
                handleClose(); // Закриваємо модалку
            })
            .catch((err) => {
                console.error("Failed to add track: ", err);
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400 }}>
                <Paper sx={{ p: 4, bgcolor: "#1e293b", color: 'white' }}>
                    <Typography variant="h6" mb={2}>Додати новий трек</Typography>
                    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                        <TextField required label="Назва" value={form.name} fullWidth onChange={(e) => setForm({...form, name: e.target.value})} sx={inputStyle} />
                        <TextField required label="Автор" value={form.author} fullWidth onChange={(e) => setForm({...form, author: e.target.value})} sx={inputStyle} />
                        <TextField required label="Жанр" value={form.genre} fullWidth onChange={(e) => setForm({...form, genre: e.target.value})} sx={inputStyle} />
                        
                        <Button component="label" variant="outlined" color={image ? "success" : "primary"}>
                            {image ? "📷 Обкладинку обрано" : "📷 Обкладинка"}
                            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                        </Button>
                        
                        {preview && (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img src={preview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                            </Box>
                        )}

                        <Button component="label" variant="outlined" color={audio ? "success" : "primary"}>
                            {audio ? "🎧 Аудіо обрано" : "🎧 Аудіо"}
                            <input hidden type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
                        </Button>

                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={isSubmitting}
                            sx={{ bgcolor: "#22c55e", '&:hover': { bgcolor: '#16a34a' } }}
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Додати"}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
}

const inputStyle = {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#334155" } },
    "& .MuiInputLabel-root": { color: "#94a3b8" }
};