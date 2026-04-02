export default function SlotsFullPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#020617",
        color: "white",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div>
        <h1 style={{ color: "#ff4d4d", fontSize: "2rem", marginBottom: "12px" }}>
          Slots Full
        </h1>
        <p style={{ opacity: 0.85 }}>
          Registration for INNOU Run is now closed because all slots have been filled.
        </p>
      </div>
    </main>
  );
}
