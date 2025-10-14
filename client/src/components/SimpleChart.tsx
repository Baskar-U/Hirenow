import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  title: string;
  data: DataPoint[];
  type?: "bar" | "donut";
}

export function SimpleChart({ title, data, type = "bar" }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (type === "donut") {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;

    return (
      <Card data-testid={`chart-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const dashArray = `${percentage} ${100 - percentage}`;
                  const dashOffset = -currentAngle;
                  currentAngle += percentage;

                  return (
                    <circle
                      key={index}
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="20%"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="space-y-2 flex-1">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="font-semibold text-sm" data-testid={`chart-value-${item.label.toLowerCase()}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid={`chart-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-semibold" data-testid={`chart-value-${item.label.toLowerCase()}`}>{item.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
