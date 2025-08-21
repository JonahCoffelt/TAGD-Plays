const express = require('express');
const app = express();
const robot = require('robotjs');
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let nextTeam = "A"; // start with Team A

app.get('/assign-team', (req, res) => {
    const assignedTeam = nextTeam;
    // Alternate for next player
    nextTeam = (nextTeam === "A") ? "B" : "A";
    res.json({ team: assignedTeam });
});

app.post('/button-press', (req, res) => {
    const { button, team } = req.body;
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Team ${team}: Button "${button}" pressed.`);

    const keyMap = {
        'up': 'up',
        'down': 'down',
        'left': 'left',
        'right': 'right',
        'a': 'a',
        'b': 'b',
        'x': 'x',
        'y': 'y',
    };

    if (keyMap[button]) {
        robot.keyTap(keyMap[button]);
    }

    res.status(200).send('Button press received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access controller at http://localhost:${port}`);
});
