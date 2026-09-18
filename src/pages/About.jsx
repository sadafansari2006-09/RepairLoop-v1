import Photo from "../components/Photo";
import { workshopImg } from "../data/mockData";

export default function About() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="hero-eyebrow">Our story</div>
        <h1>Built for things worth keeping.</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--bark-soft)" }}>
          RepairLoop started with a bicycle that a shop wanted to scrap and a repairer down the
          road who fixed it in an afternoon. We built this platform so that story could happen
          more often for laptops, cameras, furniture, and anything else that still has good
          years left in it.
        </p>
        <hr className="divider" style={{ margin: "40px 0" }} />
        <h2>What we believe</h2>
        <p>
          A broken item isn't waste, it's a repair waiting to happen. We connect people who have
          something broken with local repairers who know exactly how to bring it back
          transparently, fairly, and without the guesswork of finding someone trustworthy on
          your own.
        </p>
        <Photo src={workshopImg} gradientClass="photo-workshop" alt="Repair workshop" className="" />
      </div>
    </div>
  );
}