import React from "react";

function Footer() {
  return (
    <footer className="hidden md:flex justify-center-safe p-5 bg-[var(--bg-primary)] gap-6 text-[var(--text-secondary)]">
      <p>&#169; Since 2026 Financo </p>

      <a href="#" className="footer-link">
        PRIVACY POLICY
      </a>
      <a href="#" className="footer-link">
        TERMS OF SERVICES
      </a>
      <a href="#" className="footer-link">
        HELP CENTER
      </a>
    </footer>
  );
}

export default Footer;
