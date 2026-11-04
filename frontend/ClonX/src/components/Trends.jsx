import { useEffect, useState } from "react";
import { getTrends } from "../services/trends";

export function Trends({ className = "" }) {
  const [trends, setTrends] = useState([]);
  const [status, setStatus] = useState("Cargando tendencias...");

  useEffect(() => {
    getTrends().then(setTrends).then(() => setStatus("")).catch((error) => setStatus(error.message));
  }, []);

  return (
    <div className={`feed-card ${className}`}>
      <h2>Tendencias relacionadas</h2>
      {status && <p role="status">{status}</p>}
      {!status && trends.length === 0 && <p>No hay tendencias disponibles.</p>}
      {!status && trends.map((trend) => (
        <div className="trend" key={trend.title}>
          <small>{trend.category}</small>
          <strong>{trend.title}</strong>
          <span>{trend.posts} publicaciones</span>
        </div>
      ))}
    </div>
  );
}
