import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function SensorChart({ label, values }) {
  const labels = values.map((v) => {
    if (!v?.time) return "";
    const parts = v.time.split(" ");
    return parts.length > 1 ? parts[1] : "";
  });

  const dataPoints = values.map((v) => v?.value ?? 0);

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label,
            data: dataPoints,
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34,211,238,0.15)",
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { bottom: 20 } },
        plugins: {
          legend: { labels: { color: "#ffffff" } },
        },
        scales: {
          x: {
            ticks: {
              color: "#e5e7eb",
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
            },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          y: {
            ticks: { color: "#e5e7eb" },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
        },
      }}
    />
  );
}
