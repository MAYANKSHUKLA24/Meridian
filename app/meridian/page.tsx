import type { Metadata } from "next";
import { MeridianExperience } from "@/components/meridian/MeridianExperience";

export const metadata: Metadata = {
  title: "Meridian — a 24 hour mixtape",
  description:
    "A playlist experience that moves with the sun: six moods across the day, each with its own genre, tempo, and visual world.",
};

export default function MeridianPage() {
  return <MeridianExperience />;
}
