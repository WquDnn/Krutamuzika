const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// статичні файли
app.use("/uploads", express.static("uploads"));

// MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, "uploads/images");
        } else {
            cb(null, "uploads/audio");
        }
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

// POST MUSIC
app.post(
    "/music",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "audio", maxCount: 1 },
    ]),
    (req, res) => {
        const { name, author, genre } = req.body;

        const image =
            req.files?.image?.[0]?.filename || null;
        const audio =
            req.files?.audio?.[0]?.filename || null;

        if (!name || !author || !genre || !image || !audio) {
            return res
                .status(400)
                .json({ success: false, message: "empty fields" });
        }

        db.query(
            `INSERT INTO musicinfo (genre, author, name, file_url, image)
             VALUES (?, ?, ?, ?, ?)`,
            [genre, author, name, audio, image],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message,
                    });
                }

                res.json({
                    success: true,
                    id: result.insertId,
                });
            }
        );
    }
);

app.listen(3000, () =>
    console.log("Server running on port 3000")
);