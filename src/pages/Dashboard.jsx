import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ItemCard from "../components/ItemCard";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function Dashboard() {
  const { user, items, requests } = useApp();

  const activeRepairs = requests.filter((r) => r.status === "in_progress" || r.status === "estimating");
  const completed = requests.filter((r) => r.status === "completed");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Welcome back, {user.name.split(" ")[0]}</h1>
          <p>Here's what's happening with your items.</p>
        </div>
        <Button as={Link} to="/create-item" variant="primary">Report broken item</Button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">{items.length}</div>
          <div className="label">Items added</div>
        </div>
        <div className="stat-card">
          <div className="num">{activeRepairs.length}</div>
          <div className="label">Active repairs</div>
        </div>
        <div className="stat-card">
          <div className="num">{completed.length}</div>
          <div className="label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="num">{requests.reduce((sum, r) => sum + r.estimates.length, 0)}</div>
          <div className="label">Estimates received</div>
        </div>
      </div>

      <div className="section-head" style={{ marginBottom: 24 }}>
        <h2>Your items</h2>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No items yet</h3>
          <p>Add your first broken item to start receiving repair estimates.</p>
          <Button as={Link} to="/create-item" variant="primary">Report broken item</Button>
        </div>
      ) : (
        <div className="card-grid">
          {items.slice(0, 3).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="section-head" style={{ margin: "48px 0 24px" }}>
        <h2>Recent repair requests</h2>
      </div>
      <div className="row-list">
        {requests.slice(0, 4).map((req) => (
          <Link key={req.id} to={`/repair-requests/${req.id}`} className="row-card">
            <div className="row-card-main">
              <Photo src={req.image} gradientClass={req.photoClass} alt={req.itemName} className="row-thumb" />
              <div>
                <div className="row-title">{req.itemName}</div>
                <div className="row-sub">{req.estimates.length} estimate{req.estimates.length === 1 ? "" : "s"} · Submitted {req.createdAt}</div>
              </div>
            </div>
            <div className="row-side">
              <StatusBadge status={req.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}