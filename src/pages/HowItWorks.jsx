import { Link } from "react-router-dom";
import Button from "../components/Button";

const steps = [
  { title: "Report the problem", body: "Add your broken item with a few photos and a description of what's wrong." },
  { title: "Receive repairers", body: "Nearby repairers who work on that kind of item are notified of your request." },
  { title: "Compare estimates", body: "See price, turnaround time, and notes from each repairer side by side." },
  { title: "Choose a repairer", body: "Pick the one that fits your budget and timeline — no obligation until you do." },
  { title: "Track the repair", body: "Follow progress from drop-off to done, right from your dashboard." },
  { title: "Give it another life", body: "Pick up your repaired item and put it back to work." },
];

export default function HowItWorks() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="hero-eyebrow">The process</div>
        <h1>From broken to back in use.</h1>
        <p style={{ fontSize: "1.05rem", color: "var(--bark-soft)", marginBottom: 48 }}>
          Six steps stand between a broken item and its next chapter.
        </p>

        <div className="steps-list">
          {steps.map((step, i) => (
            <div className="step-row" key={step.title}>
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <Button as={Link} to="/create-item" variant="primary">Report your first item</Button>
        </div>
      </div>
    </div>
  );
}