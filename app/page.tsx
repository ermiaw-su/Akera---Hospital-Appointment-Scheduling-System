import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Welcome to My App</h1>

      <Link
        href="/login"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#1161ee",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go to Login
      </Link>
    </main>
  );
}