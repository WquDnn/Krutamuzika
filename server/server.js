const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*"
}));

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Головна сторінка
app.get("/", async (req, res) => {
    try {
        let [result, _] = await db.query("SHOW TABLES");
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Отримання списку треків
app.get("/tracks", async (req, res) => {
    try {
        // УВАГА: Якщо у твоїй базі колонкова ідентифікатора називається НЕ "id" (наприклад track_id),
        // обов'язково перевизнач її як 'id' через ALIAS (SELECT track_id AS id, ...), 
        // бо фронтенд шукає саме currentTrack.id!
        let [results] = await db.query("SELECT * FROM musicinfo");
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send("Помилка отримання треків");
    }
});

// Налаштування Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Додавання нового треку
app.post("/add", upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]), async (req, res) => {
    const imageFile = req.files && req.files.image ? req.files.image[0].filename : null;
    const audioFile = req.files && req.files.audio ? req.files.audio[0].filename : null;

    const musicData = {
        genre: req.body.genre,
        author: req.body.author,
        name: req.body.name,
        file_url: audioFile,
        image: imageFile
    };

    if (!musicData.genre || !musicData.author || !musicData.name || !musicData.file_url || !musicData.image) {
        return res.status(400).send({ status: "error", message: "Усі поля та файли обов'язкові" });
    }

    try {
        const [result] = await db.query("INSERT INTO musicinfo SET ?", musicData);
        res.status(201).send({ status: "ok", id: result.insertId });
    } catch (err) {
        console.error("Помилка бази даних:", err);
        res.status(500).send({ status: "error", message: "Помилка сервера при збереженні" });
    }
});

// ФУНКЦІЯ СТРІМІНГУ АУДІО
function getAudio(req, res) {
    const audioPath = path.resolve(__dirname, "static", req.filename);
    
    if (!fs.existsSync(audioPath)) {
        return res.status(404).send("Файл не знайдено на сервері");
    }

    const stat = fs.statSync(audioPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send("Запит за межами діапазону");
            return;
        }

        const chunksize = end - start + 1;
        const file = fs.createReadStream(audioPath, { start, end });
        
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Content-Length": chunksize,
            "Accept-Ranges": "bytes",
            "Content-Type": "audio/mpeg"
        };
        
        res.writeHead(206, head);
        
        // КРИТИЧНО: Якщо юзер перемкне трек або закриє вкладку, 
        // потік треба закрити, інакше сервер вилетить з помилкою "ERR_STREAM_WRITE_AFTER_END"
        req.on("close", () => {
            file.destroy();
        });

        file.pipe(res);
    } else {
        const head = {
            "Content-Type": "audio/mpeg",
            "Content-Length": fileSize,
        };
        res.writeHead(200, head);
        
        const file = fs.createReadStream(audioPath);
        req.on("close", () => {
            file.destroy();
        });
        
        file.pipe(res);
    }
}

// Ендпоінт стрімінгу
app.get("/tracks/:id/stream", async (req, res, next) => {
    const id = req.params.id;
    try {
        // ПЕРЕВІР ТУТ: Якщо в тебе в БД первинний ключ називається music_id, 
        // то пиши WHERE music_id = ?, а не id = ?
        const [result] = await db.query("SELECT file_url FROM musicinfo WHERE id = ?", [id]);
        
        if (result.length === 0) {
            return res.status(404).send("Track not found.");
        }
        
        req.filename = result[0].file_url;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}, getAudio);

app.listen(3000, () => console.log("Server started on port 3000"));