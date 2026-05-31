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

        if (file) {
            setImage(file);
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
        formData.append("file", audio);

        try {
            const response = await fetch(
                "http://localhost:3000/music",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Трек успішно додано!");

                setForm({
                    name: "",
                    author: "",
                    genre: "",
                });

                setImage(null);
                setAudio(null);
                setPreview("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #111827 60%, #052e16 100%)",
                display: "flex",
                alignItems: "center",
                py: 5,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 6,
                        bgcolor: "#1e293b",
                        border:
                            "1px solid rgba(34,197,94,.15)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight={700}
                        color="#f8fafc"
                        gutterBottom
                    >
                        🎵 Нова пісня
                    </Typography>

                    <Typography
                        align="center"
                        sx={{
                            color: "#94a3b8",
                            mb: 4,
                        }}
                    >
                        Додайте трек до своєї медіатеки
                    </Typography>

                    <Stack
                        spacing={3}
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        {preview && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={preview}
                                    alt="cover"
                                    sx={{
                                        width: 220,
                                        height: 220,
                                        objectFit:
                                            "cover",
                                        borderRadius: 4,
                                        border:
                                            "3px solid rgba(34,197,94,.2)",
                                        boxShadow:
                                            "0 20px 40px rgba(34,197,94,.15)",
                                    }}
                                />
                            </Box>
                        )}

                        <TextField
                            label="Назва пісні"
                            fullWidth
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Автор"
                            fullWidth
                            value={form.author}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    author:
                                        e.target.value,
                                })
                            }
                            sx={fieldStyles}
                        />

                        <TextField
                            label="Жанр"
                            fullWidth
                            value={form.genre}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    genre:
                                        e.target.value,
                                })
                            }
                            sx={fieldStyles}
                        />

                        <Button
                            component="label"
                            startIcon={
                                <CloudUploadIcon />
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                bgcolor:
                                    "rgba(34,197,94,.12)",
                                color: "#86efac",
                                border:
                                    "1px solid rgba(34,197,94,.2)",
                                "&:hover": {
                                    bgcolor:
                                        "rgba(34,197,94,.2)",
                                },
                            }}
                        >
                            Завантажити обкладинку

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />
                        </Button>

                        <Button
                            component="label"
                            startIcon={
                                <MusicNoteIcon />
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                bgcolor:
                                    "rgba(134,239,172,.08)",
                                color: "#d1fae5",
                                border:
                                    "1px solid rgba(134,239,172,.15)",
                                "&:hover": {
                                    bgcolor:
                                        "rgba(134,239,172,.15)",
                                },
                            }}
                        >
                            Завантажити MP3

                            <input
                                hidden
                                type="file"
                                accept="audio/*"
                                onChange={(e) =>
                                    setAudio(
                                        e.target
                                            .files[0]
                                    )
                                }
                            />
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                py: 1.7,
                                borderRadius: 3,
                                fontSize: "1rem",
                                fontWeight: 700,
                                bgcolor: "#22c55e",
                                boxShadow:
                                    "0 10px 25px rgba(34,197,94,.25)",

                                "&:hover": {
                                    bgcolor:
                                        "#16a34a",
                                },
                            }}
                        >
                            Додати пісню
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );

}

const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        color: "#f8fafc",
        borderRadius: 3,
        "& fieldset": {
            borderColor:
                "rgba(134,239,172,.15)",
        },

        "&:hover fieldset": {
            borderColor: "#86efac",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#22c55e",
        },
    },

    "& .MuiInputLabel-root": {
        color: "#94a3b8",
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "#86efac",
    },

};
