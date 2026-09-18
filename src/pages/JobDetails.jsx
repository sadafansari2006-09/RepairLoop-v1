import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function JobDetails() {
  const { id } = useParams();
  const { requests, updateJobStatus } = useApp();
  const job = requests.find((r) => r.id === id);

  if (!job) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Job not found</h3>
          <Link to="/repairer/jobs"><Button variant="secondary">Back to my jobs</Button></Link>
        </div>
      </div>
    );
  }

  const chosenEstimate = job.estimates.find((e) => e.id && job.chosenRepairerId === e.repairerId);

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <div style={{ marginBottom: 8 }}><StatusBadge status={job.status} /></div>
          <h1>{job.itemName}</h1>
          <p>{job.category} · Since {job.createdAt}</p>
        </div>
      </div>

      <div className="hero-grid" style={{ gap: 40, marginBottom: 40, gridTemplateColumns: "0.8fr 1.2fr" }}>
        <Photo src={job.image} gradientClass={job.photoClass} alt={job.itemName} />
        <div>
          <h3>The problem</h3>
          <p>{job.description}</p>
          {chosenEstimate && (
            <>
              <h4 style={{ marginTop: 20 }}>Your estimate</h4>
              <p>₹{chosenEstimate.price.toLocaleString("en-IN")} · {chosenEstimate.days} day turnaround</p>
            </>
          )}
        </div>
      </div>

      <h2>Update status</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
        <Button
          variant="secondary"
          disabled={job.status !== "in_progress"}
          onClick={() => updateJobStatus(job.id, "in_progress", "Parts ordered, repair underway")}
        >
          Mark in progress
        </Button>
        <Button
          variant="sage"
          disabled={job.status === "completed"}
          onClick={() => updateJobStatus(job.id, "completed", "Repair completed — ready for pickup")}
        >
          Mark completed
        </Button>
      </div>

      <h2>Timeline</h2>
      <div className="timeline">
        {job.timeline.map((step, i) => (
          <div className={`timeline-step ${step.state}`} key={i}>
            <h4>{step.label}</h4>
            {step.date && <div className="ts-date">{step.date}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}