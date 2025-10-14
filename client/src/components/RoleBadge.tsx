import { Badge } from "@/components/ui/badge";
import { Code2, Users } from "lucide-react";

interface RoleBadgeProps {
  type: "Technical" | "Non-Technical";
  className?: string;
}

export function RoleBadge({ type, className }: RoleBadgeProps) {
  const isTechnical = type === "Technical";

  return (
    <Badge
      variant="outline"
      className={`${className || ""}`}
      data-testid={`badge-role-${type.toLowerCase().replace("-", "")}`}
    >
      {isTechnical ? (
        <Code2 className="h-3 w-3 mr-1" />
      ) : (
        <Users className="h-3 w-3 mr-1" />
      )}
      {type}
    </Badge>
  );
}
