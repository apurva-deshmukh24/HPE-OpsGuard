
from flask import Flask, jsonify, send_from_directory

from monitor import (
    get_system_metrics,
    get_running_processes,
    get_network_metrics,
    get_network_speed
)

import os

# Project folder paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Initialize Flask
app = Flask(__name__)


# Homepage
@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


# Serve CSS and JavaScript files
@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


# API: System metrics
@app.route("/api/metrics")
def metrics():
    data = get_system_metrics()
    return jsonify(data)


# API: Running processes
@app.route("/api/processes")
def processes():
    data = get_running_processes()
    return jsonify(data)


# API: Network metrics
@app.route("/api/network")
def network():
    data = get_network_metrics()
    return jsonify(data)


# API: Network speed
@app.route("/api/network-speed")
def network_speed():
    data = get_network_speed()
    return jsonify(data)


# Run application
if __name__ == "__main__":
    app.run(debug=True)
