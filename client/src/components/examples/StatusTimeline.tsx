import { StatusTimeline } from "../StatusTimeline";

export default function StatusTimelineExample() {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h3 className="text-sm font-medium mb-4">Current Status: Interview</h3>
        <StatusTimeline currentStatus="Interview" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Rejected Application</h3>
        <StatusTimeline currentStatus="Reviewed" isRejected={true} />
      </div>
    </div>
  );
}
