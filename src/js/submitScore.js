"use strict";

//submitScore.js
const socket = io();

// Function to submit a judge's score
function submitJudgeScore(judgeNumber) {
    const selectedparticipant = document.querySelector('input[name="participantName"]:checked');

    if (!selectedparticipant) {
        alert('참가자가 선택되지 않았습니다 :(');
        return;
    }

    const participantName = selectedparticipant.value;

    const selectedjudgeScore = document.querySelector('input[name="judge' + judgeNumber + 'Score"]:checked');

    const judgeScore = parseInt(selectedjudgeScore.value);

    // Send the participant name and score to the server
    socket.emit('updateScore', { participantName, ['judge' + judgeNumber]: judgeScore });

    alert('제출되었습니다 :)')
}