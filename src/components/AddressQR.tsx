// src/components/AddressQR.tsx
"use client";

import { useEffect, useRef } from "react";

// Usa la lib 'qrcode' (piccola e pure JS)
export default function AddressQR({ value, size = 160 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const QR = await import("qrcode"); // dynamic import
      if (mounted && ref.current) {
        await QR.toCanvas(ref.current, value || "", { width: size, margin: 1 });
      }
    })();
    return () => { mounted = false; };
  }, [value, size]);

  return <canvas ref={ref} style={{ width: size, height: size }} aria-label="QR code" />;
}
