import React, { useEffect, useState } from "react";
import TrackList from "./TrackList";
import Form from "./Form"
import Header from "./Header"
import { Box, Button, Container } from "@mui/material";
import AddTrackModal from "./AddTrackModal";

export default function App() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Header />
            <Box sx={{ minHeight: "100vh", bgcolor: "#252525", display: "flex" }}>
                <TrackList SERVER_URL="http://localhost:3000" />
        <Box>

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ bgcolor: "#22c55e", position: "fixed", bottom: "2rem", right: "2rem" }}
                >
                    Додати трек
                </Button>
        </Box>

                {/* Підключаємо модальне вікно */}
                <AddTrackModal open={open} handleClose={() => setOpen(false)} SERVER_URL="http://localhost:3000"/>
            </Box></>
    );
}
