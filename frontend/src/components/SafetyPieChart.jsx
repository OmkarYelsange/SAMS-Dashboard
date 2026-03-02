import "../chartConfig";
import { Pie } from "react-chartjs-2";

export default function SafetyPieChart({ data }) {
  let safe = 0;
  let warning = 0;
  let danger = 0;

  data.forEach((d) => {
    if (d.temp > 35 || d.magnitude > 15) danger++;
    else if (d.temp > 30 || d.magnitude > 12) warning++;
    else safe++;
  });

  return (
    <Pie
      key={`pie-${data.length}`}
      data={{
        labels: ["Safe", "Warning", "Danger"],
        datasets: [
          {
            data: [safe, warning, danger],
            backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
          },
        ],
      }}
      options={{
        animation: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#9ca3af" } },
        },
      }}
    />
  );
}
