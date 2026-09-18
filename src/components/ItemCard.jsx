import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import Photo from "./Photo";

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <Photo src={item.image} gradientClass={item.photoClass} alt={item.name} className="item-card-thumb" />
      <div className="item-card-body">
        <div className="item-card-top">
          <h3>{item.name}</h3>
          <StatusBadge status={item.status} />
        </div>
        <div className="item-card-meta">{item.category}</div>
        <p>{item.description}</p>
      </div>
    </Link>
  );
}