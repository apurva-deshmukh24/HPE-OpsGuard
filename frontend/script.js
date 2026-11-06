
// ======================================
// 1. SYSTEM DASHBOARD & HEALTH MONITORING
// ======================================

async function updateDashboard() {
    try {
        const response = await fetch("/api/metrics");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        document.getElementById("cpu").textContent = data.cpu + "%";
        document.getElementById("ram").textContent = data.ram + "%";
        document.getElementById("disk").textContent = data.disk + "%";

        document.getElementById("cpu-bar").style.width = data.cpu + "%";
        document.getElementById("ram-bar").style.width = data.ram + "%";
        document.getElementById("disk-bar").style.width = data.disk + "%";

        document.getElementById("system").textContent =
            data.system + " | " + data.processor;

        const metrics = {
            CPU: data.cpu,
            RAM: data.ram,
            Disk: data.disk
        };

        const alerts = [];

        if (data.cpu >= 90) {
            alerts.push("CRITICAL CPU USAGE: " + data.cpu + "%");
        } else if (data.cpu >= 80) {
            alerts.push("HIGH CPU USAGE: " + data.cpu + "%");
        }

        if (data.ram >= 90) {
            alerts.push("CRITICAL MEMORY USAGE: " + data.ram + "%");
        } else if (data.ram >= 80) {
            alerts.push("HIGH MEMORY USAGE: " + data.ram + "%");
        }

        if (data.disk >= 95) {
            alerts.push("CRITICAL DISK USAGE: " + data.disk + "%");
        } else if (data.disk >= 90) {
            alerts.push("LOW DISK SPACE: " + data.disk + "% used");
        }

        const health = document.getElementById("health");
        const alert = document.getElementById("alert");

        const highest = Math.max(...Object.values(metrics));

        health.className = "";

        if (highest >= 90) {
            health.textContent = "CRITICAL";
            health.classList.add("critical");
        } else if (highest >= 75) {
            health.textContent = "WARNING";
            health.classList.add("warning");
        } else {
            health.textContent = "HEALTHY";
            health.classList.add("healthy");
        }

        alert.textContent = alerts.length > 0
            ? "⚠ " + alerts.join(" | ")
            : "✓ All system resources are operating normally.";

        document.getElementById("updated").textContent =
            "Last updated: " + data.time;

    } catch (error) {
        document.getElementById("health").textContent = "Connection Error";
        document.getElementById("alert").textContent =
            "Unable to retrieve system metrics.";

        console.error("Dashboard error:", error);
    }
}

updateDashboard();
setInterval(updateDashboard, 3000);


// ======================================
// 2. RUNNING PROCESSES & PROCESS ALERTS
// ======================================

async function updateProcesses() {
    const processList = document.getElementById("process-list");

    try {
        const response = await fetch("/api/processes");

        if (!response.ok) {
            throw new Error("Could not fetch processes");
        }

        const processes = await response.json();

        processList.replaceChildren();

        processes.forEach(process => {
            const row = document.createElement("tr");

            const values = [
                process.name,
                process.pid,
                process.cpu + "%",
                process.memory + "%"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            // Detect high resource usage
            if (process.cpu >= 50 || process.memory >= 20) {
                row.style.background = "rgba(239, 68, 68, 0.12)";
                row.style.color = "#f87171";
                row.title = "High resource usage detected";
            }

            processList.appendChild(row);
        });

    } catch (error) {
        processList.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "Unable to load processes.";

        row.appendChild(cell);
        processList.appendChild(row);

        console.error("Process monitoring error:", error);
    }
}

updateProcesses();
setInterval(updateProcesses, 5000);


// ======================================
// 3. LIVE SYSTEM PERFORMANCE CHART
// ======================================

const chartContext = document
    .getElementById("performanceChart")
    .getContext("2d");

const performanceChart = new Chart(chartContext, {
    type: "line",

    data: {
        labels: [],

        datasets: [
            {
                label: "CPU Usage",
                data: [],
                borderColor: "#42a5f5",
                backgroundColor: "rgba(66, 165, 245, 0.1)",
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#ffffff",
                pointBorderWidth: 0
            },
            {
                label: "RAM Usage",
                data: [],
                borderColor: "#42d392",
                backgroundColor: "rgba(66, 211, 146, 0.1)",
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#ffffff",
                pointBorderWidth: 0
            },
            {
                label: "Disk Usage",
                data: [],
                borderColor: "#ffb74d",
                backgroundColor: "rgba(255, 183, 77, 0.1)",
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#ffffff",
                pointBorderWidth: 0
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { color: "#aab7c4" },
                grid: { color: "#35445a" }
            },

            x: {
                ticks: { color: "#aab7c4" },
                grid: { color: "#35445a" }
            }
        },

        plugins: {
            legend: {
                labels: { color: "white" }
            }
        }
    }
});


async function updatePerformanceChart() {
    try {
        const response = await fetch("/api/metrics");

        if (!response.ok) {
            throw new Error("Metrics API failed");
        }

        const data = await response.json();

        performanceChart.data.labels.push(
            new Date().toLocaleTimeString()
        );

        performanceChart.data.datasets[0].data.push(data.cpu);
        performanceChart.data.datasets[1].data.push(data.ram);
        performanceChart.data.datasets[2].data.push(data.disk);

        if (performanceChart.data.labels.length > 15) {
            performanceChart.data.labels.shift();

            performanceChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        performanceChart.update();

    } catch (error) {
        console.error("Performance chart error:", error);
    }
}

updatePerformanceChart();
setInterval(updatePerformanceChart, 3000);


// ======================================
// 4. NETWORK ACTIVITY MONITORING
// ======================================

async function updateNetwork() {
    try {
        const response = await fetch("/api/network");

        if (!response.ok) {
            throw new Error("Network API failed");
        }

        const data = await response.json();

        document.getElementById("received").textContent =
            data.bytes_received + " MB";

        document.getElementById("sent").textContent =
            data.bytes_sent + " MB";

        document.getElementById("packets-received").textContent =
            data.packets_received.toLocaleString();

        document.getElementById("packets-sent").textContent =
            data.packets_sent.toLocaleString();

    } catch (error) {
        console.error("Network monitoring error:", error);
    }
}

updateNetwork();
setInterval(updateNetwork, 3000);


// ======================================
// 5. LIVE NETWORK SPEED
// ======================================

async function updateNetworkSpeed() {
    try {
        const response = await fetch("/api/network-speed");

        if (!response.ok) {
            throw new Error("Network speed API failed");
        }

        const data = await response.json();

        document.getElementById("download-speed").textContent =
            data.download_speed.toFixed(4) + " MB/s";

        document.getElementById("upload-speed").textContent =
            data.upload_speed.toFixed(4) + " MB/s";

    } catch (error) {
        console.error("Network speed monitoring error:", error);
    }
}

updateNetworkSpeed();
setInterval(updateNetworkSpeed, 3000);


// ======================================
// 6. LIVE NETWORK SPEED CHART
// ======================================

const networkContext = document
    .getElementById("networkChart")
    .getContext("2d");

const networkChart = new Chart(networkContext, {
    type: "line",

    data: {
        labels: [],

        datasets: [
            {
                label: "Download Speed (MB/s)",
                data: [],
                borderColor: "#42a5f5",
                backgroundColor: "rgba(66, 165, 245, 0.1)",
                tension: 0.4,
                pointRadius: 3
            },
            {
                label: "Upload Speed (MB/s)",
                data: [],
                borderColor: "#42d392",
                backgroundColor: "rgba(66, 211, 146, 0.1)",
                tension: 0.4,
                pointRadius: 3
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: "#aab7c4" },
                grid: { color: "#35445a" }
            },

            x: {
                ticks: { color: "#aab7c4" },
                grid: { color: "#35445a" }
            }
        },

        plugins: {
            legend: {
                labels: { color: "white" }
            }
        }
    }
});


async function updateNetworkChart() {
    try {
        const response = await fetch("/api/network-speed");

        if (!response.ok) {
            throw new Error("Network speed API failed");
        }

        const data = await response.json();

        networkChart.data.labels.push(
            new Date().toLocaleTimeString()
        );

        networkChart.data.datasets[0].data.push(
            data.download_speed
        );

        networkChart.data.datasets[1].data.push(
            data.upload_speed
        );

        if (networkChart.data.labels.length > 15) {
            networkChart.data.labels.shift();

            networkChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        networkChart.update();

    } catch (error) {
        console.error("Network chart error:", error);
    }
}

updateNetworkChart();
setInterval(updateNetworkChart, 3000);


// ======================================
// 7. INTERACTIVE SIDEBAR NAVIGATION
// ======================================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");
    });
});


// ======================================
// 8. SYSTEM UPTIME COUNTER
// ======================================

let uptimeSeconds = 0;

function updateUptime() {
    uptimeSeconds++;

    const hours = String(
        Math.floor(uptimeSeconds / 3600)
    ).padStart(2, "0");

    const minutes = String(
        Math.floor((uptimeSeconds % 3600) / 60)
    ).padStart(2, "0");

    const seconds = String(
        uptimeSeconds % 60
    ).padStart(2, "0");

    document.getElementById("uptime").textContent =
        `${hours}:${minutes}:${seconds}`;
}

setInterval(updateUptime, 1000);


// ======================================
// 9. REAL-TIME BACKEND CONNECTION STATUS
// ======================================

async function checkBackendConnection() {
    const statusText = document.getElementById("connection-text");
    const statusDot = document.getElementById("connection-dot");
    const statusBox = document.getElementById("connection-status");

    try {
        const response = await fetch("/api/metrics");

        if (!response.ok) {
            throw new Error("Backend unavailable");
        }

        statusText.textContent = "System Online";

        statusDot.style.background = "#22c55e";
        statusDot.style.boxShadow = "0 0 8px #22c55e";

        statusBox.style.background = "rgba(34, 197, 94, 0.12)";
        statusBox.style.color = "#22c55e";

    } catch (error) {
        statusText.textContent = "Backend Offline";

        statusDot.style.background = "#ef4444";
        statusDot.style.boxShadow = "0 0 8px #ef4444";

        statusBox.style.background = "rgba(239, 68, 68, 0.12)";
        statusBox.style.color = "#ef4444";
    }
}

checkBackendConnection();
setInterval(checkBackendConnection, 5000);
