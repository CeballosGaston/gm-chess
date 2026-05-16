"use client";

import { RevealPresentation } from "@/components/presentation/RevealPresentation";

export default function PresentationPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#060B18",
      }}
    >
      <RevealPresentation />
    </div>
  );
}
