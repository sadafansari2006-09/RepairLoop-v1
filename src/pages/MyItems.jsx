import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError("");

        // Get the currently logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setItems([]);
          return;
        }

        // Get only this user's items
        const { data, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("owner_id", user.id);

        if (itemsError) {
          throw itemsError;
        }

        setItems(data || []);
      } catch (error) {
        console.error("Error loading items:", error);
        setError("Could not load your items.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  if (loading) {
    return <div>Loading your items...</div>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My items</h1>
          <p>Everything you've reported, in one place.</p>
        </div>

        <Button
          as={Link}
          to="/create-item"
          variant="primary"
        >
          Report broken item
        </Button>
      </div>

      {error && (
        <p style={{ color: "#b4533c", marginBottom: "24px" }}>
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing here yet</h3>

          <p>
            Add a broken item & repairers nearby will start
            sending estimates.
          </p>

          <Button
            as={Link}
            to="/create-item"
            variant="primary"
          >
            Report broken item
          </Button>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={{
                id: item.id,
                name: item.item_name,
                category: item.category,
                description: item.description,
                image: item.image_url || undefined,
                status: item.status,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}