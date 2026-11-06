
import psutil
import platform
from datetime import datetime


# 1. System Monitoring
def get_system_metrics():

    cpu_usage = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")

    return {
        "cpu": cpu_usage,
        "ram": memory.percent,
        "ram_total": round(memory.total / (1024 ** 3), 2),
        "disk": disk.percent,
        "disk_total": round(disk.total / (1024 ** 3), 2),
        "system": platform.system(),
        "processor": platform.processor(),
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


# 2. Running Processes Monitoring
def get_running_processes():

    processes = []

    for process in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent"]
    ):
        try:
            info = process.info

            processes.append({
                "pid": info["pid"],
                "name": info["name"],
                "cpu": round(info["cpu_percent"] or 0, 2),
                "memory": round(info["memory_percent"] or 0, 2)
            })

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    processes.sort(
        key=lambda process: process["memory"],
        reverse=True
    )

    return processes[:10]


# 3. Network Monitoring
def get_network_metrics():

    network = psutil.net_io_counters()

    return {
        "bytes_sent": round(network.bytes_sent / (1024 ** 2), 2),
        "bytes_received": round(network.bytes_recv / (1024 ** 2), 2),
        "packets_sent": network.packets_sent,
        "packets_received": network.packets_recv
    }


# 4. Network Speed Monitoring
previous_network = psutil.net_io_counters()
previous_time = datetime.now()


def get_network_speed():

    global previous_network, previous_time

    current_network = psutil.net_io_counters()
    current_time = datetime.now()

    time_difference = (current_time - previous_time).total_seconds()

    if time_difference <= 0:
        time_difference = 1

    upload_speed = (
        current_network.bytes_sent - previous_network.bytes_sent
    ) / (1024 ** 2) / time_difference

    download_speed = (
        current_network.bytes_recv - previous_network.bytes_recv
    ) / (1024 ** 2) / time_difference

    previous_network = current_network
    previous_time = current_time

    return {
        "upload_speed": round(max(upload_speed, 0), 4),
        "download_speed": round(max(download_speed, 0), 4)
    }
