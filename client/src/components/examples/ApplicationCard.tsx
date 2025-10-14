import { ApplicationCard } from "../ApplicationCard";

export default function ApplicationCardExample() {
  return (
    <div className="p-8 space-y-4 max-w-3xl">
      <ApplicationCard
        id="1"
        jobTitle="Senior Full Stack Developer"
        company="TechCorp Inc."
        status="Interview"
        roleType="Technical"
        appliedDate="Oct 10, 2025"
        lastUpdate="2 hours ago"
        onViewDetails={() => console.log("View details clicked")}
      />
      <ApplicationCard
        id="2"
        jobTitle="Marketing Manager"
        company="Growth Solutions"
        status="Reviewed"
        roleType="Non-Technical"
        appliedDate="Oct 8, 2025"
        lastUpdate="1 day ago"
        onViewDetails={() => console.log("View details clicked")}
      />
    </div>
  );
}
