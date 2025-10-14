import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="Applied" />
        <StatusBadge status="Reviewed" />
        <StatusBadge status="Interview" />
        <StatusBadge status="Offer" />
        <StatusBadge status="Rejected" />
      </div>
    </div>
  );
}
