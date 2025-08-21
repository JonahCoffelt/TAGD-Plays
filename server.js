const express = require('express');
const app = express();
const robot = require('robotjs');
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/controller-action', (req, res) => {
    const { button, action } = req.body;
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Controller input received: Button "${button}", Action: "${action}"`);

    const keyMap = {
        'up': 'up',
        'down': 'down',
        'left': 'left',
        'right': 'right',
        'a': 'space',
        'b': 'enter',
        'x': 'x',
        'y': 'y',
    };

    const key = keyMap[button];

    if (key) {
        if (action === 'down') {
            robot.keyToggle(key, 'down');
        } else if (action === 'up') {
            robot.keyToggle(key, 'up');
        } else if (action === 'tap') {
            robot.keyTap(key);
        } else {
            console.log(`Invalid action for button "${button}": "${action}"`);
        }
    } else {
        console.log("No keyboard action mapped for this button.");
    }

    res.status(200).send('Button action received!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Access the controller at http://localhost:${port}`);
    console.log("Keyboard control enabled. Use your phone as a remote controller.");
});

//   xxxxxx