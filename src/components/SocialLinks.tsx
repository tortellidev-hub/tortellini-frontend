"use client";

import { SiX, SiReddit } from "react-icons/si";

type Props = {
  className?: string;
};

export function SocialLinks({ className }: Props) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Follow us</h3>
      <div className="flex items-center gap-3">
        <a
          href="https://x.com/TortelliMaker"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
          aria-label="Follow on X"
        >
          <SiX className="h-4 w-4" />
          <span>X (Twitter)</span>
        </a>

        <a
          href="https://www.reddit.com/user/Tortelli-Maker/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
          aria-label="Follow on Reddit"
        >
          <SiReddit className="h-4 w-4" />
          <span>Reddit</span>
        </a>
      </div>
    </div>
  );
}
