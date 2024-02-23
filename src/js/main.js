"use strict";

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

// Handle real-time updates of the highscore table
socket.on('highscoreUpdated', (highscoreTable) => {
    console.log('Received updated highscore table:', highscoreTable);

    // Call the updateHighscoreTable function to update the DOM
    updateHighscoreTable(highscoreTable);
});