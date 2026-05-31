const express = require("express");
const cors = require("cors")
const db = require("./db.js")

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

app.listen(3000, () => console.log("Server started on port 3000"));
