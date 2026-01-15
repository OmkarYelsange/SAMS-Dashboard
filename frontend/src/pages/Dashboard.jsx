import { useEffect, useState } from "react";
import axios from "axios";
import SensorChart from "../components/SensorChart";
import CombinedChart from "../components/CombinedChart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState(10);
  const [theme, setTheme] = useState("dark");
  const [historyRange, setHistoryRange] = useState("realtime");
  const [lastAlertTime, setLastAlertTime] = useState(0);

  const navigate = useNavigate();

  // Fetch data periodically
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [historyRange]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const fetchData = async () => {
    try {
      const url =
        historyRange === "realtime"
          ? "http://localhost:5000/data"
          : `http://localhost:5000/history?range=${historyRange}`;

      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  const filterByTimeframe = (sensorData) => sensorData.slice(-timeframe);

  const temperature =
    historyRange === "realtime"
      ? filterByTimeframe(data.filter((d) => d.sensor === "Temperature"))
      : data.filter((d) => d.sensor === "Temperature");

  const vibration =
    historyRange === "realtime"
      ? filterByTimeframe(data.filter((d) => d.sensor === "Vibration"))
      : data.filter((d) => d.sensor === "Vibration");

  const rms =
    historyRange === "realtime"
      ? filterByTimeframe(data.filter((d) => d.sensor === "Vibration_RMS"))
      : data.filter((d) => d.sensor === "Vibration_RMS");

  const latestTemp = temperature.at(-1)?.value || 0;
  const latestVibration = vibration.at(-1)?.value || 0;

  let status = "SAFE";
  let statusColor = "text-green-400";

  if (latestTemp > 30 || latestVibration > 12) {
    status = "WARNING";
    statusColor = "text-yellow-400";
  }

  if (latestTemp > 35 || latestVibration > 15) {
    status = "DANGER";
    statusColor = "text-red-500";
  }

  useEffect(() => {
    const now = Date.now();

    if (latestTemp > 35 || latestVibration > 15) {
      if (now - lastAlertTime > 60000) {
        // 1 minute cooldown
        setLastAlertTime(now);

        axios.post("http://localhost:5000/alert/email", {
          message: `CRITICAL ALERT!
Temperature: ${latestTemp}°C
Vibration: ${latestVibration}

Immediate action required.`,
        });

        toast.error("⚠️ CRITICAL CONDITION DETECTED");

        if (Notification.permission === "granted") {
          new Notification("SAMS ALERT", {
            body: "Machine in DANGER condition. Immediate action required.",
          });
        }
      }
    }
  }, [latestTemp, latestVibration]);

  useEffect(() => {
    if (status === "DANGER") {
      axios.post("http://localhost:5000/alert/telegram/send", {
        message:
          "🚨 SAMS ALERT: Machine is in DANGER condition. Immediate action required.",
      });
      const interval = setInterval(() => {
        if (Notification.permission === "granted") {
          new Notification("SAMS ALERT", {
            body: "Machine still in DANGER condition",
          });
        }
      }, 30000); // every 30 seconds

      return () => clearInterval(interval);
    }
  }, [status]);

  const exportCSV = () => {
    const rows = data.map((d) => `${d.time},${d.sensor},${d.value}`);
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_report.csv";
    link.click();
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">
          SAMS – Smart Abrasive Monitoring System
        </h1>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-auto px-4 py-2 bg-gray-800 hover:bg-cyan-600 rounded-lg"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            toast.success("Logged out");
            navigate("/login", { replace: true });
          }}
          className="ml-3 bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* TIMEFRAME SELECTOR */}
      <div className="flex gap-3 mb-4">
        {[5, 10, 30, 60, 300].map((sec) => (
          <button
            key={sec}
            onClick={() => setTimeframe(sec)}
            className="px-4 py-2 bg-gray-800 hover:bg-cyan-600 rounded-lg text-sm"
          >
            {sec < 60 ? `${sec}s` : `${sec / 60}m`}
          </button>
        ))}
      </div>

      {/* HISTORY SELECTOR */}
      <div className="flex gap-3 mb-6">
        {["realtime", "1d", "7d", "30d"].map((range) => (
          <button
            key={range}
            onClick={() => setHistoryRange(range)}
            className="px-4 py-2 bg-gray-800 hover:bg-cyan-600 rounded-lg text-sm"
          >
            {range === "realtime" ? "Live" : range.toUpperCase()}
          </button>
        ))}

        <button
          onClick={exportCSV}
          className="ml-auto bg-green-600 px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* SYSTEM STATUS */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-lg font-semibold">System Status</h2>
        <p className={`text-3xl font-bold mt-2 ${statusColor}`}>{status}</p>
      </div>

      {/* COMBINED SAFETY CHART */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl mb-8 h-[400px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Safety Overview</h2>
        <div className="flex-1">
          <CombinedChart temp={temperature} vib={vibration} />
        </div>
      </div>

      {/* INDIVIDUAL SENSOR CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl h-[320px]">
          <h2 className="text-lg font-semibold mb-4">Temperature (°C)</h2>
          <SensorChart label="Temperature" values={temperature} />
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl h-[320px]">
          <h2 className="text-lg font-semibold mb-4">Vibration</h2>
          <SensorChart label="Vibration" values={vibration} />
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl h-[320px]">
          <h2 className="text-lg font-semibold mb-4">Vibration RMS</h2>
          <SensorChart label="RMS" values={rms} />
        </div>
      </div>
    </div>
  );
}
