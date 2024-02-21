"use strict"

// main.js

const socket = io();


// Function to update the highscore table in the DOM
function updateHighscoreTable(highscoreTable) {
    const highscoreTableElement = document.getElementById('highscoreTable');

    // Clear the table, excluding the first row (header)
    highscoreTableElement.innerHTML = '';

    highscoreTable.forEach((entry, index) => {
        const row = highscoreTableElement.insertRow(); // No need for an index here
        const participantNameCell = row.insertCell(0);
        const totalScoreCell = row.insertCell(1);

        participantNameCell.innerText = entry.participantName;
        // judge1Cell.innerText = entry.judge1;
        // judge2Cell.innerText = entry.judge2;
        // judge3Cell.innerText = entry.judge3;
        totalScoreCell.innerText = entry.totalScore;

        // Apply the "fade-in" class to the row for animation
        row.classList.add('fade-in');
    });
}

// Add event listeners for each judge's score form
document.getElementById('scoreForm1').addEventListener('submit', (e) => {
    e.preventDefault();
    submitJudgeScore(1);
});

document.getElementById('scoreForm2').addEventListener('submit', (e) => {
    e.preventDefault();
    submitJudgeScore(2);
});

document.getElementById('scoreForm3').addEventListener('submit', (e) => {
    e.preventDefault();
    submitJudgeScore(3);
});

// Function to submit a judge's score
function submitJudgeScore(judgeNumber) {
    const selectedparticipant = document.querySelector('input[name="participantName"]:checked');
    
    if (!selectedparticipant) {
        alert('참가자가 선택되지 않았습니다 :(');
        return;
    }

    const participantName = selectedparticipant.value;
    const judgeScore = parseInt(document.getElementById('judge' + judgeNumber).value);

    // Send the participant name and score to the server
    socket.emit('updateScore', { participantName, ['judge' + judgeNumber]: judgeScore });
    
    // Clear the input field
    document.getElementById('judge' + judgeNumber).value = '';

    alert('제출되었습니다 :)')
}

// Handle real-time updates of the highscore table
socket.on('highscoreUpdated', (highscoreTable) => {
    console.log('Received updated highscore table:', highscoreTable);

    // Call the updateHighscoreTable function to update the DOM
    updateHighscoreTable(highscoreTable);
});