"use client";

import Link from "next/link";

export default function NoticeBar() {
  return (
    <div className="global-notice-bar">
      <div className="global-notice-inner">
        <div className="global-notice-content">
          <span className="global-notice-badge">Official Notice</span>
          <p className="global-notice-text">
            Due to the ongoing situation in the state, all scheduled events of
            INNOU 1.0 have been postponed. New dates will be announced soon.
          </p>
        </div>

        <Link href="/notice" className="global-notice-btn">
          Read Notice
        </Link>
      </div>
    </div>
  );
}
