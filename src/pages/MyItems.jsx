import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ItemCard from "../components/ItemCard";
import Button from "../components/Button";

export default function MyItems() {
  const { items } = useApp();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My items</h1>
          <p>Everything you've reported, in one place.</p>
        </div>
        <Button as={Link} to="/create-item" variant="primary">Report broken item</Button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p>Add a broken items & repairers nearby will start sending estimates.</p>
          <Button as={Link} to="/create-item" variant="primary">Report broken item</Button>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}