import React, { useState } from "react";
import TrackList from "./TrackList";
import Header from "./Header";
import AudioPlayer from "./AudioPlayer"; // 🔥 Імпортуємо наш новий плеєр
import AddTrackModal from "./AddTrackModal";
import { Box, Button } from "@mui/material";

export default function App() {
    const [open, setOpen] = useState(false);
    const SERVER_URL = "http://localhost:3000"; // Винесли в константу, щоб не дублювати

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "white", pb: "90px", position: "relative" }}>
            {/* Хедер додатку */}
            <Header />
            
            {/* Головний контент (Сайдбар + основна частина) */}
            <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
                {/* Список треків з Redux */}
                <TrackList SERVER_URL={SERVER_URL} />

                {/* Основна робоча область (тут може бути Form або інший контент) */}
                <Box sx={{ flexGrow: 1, p: 4 }}>
                    {/* Твій контент по центру, якщо треба */}
                </Box>
            </Box>

            {/* Кнопка відкриття модалки фіксована справа внизу (піднята трохи вище плеєра) */}
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ 
                    bgcolor: "#22c55e", 
                    position: "fixed", 
                    bottom: "110px", // Підняли на 110px, щоб вона не перекривалася плеєром (який займає 90px)
                    right: "2rem",
                    zIndex: 10,
                    '&:hover': { bgcolor: '#16a34a' }
                }}
            >
                Додати трек
            </Button>

            {/* Модальне вікно для додавання треків */}
            <AddTrackModal 
                open={open} 
                handleClose={() => setOpen(false)} 
                SERVER_URL={SERVER_URL}
            />

            {/* 🔥 Нижній фіксований плеєр, який керується через Redux */}
            <AudioPlayer SERVER_URL={SERVER_URL} />
        </Box>
    );
}