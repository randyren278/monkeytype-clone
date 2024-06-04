const mlUserInput = document.getElementById('ml-user-input');
const mlResult = document.getElementById('ml-result');
const mlWpmDisplay = document.getElementById('ml-wpm');
const mlTestText = document.getElementById('ml-test-text');
const mlWpmChart = document.getElementById('ml-wpmChart').getContext('2d');

let mlStartTime;
let mlFullText = '';
let mlWpmData = [];
let mlChart;
let mlCurrentWordCount = 100; // Default to 100 words
let mlWordTimings = []; // Array to store timings for each word

const mlCommonWords = [
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

function getMLRandomWords(wordCount) {
    const shuffled = mlCommonWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, wordCount).join(' ');
}

function startMLTest(wordCount) {
    mlCurrentWordCount = wordCount;
    mlFullText = getMLRandomWords(wordCount);
    mlTestText.innerText = mlFullText;
    restartMLTest();
    if (mlChart) {
        mlChart.destroy();
    }
}

mlUserInput.addEventListener('focus', () => {
    if (!mlStartTime) {
        mlStartTime = new Date();
        setInterval(recordMLWPM, 500);
    }
});

mlUserInput.addEventListener('input', () => {
    if (!mlStartTime) {
        mlStartTime = new Date();
    }
    const currentTime = new Date();
    const elapsedTime = (currentTime - mlStartTime) / 1000;

    const typedText = mlUserInput.value;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = (wordsTyped / elapsedTime) * 60;

    updateMLTextColor(typedText, mlFullText);

    if (typedText === mlFullText) {
        mlResult.innerText = `Congratulations! Your WPM is ${Math.round(wpm)}.`;
        mlUserInput.disabled = true;
        mlWpmDisplay.innerText = Math.round(wpm);
        displayMLChart();
        sendMLData();
    }
});

function restartMLTest() {
    mlFullText = getMLRandomWords(mlCurrentWordCount); // Re-randomize the text
    mlTestText.innerText = mlFullText;
    mlUserInput.value = '';
    mlUserInput.disabled = false;
    mlResult.innerText = '';
    mlWpmDisplay.innerText = '';
    mlStartTime = null;
    mlWpmData = [];
    mlWordTimings = [];
    mlUserInput.focus();
    updateMLTextColor('', mlFullText);
}

function recordMLWPM() {
    if (mlStartTime) {
        const currentTime = new Date();
        const elapsedTime = (currentTime - mlStartTime) / 1000;
        const typedText = mlUserInput.value;
        const wordsTyped = typedText.trim().split(/\s+/).length;
        const wpm = (wordsTyped / elapsedTime) * 60;
        mlWpmData.push(Math.round(wpm));
        // Record timing for each word
        const wordTimings = typedText.split(/\s+/).map(word => ({
            word,
            time: elapsedTime / wordsTyped
        }));
        mlWordTimings.push(...wordTimings);
    }
}

function updateMLTextColor(typedText, fullText) {
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
    mlTestText.innerHTML = html;
}

function displayMLChart() {
    const labels = mlWpmData.map((_, index) => ` ${index + 1}`);
    mlChart = new Chart(mlWpmChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'WPM Over Time',
                data: mlWpmData,
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

function sendMLData() {
    fetch('/train-model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mlWordTimings)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Initialize the text with 100 words
startMLTest(100);
