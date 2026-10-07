import "./plate.css";

export function Plate({
  from,
  to,
  angle = 145,
  label,
  tone = "dark",
  style,
  className = "",
}: {
  from: string;
  to: string;
  angle?: number;
  label?: string;
  tone?: "dark" | "light";
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`plate ${className}`}
      style={
        {
          "--plate-from": from,
          "--plate-to": to,
          "--plate-angle": `${angle}deg`,
          ...style,
        } as React.CSSProperties
      }
    >
      <div className="plate__field" />
      <div className="plate__grain" />
      {label ? (
        <span className={`plate__label plate__label--${tone}`}>{label}</span>
      ) : null}
    </div>
  );
}
