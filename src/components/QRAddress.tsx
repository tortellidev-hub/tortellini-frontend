"use client";

import dynamic from "next/dynamic";

type Props = { address: string; size?: number };

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

export function QRAddress({ address, size = 128 }: Props) {
  if (!address) {
    return <div style={{ width: size, height: size }} className="rounded-md bg-muted" />;
  }
  return (
    <div className="p-2 rounded-md bg-white shadow-sm">
      <QRCode value={address} size={size} />
    </div>
  );
}
