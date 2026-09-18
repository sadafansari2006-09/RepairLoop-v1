import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>RepairLoop</h4>
            <p>Don't throw it away just yet. Give your broken things another life.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/how-it-works">How it works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/register">Become a repairer</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/register">Create account</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>hello@repairloop.com</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RepairLoop</span>
          <span>Made for things worth keeping</span>
        </div>
      </div>
    </footer>
  );
}