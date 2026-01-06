function DayView({ day, activities }) {
  return (
    <div style={styles.day}>
      <h4>{day}</h4>

      {activities.length === 0 && <p>No activities added</p>}

      {activities.map((activity) => (
        <div key={activity.id} style={styles.activity}>
          <strong>{activity.name}</strong>
          <p>Cost: ₹{activity.cost}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  day: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  activity: {
    background: "#f5f5f5",
    padding: "6px",
    marginTop: "6px",
    borderRadius: "4px",
  },
};

export default DayView;
