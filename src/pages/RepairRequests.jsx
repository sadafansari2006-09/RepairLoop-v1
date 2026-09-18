import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import Photo from "../components/Photo";

export default function RepairRequests() {
  const { requests } = useApp();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Repair requests</h1>
          <p>Track every estimate and repair in progress.</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No repair requests yet</h3>
          <p>Once you report a broken item, its request will show up here.</p>
        </div>
      ) : (
        <div className="row-list">
          {requests.map((req) => (
            <Link key={req.id} to={`/repair-requests/${req.id}`} className="row-card">
              <div className="row-card-main">
                <Photo src={req.image} gradientClass={req.photoClass} alt={req.itemName} className="row-thumb" />
                <div>
                  <div className="row-title">{req.itemName}</div>
                  <div className="row-sub">{req.category} · Submitted {req.createdAt}</div>
                </div>
              </div>
              <div className="row-side">
                <span className="row-sub">{req.estimates.length} estimate{req.estimates.length === 1 ? "" : "s"}</span>
                <StatusBadge status={req.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}