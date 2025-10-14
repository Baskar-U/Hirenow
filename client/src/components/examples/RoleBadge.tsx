import { RoleBadge } from "../RoleBadge";

export default function RoleBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2">
        <RoleBadge type="Technical" />
        <RoleBadge type="Non-Technical" />
      </div>
    </div>
  );
}
