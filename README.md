# HPE OpsGuard – Intelligent IT Infrastructure Monitoring

HPE OpsGuard is a Python-based system monitoring dashboard designed to monitor essential computer performance metrics in real time.

The application collects system information and displays it through a web-based dashboard, helping users understand their machine's health and resource utilization.

## 🚀 Features

- **CPU Monitoring:** Tracks current CPU usage.
- **RAM Monitoring:** Displays memory utilization and total RAM.
- **Disk Monitoring:** Tracks disk usage.
- **System Health Dashboard:** Displays system performance metrics.
- **Real-Time Updates:** Fetches updated system metrics through API requests.
- **Error Handling:** Handles unsuccessful API responses.

## 🛠️ Technologies Used

- Python
- Flask
- HTML5
- CSS3
- JavaScript
- psutil

## 📂 Project Structure

```text
HPE-OpsGuard/
│
├── app.py
├── monitor.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

*Note: Adjust the structure above if your actual filenames or folders differ.*

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/apurva-deshmukh24/HPE-OpsGuard.git
```

2. Navigate to the project folder:

```bash
cd HPE-OpsGuard
```

3. Create a virtual environment:

```bash
python -m venv venv
```

4. Activate the virtual environment (Windows):

```bash
venv\Scripts\activate
```

5. Install dependencies:

```bash
pip install -r requirements.txt
```

6. Run the application using the appropriate Python entry-point file.

## 🎯 Project Objective

The objective of HPE OpsGuard is to provide a simple and user-friendly interface for monitoring computer system performance and understanding infrastructure resource utilization.

## 👩‍💻 Developer

**Apurva Deshmukh**

GitHub: https://github.com/apurva-deshmukh24

---

*Built as a hands-on project to explore Python system monitoring, API integration, and frontend dashboard development.*
