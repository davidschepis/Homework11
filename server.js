//set up express, globals
const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");
const PORT = 3001;
const app = express();

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
    console.info(`${req.method} request received, responding with notes.html`);
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received, responding with db.json`);
    let data = JSON.parse(fs.readFileSync("./db/db.json"));
    res.send(data);
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received, updating db.json`);
    const {noteTitle, noteText} = req.body;
    console.info(`Received \nTitle: ${noteTitle}\nNoteText: ${noteText}`);
    res.send("response");
});

app.get("*", (req, res) => {
    console.info(`${req.method} request received and handled at wildcard, responding with index.html`);
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
