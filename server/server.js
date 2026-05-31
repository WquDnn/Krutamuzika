const express = require("express");
const cors = require("cors")
const db = require("./db.js")
const multer = require('multer');
const path = require('path');


const app = express();
app.use(cors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*"
}))
app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", async (req, res)=>{
    try{
        let [result, _] = await db.query("SHOW TABLES")
        res.status(200).json(result)
    }catch(error){
        res.status(500).send(error.message)
        console.log(error)
    }
})

app.use('/uploads', express.static('uploads'));

app.get("/tracks", (req, res) => {
    db.query("SELECT * FROM musicinfo", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Помилка бази даних" });
        }
        res.send(results); // Відправляємо масив треків у React
    });
});

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post("/add", upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]), (req, res) => {
    // Перевіряємо, чи прийшли файли, щоб уникнути крашу
    const imageFile = req.files && req.files.image ? req.files.image[0].filename : null;
    const audioFile = req.files && req.files.audio ? req.files.audio[0].filename : null;

    // Збираємо дані чітко під структуру таблиці musicinfo
    const musicData = {
        genre: req.body.genre,
        author: req.body.author,
        name: req.body.name,
        file_url: audioFile,  
        image: imageFile      
    };

    // Валідація: якщо обов'язкові поля порожні, не пускаємо в базу
    if (!musicData.genre || !musicData.author || !musicData.name || !musicData.file_url || !musicData.image) {
        return res.status(400).send({ status: "error", message: "Усі поля та файли обов'язкові" });
    }

    // Робимо запит до бази даних
    db.query("INSERT INTO musicinfo SET ?", musicData, (err, result) => {
        if (err) {
            console.error("Помилка бази даних:", err);
            return res.status(500).send({ status: "error", message: "Помилка сервера при збереженні" });
        }
        
        // Обов'язково повертаємо відповідь клієнту всередині колбеку!
        res.status(201).send({ status: "ok", id: result.insertId });
    });
});

app.listen(3000, () => console.log("Server started on port 3000"));
