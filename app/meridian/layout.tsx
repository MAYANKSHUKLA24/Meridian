import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function MeridianLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${spaceGrotesk.variable} font-[family-name:var(--font-display)]`}>{children}</div>;
}
