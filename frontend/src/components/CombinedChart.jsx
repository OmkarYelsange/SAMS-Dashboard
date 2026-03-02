import "../chartConfig";
import { Line } from "react-chartjs-2";

export default function CombinedChart({ temp, vib }) {
  return (
    <Line
      key="combined-chart"
      data={{
        labels: temp.map((t) => t.time?.split("T")[1]?.slice(0, 8) || ""),
        datasets: [
          {
            label: "Temperature",
            data: temp.map((t) => t.value),
            borderColor: "#f97316",
            tension: 0.2,
            pointRadius: 2,
          },
          {
            label: "Vibration",
            data: vib.map((v) => v.value),
            borderColor: "#22d3ee",
            tension: 0.2,
            pointRadius: 2,
          },
        ],
      }}
      options={{
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#fff" } },
        },
        scales: {
          x: { ticks: { color: "#ccc" } },
          y: { ticks: { color: "#ccc" } },
        },
      }}
    />
  );
}
