import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Heartbeat icon as gradient text */}
          <svg width="72" height="72" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f45e5e" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path
              d="M10 55 L25 55 L30 45 L35 65 L40 35 L45 70 L50 25 L55 55 L65 55 L70 30 L75 55 L90 55"
              fill="none"
              stroke="url(#g)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#1e293b",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              AgentVitals
            </span>
            <span
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                letterSpacing: "0.5px",
                marginTop: "4px",
              }}
            >
              The AI readiness check for hospital websites
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {["Semantic Readiness", "Actionability Readiness", "Navigation Readiness", "Integration Readiness"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  fontSize: "15px",
                  color: "#475569",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "32px",
            fontSize: "14px",
            color: "#94a3b8",
          }}
        >
          Brought to you by HospitalWebsites.com & Sparkle
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
