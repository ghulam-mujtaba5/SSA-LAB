import React, { useState } from "react";
import { Check, ShieldCheck, AlertTriangle, Terminal, Cpu, ArrowRight, Play, RefreshCw } from "lucide-react";

const SAMPLES = [
  {
    id: "buffer-overflow",
    title: "C/C++ Memory Safety Audit",
    cve: "CVE-2024-30192",
    vulnerable: `// UNCHECKED SOURCE CODE
void parse_input(char *user_str) {
    char buffer[64];
    // Risk: Unbounded string copy
    strcpy(buffer, user_str); 
    process_data(buffer);
}`,
    patched: `// SCSA AUDITED & REMEDIATED CODE
void parse_input(const char *user_str) {
    char buffer[64];
    // Fixed: Bounded copy with null-termination
    if (snprintf(buffer, sizeof(buffer), "%s", user_str) >= sizeof(buffer)) {
        log_security_alert("Buffer truncation detected", user_str);
        return;
    }
    process_data(buffer);
}`,
    metrics: {
      tool: "SQVDT Core Engine",
      confidence: "99.4%",
      analysisTime: "4.2 ms",
      verdict: "Pass — Memory Safe"
    }
  },
  {
    id: "sql-injection",
    title: "Python Query Injection Analysis",
    cve: "CWE-89",
    vulnerable: `# UNCHECKED SOURCE CODE
def get_user_profile(user_id):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    # Risk: SQL Injection via unsanitized input
    return db.execute(query)`,
    patched: `# SCSA AUDITED & REMEDIATED CODE
def get_user_profile(user_id):
    query = "SELECT * FROM users WHERE id = %s"
    # Fixed: Parameterized query prevents SQLi
    return db.execute(query, (user_id,))`,
    metrics: {
      tool: "VCIPR AST Parser",
      confidence: "100%",
      analysisTime: "1.8 ms",
      verdict: "Pass — Injection Free"
    }
  }
];

export default function InteractiveCodeScanner() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("patched"); // "vulnerable" or "patched"
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sample = SAMPLES[activeSampleIndex];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div
      style={{
        background: "#090d16",
        borderRadius: "16px",
        border: "1px solid #1e293b",
        overflow: "hidden",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        margin: "32px 0",
        fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
      }}
    >
      {/* IDE Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Mac/Terminal Dots */}
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "0.82rem" }}>
            <Terminal size={14} color="#6366f1" />
            <span>SCSA Static Analysis Engine v2.4.0</span>
          </div>
        </div>

        {/* Sample Switchers */}
        <div style={{ display: "flex", gap: "8px" }}>
          {SAMPLES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSampleIndex(idx);
                handleRunAnalysis();
              }}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.74rem",
                fontWeight: 600,
                background: activeSampleIndex === idx ? "#1e293b" : "transparent",
                color: activeSampleIndex === idx ? "#6366f1" : "#64748b",
                border: "1px solid",
                borderColor: activeSampleIndex === idx ? "#334155" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Control & Tab Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          background: "#0d1322",
          borderBottom: "1px solid #1e293b",
          fontSize: "0.8rem",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setActiveTab("vulnerable")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "vulnerable" ? "rgba(239, 68, 68, 0.15)" : "transparent",
              color: activeTab === "vulnerable" ? "#f87171" : "#64748b",
              border: "1px solid",
              borderColor: activeTab === "vulnerable" ? "rgba(239, 68, 68, 0.4)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <AlertTriangle size={13} />
            <span>Unchecked Code</span>
          </button>
          <button
            onClick={() => setActiveTab("patched")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "patched" ? "rgba(16, 185, 129, 0.15)" : "transparent",
              color: activeTab === "patched" ? "#34d399" : "#64748b",
              border: "1px solid",
              borderColor: activeTab === "patched" ? "rgba(16, 185, 129, 0.4)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} />
            <span>SCSA Audited Code</span>
          </button>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "6px",
            background: "#4f46e5",
            color: "#ffffff",
            border: "none",
            fontSize: "0.76rem",
            fontWeight: 600,
            cursor: "pointer",
            opacity: isAnalyzing ? 0.7 : 1,
          }}
        >
          <RefreshCw size={12} className={isAnalyzing ? "spin-anim" : ""} />
          <span>{isAnalyzing ? "Analyzing AST..." : "Run AST Verification"}</span>
        </button>
      </div>

      {/* Code Editor Body */}
      <div style={{ position: "relative", padding: "20px", minHeight: "180px", overflowX: "auto" }}>
        {isAnalyzing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9, 13, 22, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#38bdf8",
              zIndex: 5,
              fontSize: "0.85rem",
              backdropFilter: "blur(2px)",
            }}
          >
            <Cpu size={20} className="pulse-anim" />
            <span>Executing Static Vulnerability Analysis & AST Graph Walk...</span>
          </div>
        )}

        <pre
          style={{
            margin: 0,
            fontSize: "0.85rem",
            lineHeight: "1.6",
            color: activeTab === "vulnerable" ? "#fca5a5" : "#a7f3d0",
            fontFamily: "inherit",
          }}
        >
          <code>{activeTab === "vulnerable" ? sample.vulnerable : sample.patched}</code>
        </pre>
      </div>

      {/* Output Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          background: "#0f172a",
          borderTop: "1px solid #1e293b",
          fontSize: "0.75rem",
          color: "#94a3b8",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>Tool: <strong style={{ color: "#f8fafc" }}>{sample.metrics.tool}</strong></span>
          <span>CVE Ref: <strong style={{ color: "#cbd5e1" }}>{sample.cve}</strong></span>
          <span>Latency: <strong style={{ color: "#34d399" }}>{sample.metrics.analysisTime}</strong></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: activeTab === "vulnerable" ? "#ef4444" : "#10b981",
            }}
          />
          <span style={{ fontWeight: 600, color: activeTab === "vulnerable" ? "#ef4444" : "#10b981" }}>
            {activeTab === "vulnerable" ? "Vulnerability Flagged" : sample.metrics.verdict}
          </span>
        </div>
      </div>
    </div>
  );
}
