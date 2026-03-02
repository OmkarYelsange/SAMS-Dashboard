import "../chartConfig";
import { Line } from "react-chartjs-2";

export default function SensorChart({ label, values }) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl shadow-lg h-[300px]">
      <h2 className="mb-2 font-semibold">{label}</h2>

      <Line
        key={label}
        data={{
          labels: values.map((v) => v?.time?.split("T")[1]?.slice(0, 8) || ""),
          datasets: [
            {
              label,
              data: values.map((v) => v.value),
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
            legend: { labels: { color: "#ffffff" } },
          },
          scales: {
            x: { ticks: { color: "#e5e7eb" } },
            y: { ticks: { color: "#e5e7eb" } },
          },
        }}
      />
    </div>
  );
}
