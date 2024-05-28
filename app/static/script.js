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

const dictionary = [
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", 
    "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", 
    "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", 
    "watermelon", "xigua", "yellow", "zucchini"
];

function getRandomWords(wordCount) {
    const shuffled = dictionary.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, wordCount).join(' ');
}

function startTest(wordCount) {
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
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;

    const typedText = userInput.value;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const wpm = (wordsTyped / elapsedTime) * 60;
    wpmDisplay.innerText = Math.round(wpm);

    updateTextColor(typedText, fullText);

    if (typedText === fullText) {
        result.innerText = `Congratulations! Your WPM is ${Math.round(wpm)}.`;
        userInput.disabled = true;
        displayChart();
    }
});

function restartTest() {
    userInput.value = '';
    userInput.disabled = false;
    result.innerText = 'WPM: 0';
    wpmDisplay.innerText = '0';
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
                html += `<span style="color:blue;">${fullText[i]}</span>`;
            } else {
                html += `<span style="color:red;">${fullText[i]}</span>`;
            }
        } else if (i === typedText.length) {
            html += `<span style="color:black;">${fullText[i]}</span>`;
        } else {
            html += `<span style="color:black;">${fullText[i]}</span>`;
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
