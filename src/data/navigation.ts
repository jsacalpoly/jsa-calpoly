// Shared by the header and footer. `gap` is the space before the link in the header (px),
// measured from the Figma nav because the Wix menu spacing is not uniform.
// A link with `children` opens a small menu when hovered in the header, and lists them under it in the phone menu.
export interface NavLink {
  name: string;
  href: string;
  gap: number;
  children?: { name: string; href: string }[];
}

export const navLinks: NavLink[] = [
  { name: "About", href: "/board", gap: 0 },
  {
    name: "Board",
    href: "/26-27",
    gap: 29.55,
    children: [
      { name: "26-27", href: "/26-27" },
      { name: "Previous eras", href: "/eras" },
    ],
  },
  { name: "Photos", href: "/photos", gap: 29.25 },
  { name: "Calendar", href: "/calendar", gap: 29.25 },
];
