import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDPwA_y2ZVycvIoek0bmrobve6BT1G-FZ0",
    authDomain: "l1project-681ca.firebaseapp.com",
    databaseURL: "https://l1project-681ca-default-rtdb.firebaseio.com",
    projectId: "l1project-681ca",
    storageBucket: "l1project-681ca.appspot.com",
    messagingSenderId: "43200809626",
    appId: "1:43200809626:web:65dc0ffabaf58a868eed23"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Load Chart.js dynamically
function loadChartJs() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Chart.js'));
        document.head.appendChild(script);
    });
}

// Function to fetch data from Firebase and initialize the chart
function GetAllDataRealtime() {
    const dbRef = ref(db, `runner`);
    onValue(dbRef, (snapshot) => {
        const data = [];
        snapshot.forEach(childSnapshot => {
            data.push(childSnapshot.val());
        });
        initChart(data);
    }, {
        onlyOnce: false
    });
}

// Function to convert timing string to seconds
function timingToSeconds(timing) {
    const [hours, minutes, seconds, milliseconds] = timing.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

// Function to initialize the chart
function initChart(data) {
    const labels = data.map(entry => entry.Date || " ");
    const timings = data.map(entry => entry.Timing ? timingToSeconds(entry.Timing) : null);

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Timing (in seconds)',
                    data: timings,
                    borderColor: 'rgba(30, 2, 249, 0.8)',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.1  // Add tension to create a smooth curve
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                }
            }
        }
    });
}

// Load Chart.js and then fetch data
window.onload = async () => {
    try {
        await loadChartJs();
        GetAllDataRealtime();
    } catch (error) {
        console.error(error);
    }
};
