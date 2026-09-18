import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";

export default function ItemDetails() {
  const { id } = useParams();
  const { items, requests, createRepairRequest } = useApp();
  const navigate = useNavigate();

  const item = items.find((i) => i.id === id);
  const relatedRequest = requests.find((r) => r.itemId === id);

  if (!item) {
    return (
      <div className="section container">
        <div className="empty-state">
          <h3>Item not found</h3>
          <Link to="/my-items"><Button variant="secondary">Back to my items</Button></Link>
        </div>
      </div>
    );
  }

  function handleRequestRepair() {
    const req = createRepairRequest({ itemId: item.id });
    if (req) navigate(`/repair-requests/${req.id}`);
  }

  return (
    <div className="section container" style={{ maxWidth: 900 }}>
      <div className="hero-grid" style={{ gap: 40, marginBottom: 40 }}>
        <Photo src={item.image} gradientClass={item.photoClass} alt={item.name} />
        <div>
          <StatusBadge status={item.status} />
          <h1 style={{ marginTop: 12 }}>{item.name}</h1>
          <p style={{ color: "var(--bark-soft)" }}>{item.category}</p>
          <p>{item.description}</p>
          {relatedRequest ? (
            <Button as={Link} to={`/repair-requests/${relatedRequest.id}`} variant="primary">View repair request</Button>
          ) : (
            <Button onClick={handleRequestRepair} variant="primary">Create repair request</Button>
          )}
        </div>
      </div>
    </div>
  );
}