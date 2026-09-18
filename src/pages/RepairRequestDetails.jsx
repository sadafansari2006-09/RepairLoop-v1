import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function RepairRequestDetails() {
  const { id } = useParams();
  const { requests, chooseRepairer } = useApp();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Request not found</h3>
          <Link to="/repair-requests"><Button variant="secondary">Back to requests</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section container" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <div style={{ marginBottom: 8 }}><StatusBadge status={request.status} /></div>
          <h1>{request.itemName}</h1>
          <p>{request.category} · Submitted {request.createdAt}</p>
        </div>
      </div>

      <div className="hero-grid" style={{ gap: 40, marginBottom: 48, gridTemplateColumns: "0.8fr 1.2fr" }}>
        <Photo src={request.image} gradientClass={request.photoClass} alt={request.itemName} />
        <div>
          <h3>The problem</h3>
          <p>{request.description}</p>
        </div>
      </div>

      <h2>Estimates</h2>
      {request.estimates.length === 0 ? (
        <div className="empty-state" style={{ marginBottom: 40 }}>
          <h3>Waiting on estimates</h3>
          <p>Repairers nearby have been notified and will respond soon.</p>
        </div>
      ) : (
        <div style={{ marginBottom: 48 }}>
          {request.estimates.map((est) => (
            <div key={est.id} className={`estimate-card${request.chosenRepairerId === est.repairerId ? " chosen" : ""}`}>
              <div>
                <div className="row-title">{est.repairerName}</div>
                <div className="row-sub">{est.days} day turnaround</div>
                <p style={{ margin: "8px 0 0", maxWidth: "50ch" }}>{est.message}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="estimate-price">₹{est.price.toLocaleString("en-IN")}</div>
                {request.chosenRepairerId === est.repairerId ? (
                  <span className="badge badge-in_progress" style={{ marginTop: 8 }}>Chosen</span>
                ) : request.status === "estimating" ? (
                  <Button size="sm" variant="primary" onClick={() => chooseRepairer(request.id, est.id)} style={{ marginTop: 10 }}>
                    Choose this repairer
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Progress</h2>
      <div className="timeline">
        {request.timeline.map((step, i) => (
          <div className={`timeline-step ${step.state}`} key={i}>
            <h4>{step.label}</h4>
            {step.date && <div className="ts-date">{step.date}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}