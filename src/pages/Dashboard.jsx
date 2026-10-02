import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Photo from "../components/Photo";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [estimateCount, setEstimateCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          throw new Error("You must be logged in.");
        }

        // Get user's profile
        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("name, email, role")
            .eq("id", authUser.id)
            .single();

        if (profileError) {
          throw profileError;
        }

        setUser({
          name: profile.name || authUser.email,
          email: profile.email || authUser.email,
          role: profile.role,
        });

        // Get user's items
        const { data: itemData, error: itemError } =
          await supabase
            .from("items")
            .select("*")
            .eq("owner_id", authUser.id)
            .order("id", { ascending: false });

        if (itemError) {
          throw itemError;
        }

        setItems(itemData || []);

        // Get user's repair requests
        const {
          data: requestData,
          error: requestError,
        } = await supabase
          .from("repair_requests")
          .select("*")
          .eq("owner_id", authUser.id)
          .order("created_at", { ascending: false });

        if (requestError) {
          throw requestError;
        }

        if (!requestData || requestData.length === 0) {
          setRequests([]);
          setEstimateCount(0);
          return;
        }

        // Get items connected to repair requests
        const itemIds = requestData.map(
          (request) => request.item_id
        );

        const { data: requestItems, error: requestItemsError } =
          await supabase
            .from("items")
            .select("*")
            .in("id", itemIds);

        if (requestItemsError) {
          throw requestItemsError;
        }

        // Get estimates
        const requestIds = requestData.map(
          (request) => request.id
        );

        const {
          data: estimateData,
          error: estimateError,
        } = await supabase
          .from("estimates")
          .select("id, request_id")
          .in("request_id", requestIds);

        if (estimateError) {
          throw estimateError;
        }

        setEstimateCount(estimateData?.length || 0);

        // Combine request + item + estimate information
        const formattedRequests = requestData.map(
          (request) => {
            const item = requestItems?.find(
              (item) => item.id === request.item_id
            );

            const requestEstimateCount =
              estimateData?.filter(
                (estimate) =>
                  estimate.request_id === request.id
              ).length || 0;

            return {
              id: request.id,
              itemName: item?.item_name || "Unknown item",
              category: item?.category || "Other",
              description: item?.description || "",
              image: item?.image_url || undefined,
              status: request.status,
              createdAt: new Date(
                request.created_at
              ).toLocaleDateString("en-IN"),
              estimateCount: requestEstimateCount,
            };
          }
        );

        setRequests(formattedRequests);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.message || "Could not load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <h3>Loading your dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Could not load dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  const activeRepairs = requests.filter(
    (request) =>
      request.status === "in_progress" ||
      request.status === "estimating"
  );

  const completed = requests.filter(
    (request) => request.status === "completed"
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "there"}
          </h1>

          <p>
            Here's what's happening with your items.
          </p>
        </div>

        <Button
          as={Link}
          to="/create-item"
          variant="primary"
        >
          Report broken item
        </Button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="num">{items.length}</div>
          <div className="label">Items added</div>
        </div>

        <div className="stat-card">
          <div className="num">
            {activeRepairs.length}
          </div>
          <div className="label">Active repairs</div>
        </div>

        <div className="stat-card">
          <div className="num">
            {completed.length}
          </div>
          <div className="label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="num">
            {estimateCount}
          </div>
          <div className="label">Estimates received</div>
        </div>
      </div>

      <div
        className="section-head"
        style={{ marginBottom: 24 }}
      >
        <h2>Your items</h2>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No items yet</h3>

          <p>
            Add your first broken item to start receiving
            repair estimates.
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
          {items.slice(0, 3).map((item) => (
            <ItemCard
              key={item.id}
              item={{
                ...item,
                name: item.item_name,
                image: item.image_url,
              }}
            />
          ))}
        </div>
      )}

      <div
        className="section-head"
        style={{ margin: "48px 0 24px" }}
      >
        <h2>Recent repair requests</h2>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No repair requests yet</h3>

          <p>
            Report a broken item to create your first repair
            request.
          </p>
        </div>
      ) : (
        <div className="row-list">
          {requests.slice(0, 4).map((request) => (
            <Link
              key={request.id}
              to={`/repair-requests/${request.id}`}
              className="row-card"
            >
              <div className="row-card-main">
                <Photo
                  src={request.image}
                  alt={request.itemName}
                  className="row-thumb"
                />

                <div>
                  <div className="row-title">
                    {request.itemName}
                  </div>

                  <div className="row-sub">
                    {request.estimateCount} estimate
                    {request.estimateCount === 1
                      ? ""
                      : "s"}{" "}
                    · Submitted {request.createdAt}
                  </div>
                </div>
              </div>

              <div className="row-side">
                <StatusBadge
                  status={request.status}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}