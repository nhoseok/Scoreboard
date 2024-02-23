const express = require("express")
const http = require("http")
const app = express();
const path = require("path")
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

// In-memory storage for participant scores
const participantScores = {};

// In-memory storage for default scores
const defaultParticipantScores = {}; // For default scores

const PORT = 5000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/judges', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'judges.html'));
});

app.get('/scoreboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'scoreboard.html'));
});

app.use(express.static(path.join(__dirname, "src")))

app.use(express.json());

// Event handler for the 'updateScore' event
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('updateScore', (data) => {
        const { participantName, judge1, judge2, judge3 } = data;

        if (!participantScores[participantName]) {
            // Participant doesn't exist, create a new entry with initial values
            participantScores[participantName] = {
                judge1: 0,
                judge2: 0,
                judge3: 0,
                totalScore: 0,
            };
        }

        // Update the scores for the specific judge
        if (judge1 !== undefined) {
            participantScores[participantName].judge1 = judge1;
        }
        if (judge2 !== undefined) {
            participantScores[participantName].judge2 = judge2;
        }
        if (judge3 !== undefined) {
            participantScores[participantName].judge3 = judge3;
        }

        // Calculate and update the total score
        const totalScore = participantScores[participantName].judge1 + participantScores[participantName].judge2 + participantScores[participantName].judge3;
        participantScores[participantName].totalScore = totalScore;

        // Send the updated highscore table to all connected clients
        io.emit('highscoreUpdated', getHighscoreTable());
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Helper function to get the highscore table as an array
function getHighscoreTable() {
    const highscoreTableArray = Object.keys(participantScores).map((participantName) => ({
        participantName,
        ...participantScores[participantName],
    }));

    // Sort the table by totalScore in descending order
    highscoreTableArray.sort((a, b) => b.totalScore - a.totalScore);

    return highscoreTableArray;
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
