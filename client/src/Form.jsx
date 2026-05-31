import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function App() {
    const [form, setForm] = useState({
        name: "",
        author: "",
        genre: "",
    });

    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [preview, setPreview] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("author", form.author);
        formData.append("genre", form.genre);

        formData.append("image", image);
        formData.append("audio", audio); // 👈 ВАЖЛИВО

        const res = await fetch("http://localhost:3000/music", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);

        if (data.success) {
            alert("Трек додано!");

            setForm({ name: "", author: "", genre: "" });
            setImage(null);
            setAudio(null);
            setPreview("");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a", py: 5 }}>
            <Container maxWidth="sm">
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 5,
                        bgcolor: "#1e293b",
                        border: "1px solid rgba(34,197,94,.2)",
                    }}
                >
                    <Typography
                        variant="h4"
                        textAlign="center"
                        color="white"
                        fontWeight="bold"
                        mb={1}
                    >
                        🎵 Медіатека
                    </Typography>

                    <Typography
                        textAlign="center"
                        color="#94a3b8"
                        mb={3}
                    >
                        Додай новий трек
                    </Typography>

                    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
                        {preview && (
                            <Box
                                component="img"
                                src={preview}
                                sx={{
                                    width: 200,
                                    height: 200,
                                    objectFit: "cover",
                                    borderRadius: 3,
                                    mx: "auto",
                                    border: "2px solid #22c55e",
                                }}
                            />
                        )}

                        <TextField
                            label="Назва"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            sx={inputStyle}
                        />

                        <TextField
                            label="Автор"
                            value={form.author}
                            onChange={(e) =>
                                setForm({ ...form, author: e.target.value })
                            }
                            sx={inputStyle}
                        />

                        <TextField
                            label="Жанр"
                            value={form.genre}
                            onChange={(e) =>
                                setForm({ ...form, genre: e.target.value })
                            }
                            sx={inputStyle}
                        />

                        <Button component="label" variant="outlined">
                            📷 Обкладинка
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>

                        <Button component="label" variant="outlined">
                            🎧 Аудіо
                            <input
                                hidden
                                type="file"
                                accept="audio/*"
                                onChange={(e) =>
                                    setAudio(e.target.files[0])
                                }
                            />
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ bgcolor: "#22c55e" }}
                        >
                            Додати
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

const inputStyle = {
    input: { color: "white" },
    label: { color: "#94a3b8" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#334155" },
        "&:hover fieldset": { borderColor: "#22c55e" },
        "&.Mui-focused fieldset": { borderColor: "#22c55e" },
    },
};