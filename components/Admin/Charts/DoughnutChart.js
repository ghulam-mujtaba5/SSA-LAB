import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const Doughnut = dynamic(
  () => import("react-chartjs-2").then((m) => m.Doughnut),
  { ssr: false }
);

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = data || { labels: [], datasets: [] };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "var(--text)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "var(--surface)",
        titleColor: "var(--text)",
        bodyColor: "var(--text)",
        borderColor: "var(--border)",
        borderWidth: 1,
      },
    },
    cutout: "60%",
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  if (!isMounted) return null;

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;