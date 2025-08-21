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

    // Map your button inputs to specific keyboard keys
    switch (button) {
        case 'up':
            robot.keyTap('up');
            break;
        case 'down':
            robot.keyTap('down');
            break;
        case 'left':
            robot.keyTap('left');
            break;
        case 'right':
            robot.keyTap('right');
            break;
        case 'a':
            robot.keyTap('a'); // Simulates pressing the space bar
            break;
        case 'b':
            robot.keyTap('b'); // Simulates pressing the enter key
            break;
        case 'x':
            robot.keyTap('x'); // Simulates pressing the 'x' key
            break;
        case 'y':
            robot.keyTap('y'); // Simulates pressing the 'y' key
            break;
        default:
            console.log("No keyboard action mapped for this button.");
            break;
    }

    res.status(200).send('Button press received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access the controller at http://localhost:${port}`);
    console.log("Keyboard control enabled. Press buttons on your phone to trigger key presses on the server computer.");
});
