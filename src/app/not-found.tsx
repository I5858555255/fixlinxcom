import Link from "next/link";

/**
 * GitHub Pages static export: Next.js generates out/404.html from this file,
 * and GitHub serves it for ANY unknown path under the project. Brand it and
 * send visitors back to the home page instead of a dead end.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "48px 16px",
        textAlign: "center",
        fontFamily: "'IBM Plex Sans', Helvetica, Arial, sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 13,
          letterSpacing: "0.2em",
          color: "#9AA0A6",
          textTransform: "uppercase",
        }}
      >
        404 — Page Not Found
      </p>
      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 700,
          color: "#2F2F2F",
        }}
      >
        This page does not exist.
      </h1>
      <Link
        href="/"
        style={{
          background: "#F59E0B",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.05em",
          padding: "12px 28px",
          borderRadius: 8,
        }}
      >
        GO TO HOMEPAGE
      </Link>
    </main>
  );
}
