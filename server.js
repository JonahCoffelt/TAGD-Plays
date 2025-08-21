const express = require('express');
const app = express();
const robot = require('robotjs');
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let nextTeam = "A"; 
const sessionId = Date.now().toString(); // new session ID each restart

// Default key mapping per team
let keyMappings = {
    A: {
        up: 'q',
        down: 'w',
        left: 'e',
        right: 'r',
        a: 't',
        b: 'y',
        x: 'u',
        y: 'i'
    },
    B: {
        up: 'a',
        down: 's',
        left: 'd',
        right: 'f',
        a: 'g',
        b: 'h',
        x: 'j',
        y: 'k'
    }
};

app.get('/assign-team', (req, res) => {
    const assignedTeam = nextTeam;
    nextTeam = (nextTeam === "A") ? "B" : "A";
    res.json({ team: assignedTeam, sessionId });
});

app.post('/button-press', (req, res) => {
    const { button, team } = req.body;
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Team ${team}: Button "${button}" pressed.`);
  
    robot.keyTap(keyMappings[team][button]);

    res.status(200).send('Button press received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access controller at http://localhost:${port}`);
});


// --- Admin API ---
app.get('/admin-mapping', (req, res) => {
    res.json(keyMappings);
});

app.post('/admin-mapping', (req, res) => {
    const newMapping = req.body;
    if (newMapping.A && newMapping.B) {
        keyMappings = newMapping;
        console.log("🔧 Key mappings updated:", keyMappings);
        res.json({ success: true, mappings: keyMappings });
    } else {
        res.status(400).json({ success: false, error: "Invalid mapping format" });
    }
});