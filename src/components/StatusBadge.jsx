const STATUS_MAP = {
  active: { label: "Actif", bg: "#ECFDF5", color: "#059669" },
  late: { label: "En retard", bg: "#FEF2F2", color: "#DC2626" },
  paid: { label: "Soldé", bg: "#EFF6FF", color: "#2563EB" },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.active;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 99,
      }}
    >
      {s.label}
    </span>
  );
}
