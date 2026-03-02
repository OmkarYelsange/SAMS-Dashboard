import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import SensorChart from "../components/SensorChart";
import CombinedChart from "../components/CombinedChart";
import SafetyPieChart from "../components/SafetyPieChart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import alarmSound from "../assets/alarm.mp3";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [historyRange, setHistoryRange] = useState("5m");
  const [dangerBlink, setDangerBlink] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [loadingRange, setLoadingRange] = useState(null);

  const alertCooldown = 60000;

  const audioRef = useRef(new Audio(alarmSound));
  const alertTriggeredRef = useRef(false);

  const navigate = useNavigate();

  // SMART REFRESH SPEED BASED ON RANGE
  const getRefreshRate = (range) => {
    if (range === "5s" || range === "10s") return 1000;
    if (range === "30s" || range === "1m") return 3000;
    if (range === "5m" || range === "15m") return 5000;
    if (range === "30m" || range === "1h") return 8000;
    return 10000;
  };

  useEffect(() => {
    fetchData();

    const refreshRate = getRefreshRate(historyRange);

    const interval = setInterval(() => {
      fetchData();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [historyRange]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/data?range=${historyRange}`,
      );
      setData(res.data);
      setLoadingRange(null);
    } catch {
      toast.error("Data Fetch Failed");
    }
  };

  const latest = data.at(-1) || {};
  const latestTemp = latest.temp || 0;
  const latestVib = latest.magnitude || 0;

  let status = "SAFE";
  let statusColor = "text-green-400";

  if (latestTemp > 30 || latestVib > 12) {
    status = "WARNING";
    statusColor = "text-yellow-400";
  }

  if (latestTemp > 35 || latestVib > 15) {
    status = "DANGER";
    statusColor = "text-red-500";
  }

  // 🚨 ADVANCED ALERT ENGINE
  const prevStatusRef = useRef("SAFE");

  useEffect(() => {
    if (!data.length) return;

    const latest = data.at(-1);
    const temp = latest.temp || 0;
    const vib = latest.magnitude || 0;

    let newStatus = "SAFE";

    if (temp > 30 || vib > 12) newStatus = "WARNING";
    if (temp > 35 || vib > 15) newStatus = "DANGER";

    const now = Date.now();

    // Trigger only when entering DANGER from SAFE/WARNING
    const dangerEntered =
      newStatus === "DANGER" && prevStatusRef.current !== "DANGER";

    const cooldownPassed = now - lastAlertTime > alertCooldown;

    if (dangerEntered && cooldownPassed) {
      setLastAlertTime(now);

      // SOUND RESET
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});

      // BLINK UI
      setDangerBlink(true);
      setTimeout(() => setDangerBlink(false), 3000);

      // TOAST
      toast.error("🚨 CRITICAL MACHINE CONDITION");

      // EMAIL ALERT
      axios.post("http://localhost:5000/alert/email", {
        message: `CRITICAL ALERT!\nTemp: ${temp}\nVibration: ${vib}`,
      });

      // TELEGRAM ALERT
      axios.post("http://localhost:5000/alert/telegram/send", {
        message: `🚨 SAMS ALERT\nTemp: ${temp}\nVibration: ${vib}`,
      });

      // BROWSER ALERT
      if ("Notification" in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("SAMS ALERT", {
              body: `Temp: ${temp} | Vib: ${vib}`,
            });
          }
        });
      }
    }

    prevStatusRef.current = newStatus;
  }, [data]);

  // STABLE DATA WINDOW
  const filtered = useMemo(() => data.slice(-20), [data]);

  const temperature = useMemo(
    () => filtered.map((d) => ({ time: d.timestamp, value: d.temp })),
    [filtered],
  );

  const vibration = useMemo(
    () => filtered.map((d) => ({ time: d.timestamp, value: d.magnitude })),
    [filtered],
  );

  const rms = useMemo(
    () => filtered.map((d) => ({ time: d.timestamp, value: d.rms })),
    [filtered],
  );

  const exportCSV = () => {
    const rows = data.map(
      (d) =>
        `${d.timestamp},${d.temp},${d.vibX},${d.vibY},${d.vibZ},${d.magnitude},${d.rms}`,
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_report.csv";
    link.click();
  };

  return (
    <div
      className={`min-h-screen transition ${theme === "dark" ? "bg-slate-950 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            SAMS Monitoring Dashboard
          </h1>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${historyRange === "5s" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            ></span>
            <p className="text-sm">
              {historyRange === "5s" ? "Live Mode" : "Historical Mode"}
            </p>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto px-4 py-2 rounded-lg border"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }}
            className="bg-red-600 px-4 py-2 rounded-lg text-white"
          >
            Logout
          </button>
        </div>

        {/* TIME SELECTOR */}
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "4h",
            "1D",
            "7D",
            "30D",
          ].map((r) => (
            <button
              key={r}
              onClick={() => {
                setLoadingRange(r);
                setHistoryRange(r);
              }}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                historyRange === r
                  ? "bg-cyan-500 text-white scale-105"
                  : "bg-gray-800 hover:bg-cyan-600"
              }`}
            >
              {r}
            </button>
          ))}

          <button
            onClick={() => {
              setData((prev) => [
                ...prev,
                {
                  timestamp: new Date().toISOString(),
                  temp: 45,
                  magnitude: 20,
                  rms: 5,
                },
              ]);
            }}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Test Danger
          </button>

          <button
            onClick={exportCSV}
            className="ml-auto bg-green-600 px-4 py-2 rounded-lg"
          >
            Export CSV
          </button>
        </div>

        {loadingRange && (
          <p className="text-sm text-cyan-400 animate-pulse mb-4">
            Loading {loadingRange} data...
          </p>
        )}

        {/* STATUS */}
        <div
          className={`p-5 rounded-xl shadow-lg mb-6 ${
            dangerBlink ? "bg-red-700 animate-pulse" : "bg-slate-900"
          }`}
        >
          <h2 className="text-lg">System Status</h2>
          <p className={`text-3xl font-bold ${statusColor}`}>{status}</p>
        </div>

        {/* PIE + COMBINED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-900 p-5 rounded-xl shadow-lg h-[350px]">
            <SafetyPieChart data={data} />
          </div>

          <div className="bg-slate-900 p-5 rounded-xl shadow-lg h-[350px]">
            <CombinedChart temp={temperature} vib={vibration} />
          </div>
        </div>

        {/* SENSOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <SensorChart label="Temperature" values={temperature} />
          <SensorChart label="Vibration" values={vibration} />
          <SensorChart label="RMS" values={rms} />
        </div>
      </div>
    </div>
  );
}
