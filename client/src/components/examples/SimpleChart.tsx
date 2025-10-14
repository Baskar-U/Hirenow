import { SimpleChart } from "../SimpleChart";

export default function SimpleChartExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <SimpleChart
        title="Applications by Status"
        type="bar"
        data={[
          { label: "Applied", value: 5, color: "hsl(var(--status-applied))" },
          { label: "Reviewed", value: 8, color: "hsl(var(--status-in-progress))" },
          { label: "Interview", value: 3, color: "hsl(var(--status-interview))" },
          { label: "Offer", value: 2, color: "hsl(var(--status-success))" },
        ]}
      />
      <SimpleChart
        title="Applications by Type"
        type="donut"
        data={[
          { label: "Technical", value: 12, color: "hsl(var(--chart-1))" },
          { label: "Non-Technical", value: 6, color: "hsl(var(--chart-3))" },
        ]}
      />
    </div>
  );
}
