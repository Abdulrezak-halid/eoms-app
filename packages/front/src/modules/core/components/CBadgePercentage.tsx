import { CBadge } from "@m/core/components/CBadge";

export function CBadgePercentage({
  value,
  description,
  inline,
}: {
  value: number;
  description?: string;
  inline?: boolean;
}) {
  return (
    <CBadge
      className="font-mono"
      description={description}
      value={`${value.toFixed(1)}%`}
      inline={inline}
      noTruncate
    />
  );
}
