import { useParams, useEffect, useState } from "react";
import { getPublicTrip } from "../services/share.service";

const PublicTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    getPublicTrip(token).then((res) => setTrip(res.data));
  }, [token]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div>
      <h1>{trip.title}</h1>
      {trip.stops.map((stop) => (
        <div key={stop.id}>
          <h3>{stop.city.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default PublicTrip;
