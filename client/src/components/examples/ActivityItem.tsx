import { ActivityItem } from "../ActivityItem";

export default function ActivityItemExample() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="space-y-0">
        <ActivityItem
          action="Status changed to Interview"
          timestamp="Oct 14, 2025 10:30 AM"
          updatedBy="Bot Mimic"
          isBot={true}
          comment="Application automatically progressed after technical screening completion"
        />
        <ActivityItem
          action="Status changed to Reviewed"
          timestamp="Oct 13, 2025 2:15 PM"
          updatedBy="John Admin"
          isBot={false}
          comment="Initial screening completed. Moving to next stage."
        />
        <ActivityItem
          action="Application submitted"
          timestamp="Oct 10, 2025 9:00 AM"
          updatedBy="System"
          isBot={false}
        />
      </div>
    </div>
  );
}
