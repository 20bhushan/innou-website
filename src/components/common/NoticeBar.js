"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NoticeBar() {
   const pathname = usePathname();

  if (pathname === "/notice") {
    return null;
  }
  return (
    <div className="global-notice-bar">
      <div className="global-notice-inner">
        <div className="global-notice-content">
          <span className="global-notice-badge">Official Notice</span>
          <p className="global-notice-text">
            INNOU 1.0 has been rescheduled. The revised event dates and updated schedule have now been officially announced. Participants are requested to refer to the official notice for complete details.

          </p>
        </div>

        <Link href="/notice" className="global-notice-btn">
          Read Notice
        </Link>
      </div>
    </div>
  );
}
