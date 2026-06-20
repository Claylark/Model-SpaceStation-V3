export default function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-rounded block select-none ${className}`}
      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
    >
      {name}
    </span>
  );
}