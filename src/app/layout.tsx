// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import SolanaWalletProviders from "@/components/SolanaWalletProviders";
import TopNav from "@/components/TopNav";

// Global CSS (ok se esiste; altrimenti crea il file o rimuovi la riga)
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "TORTELLINI",
  description: "TORT presale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SolanaWalletProviders>
          <div className="min-h-screen flex flex-col">
            <TopNav />
            <main className="container mx-auto max-w-5xl px-4 py-6 flex-1">
              {children}
            </main>
          </div>
        </SolanaWalletProviders>
      </body>
    </html>
  );
}
