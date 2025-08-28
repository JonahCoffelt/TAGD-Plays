const express = require('express');
const app = express();
const robot = require('robotjs');
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let nextTeam = "A"; 
const sessionId = Date.now().toString(); // new session ID each restart

// --- Settings ---
let gameSettings = {
    triggerProbability: 1.0,  // 50% chance
    holdDuration: 200         // milliseconds
};

let activePresses = {}; // track if a team/button is active

// Default key mapping per team
let keyMappings = {
    A: {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        a: 'space',
        b: 'shift',
        x: '1',
        y: '2'
    },
    B: {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
        a: 'o',
        b: 'p',
        x: '9',
        y: '0'
    },
};

app.get('/assign-team', (req, res) => {
    const assignedTeam = nextTeam;
    nextTeam = (nextTeam === "A") ? "B" : "A";
    res.json({ team: assignedTeam, sessionId });
});

app.post('/button-press', (req, res) => {
    const { button, team } = req.body;
    const timestamp = new Date().toLocaleString();

    if (Math.random() >= gameSettings.triggerProbability) {
        return res.status(200).send('Ignored (probability rule)');
    }

    console.log(`[${timestamp}] Team ${team}: Button "${button}" pressed.`);
  
    let key = keyMappings[team][button];

    // If already pressed and not released yet, ignore new input
    if (activePresses[`${team}-${button}`]) {
        return res.status(429).send('Ignored (already active)');
    }

    activePresses[`${team}-${button}`] = true;


     robot.keyToggle(key, "down");
    setTimeout(() => {
        robot.keyToggle(key, "up");
        activePresses[`${team}-${button}`] = false; // release lock
    }, gameSettings.holdDuration);


    res.send('Processed');
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

// --- Admin API ---
app.get('/admin-settings', (req, res) => {
    res.json(gameSettings);
});

app.post('/admin-settings', (req, res) => {
    const { triggerProbability, holdDuration } = req.body;
    if (typeof triggerProbability === "number" && typeof holdDuration === "number") {
        gameSettings.triggerProbability = triggerProbability;
        gameSettings.holdDuration = holdDuration;
        console.log("⚙️ Game settings updated:", gameSettings);
        res.json({ success: true, settings: gameSettings });
    } else {
        res.status(400).json({ success: false, error: "Invalid settings format" });
    }
});