import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Code2,
} from "lucide-react";

const SAMPLES = [
  {
    id: "buffer-overflow",
    title: "C / C++",
    cve: "CVE-2015-7547",
    cwe: "CWE-120: Buffer Copy without Checking Size",
    severity: "CRITICAL",
    cvss: "9.8",
    lang: "C / C++",
    vulnerable: `// Vulnerable: Unbounded string copy
void parse_input(char *user_str) {
    char buffer[64];
    // Risk: Stack buffer overflow
    strcpy(buffer, user_str); 
    process_data(buffer);
}`,
    patched: `// Patched: Bounded copy with size check
void parse_input(const char *user_str) {
    char buffer[64];
    if (snprintf(buffer, sizeof(buffer), "%s", user_str) >= sizeof(buffer)) {
        log_security_alert("Buffer truncation detected", user_str);
        return;
    }
    process_data(buffer);
}`,
    vulnerabilityNote: "strcpy() copies untrusted input without bounds checking, leading to stack corruption.",
    remediationNote: "Replaced with bounded snprintf() and strict length verification.",
  },
  {
    id: "sql-injection",
    title: "Python",
    cve: "CVE-2022-31188",
    cwe: "CWE-89: SQL Injection",
    severity: "HIGH",
    cvss: "8.8",
    lang: "Python",
    vulnerable: `# Vulnerable: Dynamic string formatting in query
def get_user_profile(user_id):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    return db.execute(query)`,
    patched: `# Patched: Parameterized query binding
def get_user_profile(user_id):
    query = "SELECT * FROM users WHERE id = %s"
    return db.execute(query, (user_id,))`,
    vulnerabilityNote: "Direct f-string interpolation allows arbitrary SQL query modification.",
    remediationNote: "Uses parameterized query placeholders (%s) preventing SQL injection.",
  },
  {
    id: "java-deserialization",
    title: "Java",
    cve: "CVE-2015-4852",
    cwe: "CWE-502: Deserialization of Untrusted Data",
    severity: "CRITICAL",
    cvss: "9.8",
    lang: "Java",
    vulnerable: `// Vulnerable: Unrestricted object deserialization
public Object receivePayload(byte[] stream) throws Exception {
    ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(stream));
    return ois.readObject(); // Risk: Arbitrary gadget execution
}`,
    patched: `// Patched: Class whitelist validation filter
public Object receivePayload(byte[] stream) throws Exception {
    ValidatingObjectInputStream ois = new ValidatingObjectInputStream(new ByteArrayInputStream(stream));
    ois.accept(UserProfileDTO.class, SecurityContext.class);
    return ois.readObject();
}`,
    vulnerabilityNote: "Unfiltered ObjectInputStream enables remote code execution via gadget chains.",
    remediationNote: "Implements ValidatingObjectInputStream with an explicit class whitelist.",
  },
  {
    id: "node-cmd-injection",
    title: "Node.js",
    cve: "CVE-2021-21315",
    cwe: "CWE-78: OS Command Injection",
    severity: "HIGH",
    cvss: "8.6",
    lang: "Node.js",
    vulnerable: `// Vulnerable: Shell parameter concatenation
const { exec } = require('child_process');

function pingServer(userHost) {
    exec('ping -c 1 ' + userHost, (err, stdout) => {
        sendResponse(stdout);
    });
}`,
    patched: `// Patched: Safe execution with argument list
const { execFile } = require('child_process');

function pingServer(userHost) {
    execFile('/bin/ping', ['-c', '1', userHost], (err, stdout) => {
        sendResponse(stdout);
    });
}`,
    vulnerabilityNote: "String concatenation into exec() allows command chaining and shell takeover.",
    remediationNote: "Replaced with execFile() using an arguments array, avoiding shell execution.",
  },
];

export default function InteractiveCodeScanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState("split"); // "split", "vulnerable", "patched"
  const [copied, setCopied] = useState(false);

  const sample = SAMPLES[activeIdx];

  const handleCopy = () => {
    const code = viewMode === "vulnerable" ? sample.vulnerable : sample.patched;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#0d131f",
        borderRadius: "14px",
        border: "1px solid #1e293b",
        overflow: "hidden",
        boxShadow: "0 18px 36px -12px rgba(0, 0, 0, 0.45)",
        margin: "18px 0",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        color: "#e2e8f0",
        width: "100%",
      }}
    >
      {/* 1. Header with Language Selector Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#080c16",
          borderBottom: "1px solid #1e293b",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Code2 size={16} color="#38bdf8" />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#cbd5e1" }}>
            Vulnerability Inspector
          </span>
        </div>

        {/* Language Tabs */}
        <div
          role="tablist"
          aria-label="Code vulnerability language samples"
          style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
        >
          {SAMPLES.map((s, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  background: isActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
                  color: isActive ? "#38bdf8" : "#94a3b8",
                  border: isActive ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Metadata & View Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "#0a0f1d",
          borderBottom: "1px solid #1e293b",
          fontSize: "0.78rem",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 700,
              background: sample.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.18)" : "rgba(245, 158, 11, 0.18)",
              color: sample.severity === "CRITICAL" ? "#f87171" : "#fbbf24",
              border: sample.severity === "CRITICAL" ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            {sample.severity} {sample.cvss}
          </span>
          <span style={{ color: "#f8fafc", fontWeight: 600 }}>{sample.cve}</span>
          <span style={{ color: "#94a3b8" }}>— {sample.cwe}</span>
        </div>

        {/* View Switcher & Copy */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", background: "#060911", padding: "2px", borderRadius: "6px", border: "1px solid #1e293b" }}>
            <button
              onClick={() => setViewMode("split")}
              style={{
                padding: "4px 9px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: 600,
                background: viewMode === "split" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                color: viewMode === "split" ? "#38bdf8" : "#64748b",
                border: "none",
                cursor: "pointer",
              }}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("vulnerable")}
              style={{
                padding: "4px 9px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: 600,
                background: viewMode === "vulnerable" ? "rgba(239, 68, 68, 0.2)" : "transparent",
                color: viewMode === "vulnerable" ? "#fca5a5" : "#64748b",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vulnerable
            </button>
            <button
              onClick={() => setViewMode("patched")}
              style={{
                padding: "4px 9px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: 600,
                background: viewMode === "patched" ? "rgba(16, 185, 129, 0.2)" : "transparent",
                color: viewMode === "patched" ? "#6ee7b7" : "#64748b",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remediated
            </button>
          </div>

          <button
            onClick={handleCopy}
            title="Copy current code"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 9px",
              borderRadius: "6px",
              background: "#1e293b",
              color: copied ? "#34d399" : "#cbd5e1",
              border: "1px solid #334155",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* 3. Code Display Area */}
      <div style={{ overflowX: "auto" }}>
        {viewMode === "split" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              background: "#080c14",
            }}
          >
            {/* Vulnerable Code */}
            <div style={{ padding: "14px 18px", borderRight: "1px solid #1e293b", background: "rgba(239, 68, 68, 0.02)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#f87171",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <AlertTriangle size={13} />
                  <span>VULNERABLE CODE</span>
                </div>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  lineHeight: "1.6",
                  color: "#fca5a5",
                  fontFamily: "inherit",
                  whiteSpace: "pre-wrap",
                }}
              >
                <code>{sample.vulnerable}</code>
              </pre>
            </div>

            {/* Patched Code */}
            <div style={{ padding: "14px 18px", background: "rgba(16, 185, 129, 0.02)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#34d399",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <ShieldCheck size={13} />
                  <span>REMEDIATED CODE</span>
                </div>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  lineHeight: "1.6",
                  color: "#a7f3d0",
                  fontFamily: "inherit",
                  whiteSpace: "pre-wrap",
                }}
              >
                <code>{sample.patched}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 20px",
              background: viewMode === "vulnerable" ? "rgba(239, 68, 68, 0.03)" : "rgba(16, 185, 129, 0.03)",
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: "0.82rem",
                lineHeight: "1.65",
                color: viewMode === "vulnerable" ? "#fca5a5" : "#a7f3d0",
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
              }}
            >
              <code>{viewMode === "vulnerable" ? sample.vulnerable : sample.patched}</code>
            </pre>
          </div>
        )}
      </div>

      {/* 4. Streamlined Summary Banner (Uncluttered) */}
      <div
        style={{
          padding: "12px 16px",
          background: "#080c16",
          borderTop: "1px solid #1e293b",
          fontSize: "0.76rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <AlertTriangle size={14} color="#f87171" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: "0.7rem", color: "#f87171", fontWeight: 700, display: "block" }}>
              Identified Vulnerability
            </span>
            <span style={{ color: "#cbd5e1", fontSize: "0.74rem", lineHeight: "1.4" }}>
              {sample.vulnerabilityNote}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <ShieldCheck size={14} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700, display: "block" }}>
              Applied Remediation
            </span>
            <span style={{ color: "#cbd5e1", fontSize: "0.74rem", lineHeight: "1.4" }}>
              {sample.remediationNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

