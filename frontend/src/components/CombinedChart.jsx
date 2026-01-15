import { Line } from "react-chartjs-2";

export default function CombinedChart({ temp, vib }) {
  return (
    <div className="h-full">
      <Line
        data={{
          labels: temp.map((t) => t.time?.split(" ")[1] || ""),
          datasets: [
            {
              label: "Temperature",
              data: temp.map((t) => t.value),
              borderColor: "#f97316",
              backgroundColor: "rgba(249,115,22,0.2)",
              tension: 0.4,
              pointRadius: 2,
            },
            {
              label: "Vibration",
              data: vib.map((v) => v.value),
              borderColor: "#22d3ee",
              backgroundColor: "rgba(34,211,238,0.2)",
              tension: 0.4,
              pointRadius: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#fff" },
            },
          },
          scales: {
            x: {
              ticks: { color: "#ccc" },
              grid: { color: "#222" },
            },
            y: {
              ticks: { color: "#ccc" },
              grid: { color: "#222" },
            },
          },
        }}
      />
    </div>
  );
}
