const express = require('express');
const app = express();
const robot = require('robotjs');
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let nextTeam = "A"; 
const sessionId = Date.now().toString(); // new session ID each restart

app.get('/assign-team', (req, res) => {
    const assignedTeam = nextTeam;
    nextTeam = (nextTeam === "A") ? "B" : "A";
    res.json({ team: assignedTeam, sessionId });
});

app.post('/button-press', (req, res) => {
    const { button, team } = req.body;
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Team ${team}: Button "${button}" pressed.`);

    const keyMap = {
        'A': {
            'up': 'q',
            'down': 'w',
            'left': 'e',
            'right': 'r',
            'a': 't',
            'b': 'y',
            'x': 'u',
            'y': 'i',
        },
        'B': {
            'up': 'a',
            'down': 's',
            'left': 'd',
            'right': 'f',
            'a': 'g',
            'b': 'h',
            'x': 'j',
            'y': 'k',
        }
        
    };

    const keyMapTeamB = {
        'up': 'a',
        'down': 's',
        'left': 'd',
        'right': 'f',
        'a': 'g',
        'b': 'h',
        'x': 'j',
        'y': 'k',
    };

  
    robot.keyTap(keyMap[team][button]);

    res.status(200).send('Button press received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access controller at http://localhost:${port}`);
});
