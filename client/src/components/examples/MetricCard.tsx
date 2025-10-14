import { MetricCard } from "../MetricCard";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Applications"
        value={24}
        icon={FileText}
        trend={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="In Progress"
        value={8}
        icon={Clock}
        description="Awaiting updates"
      />
      <MetricCard
        title="Successful"
        value={3}
        icon={CheckCircle}
        trend={{ value: 50, isPositive: true }}
      />
      <MetricCard
        title="Rejected"
        value={2}
        icon={XCircle}
        trend={{ value: 20, isPositive: false }}
      />
    </div>
  );
}
