import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

interface ActivityItemProps {
  action: string;
  timestamp: string;
  updatedBy: "Bot Mimic" | "Admin" | string;
  comment?: string;
  isBot?: boolean;
}

export function ActivityItem({
  action,
  timestamp,
  updatedBy,
  comment,
  isBot,
}: ActivityItemProps) {
  return (
    <div className="flex gap-3" data-testid={`activity-${action.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex flex-col items-center">
        {isBot ? (
          <div className="h-8 w-8 rounded-full bg-status-bot flex items-center justify-center">
            <Bot className="h-4 w-4 text-status-bot-foreground" />
          </div>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {updatedBy.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm" data-testid="text-activity-action">{action}</span>
          {isBot && (
            <Badge variant="outline" className="bg-status-bot/10 text-status-bot border-status-bot/20">
              Automated
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1 font-mono" data-testid="text-activity-timestamp">
          {timestamp} • {updatedBy}
        </div>
        {comment && (
          <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md" data-testid="text-activity-comment">
            {comment}
          </p>
        )}
      </div>
    </div>
  );
}
