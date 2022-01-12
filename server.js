//set up express, globals
const express = require("express");
const path = require("path");
//const db = require("./db/db.json");
const fs = require("fs");
const {v4 : uuidv4} = require("uuid");
const util = require("util");
const { json } = require("express/lib/response");
const PORT = 3001;
const app = express();

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

//Read file promise
const readFromFile = util.promisify(fs.readFile);

//Handles GET /notes route and responds with notes.html
app.get("/notes", (req, res) => {
    console.info(`${req.method} request received, responding with notes.html`);
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

//Handles GET /api/notes route and responds with db.json file
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received, responding with db.json`);
    //res.json(db);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//Handles POST /api/notes route, saves the request into the database and responds with the new database item
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received, updating db.json`);
    const {title, text} = req.body;
    console.info(`Received \nTitle: ${title}\nText: ${text}`);
    let id = uuidv4();
    console.info(`Creating unique id: ${id}`);
    const newNote = appendToFile(title, text, id);
    console.info("Append complete!");
    res.send(newNote);
});

//Handles GET wildcard, responds with index.html
app.get("*", (req, res) => {
    console.info(`${req.method} request received and handled at wildcard, responding with index.html`);
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//Listens on PORT, which is handled by the above
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});

//Helper function to read from the db, append to it, and write it back
function appendToFile(noteTitle, noteText, id) {
    const obj = {
        title: noteTitle,
        text: noteText,
        id: id
    };
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            console.err(`Error reading from ./db/db.json ${err}`);
        }
        const jsonData = JSON.parse(data);
        jsonData.push(obj);
        fs.writeFile("./db/db.json", JSON.stringify(jsonData), (err) => {
            if (err) {
                console.err(`Error writing to ./db/db.json ${err}`);
            }
        });
    });
    return obj;
}
