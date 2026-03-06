const AVATAR_COLORS = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#EF4444",
  "#14B8A6",
];

export function avatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
