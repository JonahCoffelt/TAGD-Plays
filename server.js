const express = require('express');
const app = express();
const robot = require('robotjs'); // 🤖 Import the robotjs module
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/button-press', (req, res) => {
    const button = req.body.button;
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Controller input received: Button "${button}" was pressed.`);

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
    
    // Map your button inputs to specific keyboard keys
    robot.keyTap(keyMap[button]);

    res.status(200).send('Button press received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access the controller at http://localhost:${port}`);
    console.log("Keyboard control enabled. Press buttons on your phone to trigger key presses on the server computer.");
});
