let timerInterval;
let timeLeft = 60;
let typingStarted = false;
let typedWords = 0;
let startTime;
let resultsHistory = JSON.parse(localStorage.getItem('typingHistory')) || [];

const timeSelect = document.getElementById('timeSelect');
const timer = document.getElementById('timer');
const textToType = document.getElementById('textToType');
const inputBox = document.getElementById('inputBox');
const startTestButton = document.getElementById('startTest');
const resetTestButton = document.getElementById('resetTest');
const toggleDarkModeButton = document.getElementById('toggleDarkMode');
const viewHistoryButton = document.getElementById('viewHistory');
const resultsText = document.getElementById('results');
const historyContainer = document.getElementById('historyContainer');
const historyList = document.getElementById('historyList');

function startTest() {
  timeLeft = parseInt(timeSelect.value);
  timer.innerText = timeLeft;
  inputBox.disabled = false;
  inputBox.value = '';
  inputBox.focus();
  typingStarted = true;
  typedWords = 0;
  startTime = Date.now();
  resultsText.textContent = '';
  historyContainer.style.display = 'none';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timer.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

function endTest() {
  typingStarted = false;
  inputBox.disabled = true;
  const elapsedTime = (Date.now() - startTime) / 1000;
  const wordsPerMinute = (typedWords / elapsedTime) * 60;

  const result = {
    time: timeSelect.value,
    wpm: Math.round(wordsPerMinute),
    timestamp: new Date().toLocaleString(),
  };
  resultsHistory.push(result);
  localStorage.setItem('typingHistory', JSON.stringify(resultsHistory));

  resultsText.textContent = `You typed ${Math.round(wordsPerMinute)} WPM.`;
  
}

function showHistory() {
  historyList.innerHTML = '';
  resultsHistory.forEach((result, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Test time: ${result.time} seconds, Speed: ${result.wpm} WPM, Date: ${result.timestamp}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteHistoryItem(index));

    listItem.appendChild(deleteButton);
    historyList.appendChild(listItem);
  });
  historyContainer.style.display = 'block';
}

function deleteHistoryItem(index) {
  resultsHistory.splice(index, 1);
  localStorage.setItem('typingHistory', JSON.stringify(resultsHistory));
  showHistory();
}

function resetTest() {
  clearInterval(timerInterval);
  timer.innerText = timeSelect.value;
  inputBox.value = '';
  inputBox.disabled = true;
  resultsText.textContent = '';
  historyContainer.style.display = 'none';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

inputBox.addEventListener('input', () => {
  if (typingStarted) {
    const words = inputBox.value.trim().split(/\s+/).filter(word => word.length > 0);
    typedWords = words.length;
  }
});


viewHistoryButton.addEventListener('click', showHistory);
startTestButton.addEventListener('click', startTest);
resetTestButton.addEventListener('click', resetTest);
toggleDarkModeButton.addEventListener('click', toggleDarkMode);
