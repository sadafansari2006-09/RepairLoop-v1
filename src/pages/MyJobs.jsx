import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";

export default function MyJobs() {
  const { requests, repairer } = useApp();
  const myJobs = requests.filter((r) => r.chosenRepairerId === repairer.id);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>My jobs</h1>
          <p>Repairs owners have chosen you for.</p>
        </div>
      </div>

      {myJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs yet</h3>
          <p>Once an owner chooses your estimate, the job will appear here.</p>
        </div>
      ) : (
        <div className="row-list">
          {myJobs.map((job) => (
            <Link key={job.id} to={`/repairer/jobs/${job.id}`} className="row-card">
              <div className="row-card-main">
                <div className={`row-thumb photo ${job.photoClass}`} />
                <div>
                  <div className="row-title">{job.itemName}</div>
                  <div className="row-sub">{job.category} · Since {job.createdAt}</div>
                </div>
              </div>
              <StatusBadge status={job.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}