import { Link } from "react-router-dom";
import "./Home.css";

import heroImg from "../assets/images/hero-repair.jpg";
import laptopImg from "../assets/images/laptop.jpg";
import bicycleImg from "../assets/images/bicycle.jpg";
import cameraImg from "../assets/images/camera.jpg";
import workshopImg from "../assets/images/repair-workshop.jpg";

const categories = [
  {
    title: "Electronics",
    text: "Laptops, phones, appliances and everyday electronics.",
    image: laptopImg,
    icon: "bi-laptop",
    slug: "electronics",
  },
  {
    title: "Bicycles",
    text: "Chains, brakes, tyres and general bicycle repairs.",
    image: bicycleImg,
    icon: "bi-bicycle",
    slug: "bicycles",
  },
  {
    title: "Cameras",
    text: "Film cameras, lenses and photography equipment.",
    image: cameraImg,
    icon: "bi-camera",
    slug: "cameras",
  },
];

const steps = [
  {
    title: "Describe",
    text: "Tell us what's broken and add a photo so repairers know what they're looking at.",
  },
  {
    title: "Compare",
    text: "Local repairers send their price and turnaround time. You pick the one you like.",
  },
  {
    title: "Repair",
    text: "Follow your repair from start to finish and get your item back working.",
  },
];

// Sample text: replace with real customer reviews when you have them.
const reviews = [
  {
    quote:
      "I got three quotes in a day for my old laptop. It cost a fraction of a new one.",
    name: "Aarav M.",
    item: "Laptop repair",
  },
  {
    quote:
      "My bicycle was ready in two days and I could see the progress the whole time.",
    name: "Neha S.",
    item: "Bicycle repair",
  },
  {
    quote:
      "I didn't think my camera could be saved. The repairer explained everything clearly.",
    name: "Rohan P.",
    item: "Camera repair",
  },
];

export default function Home() {
  return (
    <main className="rl-home">

      {/* ============ HERO ============ */}
      <section className="rl-hero">
        <img src={heroImg} alt="" />

        <div className="rl-wrap rl-hero-inner">
          <span className="rl-hero-tag">
            Repair it. Don't replace it.
          </span>

          <h1>Give broken things a second life.</h1>

          <p className="rl-hero-text">
            RepairLoop connects you with local repairers so you can fix the
            things you already own instead of replacing them.
          </p>

          <div className="rl-actions">
            <Link
              to="/create-item"
              className="rl-btn rl-btn-primary"
            >
              Start a repair
            </Link>

            <Link
              to="/how-it-works"
              className="rl-btn rl-btn-line"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>


      {/* ============ INTRO ============ */}
      <section className="rl-intro">
        <div className="rl-wrap rl-center">
          <span className="rl-eyebrow">
            Why RepairLoop?
          </span>

          <h2 className="rl-h2">
            What's broken doesn't have to become waste.
          </h2>

          <p className="rl-lead">
            A broken laptop, bicycle or camera can still have years left in it.
            RepairLoop makes it easier to find someone who can bring it back to
            life.
          </p>
        </div>
      </section>


      {/* ============ WHAT CAN BE REPAIRED ============ */}
      <section className="rl-section rl-tint">
        <div className="rl-wrap">

          <div className="rl-section-head rl-center">
            <span className="rl-eyebrow">
              What can be repaired?
            </span>

            <h2 className="rl-h2">
              Things worth keeping.
            </h2>

            <p className="rl-lead">
              From everyday electronics to bicycles and cameras, connect with
              someone who knows how to fix it.
            </p>
          </div>


          {/* CATEGORY CARDS */}
          <div className="rl-cat-grid">

            {categories.map((c) => (
              <Link
                to={`/repairs/${c.slug}`}
                className="rl-card"
                key={c.title}
              >
                <div className="rl-card-img">
                  <img
                    src={c.image}
                    alt={c.title}
                  />

                  <div className="rl-card-icon">
                    <i className={`bi ${c.icon}`} />
                  </div>
                </div>

                <div className="rl-card-body">
                  <h3>{c.title}</h3>

                  <p>{c.text}</p>

                  <span className="rl-more">
                    Explore repairs
                    <i className="bi bi-arrow-up-right" />
                  </span>
                </div>
              </Link>
            ))}

          </div>


          {/* FURNITURE — WIDE HORIZONTAL CARD */}
          <Link
            to="/repairs/furniture"
            className="rl-card rl-wide"
          >
            <div className="rl-card-img">
              <img
                src={workshopImg}
                alt="Furniture and woodwork repair"
              />

              <div className="rl-card-icon">
                <i className="bi bi-hammer" />
              </div>
            </div>

            <div className="rl-card-body">
              <h3>Furniture</h3>

              <p>
                Woodwork, fittings, restoration and repairs. Chairs, tables and
                cupboards can often be made good as new by the right pair of
                hands.
              </p>

              <span className="rl-more">
                Explore repairs
                <i className="bi bi-arrow-up-right" />
              </span>
            </div>
          </Link>

        </div>
      </section>


      {/* ============ HOW IT WORKS ============ */}
      <section className="rl-section">
        <div className="rl-wrap">

          <div className="rl-section-head rl-center">
            <span className="rl-eyebrow">
              Simple by design
            </span>

            <h2 className="rl-h2">
              Getting something repaired is easy.
            </h2>
          </div>


          <div className="rl-steps">

            {steps.map((s, i) => (
              <div
                className="rl-step"
                key={s.title}
              >
                <div className="rl-step-num">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3>{s.title}</h3>

                <p>{s.text}</p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ============ ABOUT ============ */}
      <section className="rl-about">

        <div className="rl-about-text">

          <span
            className="rl-eyebrow"
            style={{ marginBottom: 0 }}
          >
            About us
          </span>

          <h2 className="rl-h2">
            Repair is more than fixing something.
          </h2>

          <p className="rl-lead">
            It's about keeping useful things in circulation, supporting skilled
            local repairers and making it easier to choose repair before
            replacement.
          </p>

          <ul className="rl-about-list">
            <li>
              <i className="bi bi-recycle" />
              Keep useful things in use
            </li>

            <li>
              <i className="bi bi-person-check" />
              Connect with local repairers
            </li>

            <li>
              <i className="bi bi-search" />
              Compare before you choose
            </li>
          </ul>

          <Link
            to="/about"
            className="rl-btn rl-btn-primary"
          >
            Learn more
          </Link>

        </div>


        <div className="rl-about-img">
          <img
            src={workshopImg}
            alt="A repairer working in a workshop"
          />
        </div>

      </section>


      {/* ============ TESTIMONIALS ============ */}
      <section className="rl-section">
        <div className="rl-wrap">

          <div className="rl-section-head rl-center">
            <span className="rl-eyebrow">
              What people say
            </span>

            <h2 className="rl-h2">
              Repaired, and happy about it.
            </h2>
          </div>


          <div className="rl-quotes">

            {reviews.map((r) => (
              <figure
                className="rl-quote"
                key={r.name}
                style={{ margin: 0 }}
              >
                <i className="bi bi-quote" />

                <blockquote style={{ margin: 0 }}>
                  {r.quote}
                </blockquote>

                <figcaption className="rl-quote-who">
                  {r.name}
                  <span>{r.item}</span>
                </figcaption>
              </figure>
            ))}

          </div>

        </div>
      </section>


      {/* ============ FINAL CTA ============ */}
      <section className="rl-section">
        <div className="rl-wrap">

          <div className="rl-cta">

            <div className="rl-cta-img">
              <img
                src={cameraImg}
                alt="A camera ready to be repaired"
              />
            </div>

            <div className="rl-cta-body">

              <span className="rl-hero-tag">
                Something broken?
              </span>

              <h2 className="rl-h2">
                Let's give it another life.
              </h2>

              <p>
                Tell us what's broken, add a photo and get estimates from local
                repairers.
              </p>

              <div className="rl-actions">

                <Link
                  to="/create-item"
                  className="rl-btn rl-btn-primary"
                >
                  Start a repair
                </Link>

                <Link
                  to="/how-it-works"
                  className="rl-btn rl-btn-line"
                >
                  How it works
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}