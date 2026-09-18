import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function RepairerDashboard() {
  const { repairer, requests } = useApp();

  const available = requests.filter((r) => r.status === "open" || (r.status === "estimating" && !r.chosenRepairerId));
  const myJobs = requests.filter((r) => r.chosenRepairerId === repairer.id);
  const active = myJobs.filter((r) => r.status === "in_progress");
  const completed = myJobs.filter((r) => r.status === "completed");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Welcome back, {repairer.name.split(" ")[0]}</h1>
          <p>{repairer.shopName} · {repairer.specialty}</p>
        </div>
        <Button as={Link} to="/repairer/requests" variant="primary">View available requests</Button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">{available.length}</div>
          <div className="label">Requests open</div>
        </div>
        <div className="stat-card">
          <div className="num">{active.length}</div>
          <div className="label">Jobs in progress</div>
        </div>
        <div className="stat-card">
          <div className="num">{completed.length}</div>
          <div className="label">Jobs completed</div>
        </div>
        <div className="stat-card">
          <div className="num">{repairer.rating}</div>
          <div className="label">Average rating</div>
        </div>
      </div>

      <div className="section-head" style={{ marginBottom: 24 }}>
        <h2>New requests near you</h2>
      </div>
      {available.length === 0 ? (
        <div className="empty-state">
          <h3>No open requests right now</h3>
          <p>New repair requests matching your specialty will show up here.</p>
        </div>
      ) : (
        <div className="row-list">
          {available.slice(0, 4).map((req) => (
            <Link key={req.id} to="/repairer/requests" className="row-card">
              <div className="row-card-main">
                <Photo src={req.image} gradientClass={req.photoClass} alt={req.itemName} className="row-thumb" />
                <div>
                  <div className="row-title">{req.itemName}</div>
                  <div className="row-sub">{req.category} · Submitted {req.createdAt}</div>
                </div>
              </div>
              <StatusBadge status={req.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}