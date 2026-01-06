import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import CreateTrip from "../trips/CreateTrip";
import TripList from "../trips/TripList";

function Dashboard() {
  const { logout } = useAuth();
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>GlobeTrotter</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <CreateTrip onCreated={() => setRefresh(!refresh)} />
      <TripList key={refresh} />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
};

export default Dashboard;
