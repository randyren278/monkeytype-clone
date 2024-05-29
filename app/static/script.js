const userInput = document.getElementById('user-input');
const result = document.getElementById('result');
const wpmDisplay = document.getElementById('wpm');
const restartBtn = document.getElementById('restart-btn');
const testText = document.getElementById('test-text');
const wpmChart = document.getElementById('wpmChart').getContext('2d');

let startTime;
let fullText = '';
let wpmData = [];
let chart;
let currentWordCount = 10; // Default to 10 words

const commonWords = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", 
    "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", 
    "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", 
    "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", 
    "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", 
    "time", "no", "just", "him", "know", "take", "person", "into", "year", 
    "your", "good", "some", "could", "them", "see", "other", "than", "then", 
    "now", "look", "only", "come", "its", "over", "think", "also", "back", 
    "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", 
    "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

function getRandomWords(wordCount) {
    const shuffled = commonWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, wordCount).join(' ');
}

function startTest(wordCount) {
    currentWordCount = wordCount;
    fullText = getRandomWords(wordCount);
    testText.innerText = fullText;
    restartTest();
    if (chart) {
        chart.destroy();
    }
}

userInput.addEventListener('focus', () => {
    if (!startTime) {
        startTime = new Date();
        setInterval(recordWPM, 500);
    }
});

userInput.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
    }
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;

    const typedText = userInput.value;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = (wordsTyped / elapsedTime) * 60;

    updateTextColor(typedText, fullText);

    if (typedText === fullText) {
        result.innerText = `Congratulations! Your WPM is ${Math.round(wpm)}.`;
        userInput.disabled = true;
        wpmDisplay.innerText = Math.round(wpm);
        displayChart();
    }
});

function restartTest() {
    fullText = getRandomWords(currentWordCount); // Re-randomize the text
    testText.innerText = fullText;
    userInput.value = '';
    userInput.disabled = false;
    result.innerText = '';
    wpmDisplay.innerText = '';
    startTime = null;
    wpmData = [];
    userInput.focus();
    updateTextColor('', fullText);
}

function recordWPM() {
    if (startTime) {
        const currentTime = new Date();
        const elapsedTime = (currentTime - startTime) / 1000;
        const typedText = userInput.value;
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const wpm = (wordsTyped / elapsedTime) * 60;
        wpmData.push(Math.round(wpm));
    }
}

function updateTextColor(typedText, fullText) {
    let html = '';
    for (let i = 0; i < fullText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === fullText[i]) {
                html += `<span class="blue">${fullText[i]}</span>`;
            } else {
                html += `<span class="red">${fullText[i]}</span>`;
            }
        } else if (i === typedText.length) {
            html += `<span class="black">${fullText[i]}</span>`;
        } else {
            html += `<span class="black">${fullText[i]}</span>`;
        }
    }
    testText.innerHTML = html;
}

function displayChart() {
    const labels = wpmData.map((_, index) => ` ${index + 1}`);
    chart = new Chart(wpmChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'WPM Over Time',
                data: wpmData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time Intervals'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Words Per Minute (WPM)'
                    }
                }
            }
        }
    });
}

// Initialize the text with 10 words
startTest(10);
