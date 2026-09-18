import { Link } from "react-router-dom";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import Photo from "../components/Photo";
import { initialItems, heroImg } from "../data/mockData";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">A second life for the things you own</div>
            <h1>Don't throw it away just yet.</h1>
            <p className="hero-lede">
              Report what's broken, hear back from repairers nearby, compare their estimates,
              and get it fixed by someone who knows the craft instead of buying new.
            </p>
            <div className="hero-actions">
              <Button as={Link} to="/create-item" variant="primary">Report a broken item</Button>
              <Button as={Link} to="/how-it-works" variant="secondary">See how it works</Button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="num">3,400+</span>
                <span className="label">Items repaired</span>
              </div>
              <div className="hero-stat">
                <span className="num">620</span>
                <span className="label">Trusted repairers</span>
              </div>
              <div className="hero-stat">
                <span className="num">4.8</span>
                <span className="label">Average rating</span>
              </div>
            </div>
          </div>
          <Photo src={heroImg} gradientClass="photo-hero" alt="A repairer working on a broken item" />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Recently given another life</h2>
            <p>A few of the items owners chose to repair instead of replace.</p>
          </div>
          <div className="card-grid">
            {initialItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why repair instead of replace</h2>
            <p>Good craftsmanship outlasts the first thing that breaks.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <h3>Less waste</h3>
              <p>Every repaired item is one less thing sitting in landfill before its time.</p>
            </div>
            <div className="card">
              <h3>Real craft</h3>
              <p>Local repairers bring years of hands-on skill that a factory reset can't match.</p>
            </div>
            <div className="card">
              <h3>Fair pricing</h3>
              <p>Compare estimates side by side and choose the repairer who's right for the job.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}