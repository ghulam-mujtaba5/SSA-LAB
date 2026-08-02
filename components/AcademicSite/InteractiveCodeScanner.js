import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Terminal,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  Code2,
  Bug,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Columns,
  Eye,
  Zap,
  ArrowRight,
} from "lucide-react";

const SAMPLES = [
  {
    id: "buffer-overflow",
    title: "C/C++ Memory Safety Audit",
    cve: "CVE-2024-30192",
    cwe: "CWE-120: Buffer Copy without Checking Size",
    severity: "CRITICAL",
    cvss: "9.8",
    lang: "C / C++",
    vulnerable: `// UNCHECKED SOURCE CODE
void parse_input(char *user_str) {
    char buffer[64];
    // Risk: Unbounded string copy (Buffer Overflow)
    strcpy(buffer, user_str); 
    process_data(buffer);
}`,
    patched: `// SCSA AUDITED & REMEDIATED CODE
void parse_input(const char *user_str) {
    char buffer[64];
    // Fixed: Bounded copy with null-termination & audit log
    if (snprintf(buffer, sizeof(buffer), "%s", user_str) >= sizeof(buffer)) {
        log_security_alert("Buffer truncation detected", user_str);
        return;
    }
    process_data(buffer);
}`,
    vulnerableLine: 5,
    astNodes: [
      {
        node: "CallExpression: strcpy(buffer, user_str)",
        type: "Memory Sink",
        desc: "Destination buffer 'buffer[64]' has fixed size. Source 'user_str' is untrusted input without bounds checking.",
        impact: "Stack Memory Corruption / Remote Code Execution",
        fix: "Replace strcpy() with safe bounded snprintf() or strlcpy(). Validate return length.",
      },
    ],
    metrics: {
      tool: "SQVDT Core Engine",
      confidence: "99.8%",
      analysisTime: "3.2 ms",
      astDepth: 14,
      verdict: "Pass — Memory Safe",
    },
  },
  {
    id: "sql-injection",
    title: "Python Query Injection Analysis",
    cve: "CVE-2023-4109",
    cwe: "CWE-89: Improper Neutralization of Special Elements (SQLi)",
    severity: "HIGH",
    cvss: "8.8",
    lang: "Python",
    vulnerable: `# UNCHECKED SOURCE CODE
def get_user_profile(user_id):
    # Risk: SQL Injection via f-string dynamic query
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    return db.execute(query)`,
    patched: `# SCSA AUDITED & REMEDIATED CODE
def get_user_profile(user_id):
    # Fixed: Parameterized query decouples SQL syntax from input data
    query = "SELECT * FROM users WHERE id = %s"
    return db.execute(query, (user_id,))`,
    vulnerableLine: 4,
    astNodes: [
      {
        node: "FormattedValue / StringConcat: f'SELECT...{user_id}'",
        type: "Taint Sink",
        desc: "User variable 'user_id' flows directly into dynamic SQL string token stream without sanitization.",
        impact: "Unauthorized Data Access / Authentication Bypass",
        fix: "Use parameterized queries with placeholder bindings (%s or ?).",
      },
    ],
    metrics: {
      tool: "VCIPR AST Parser",
      confidence: "100%",
      analysisTime: "1.4 ms",
      astDepth: 9,
      verdict: "Pass — Injection Free",
    },
  },
  {
    id: "java-deserialization",
    title: "Java Deserialization Audit",
    cve: "CVE-2023-28956",
    cwe: "CWE-502: Deserialization of Untrusted Data",
    severity: "CRITICAL",
    cvss: "9.8",
    lang: "Java",
    vulnerable: `// UNCHECKED SOURCE CODE
public Object receivePayload(byte[] stream) throws Exception {
    ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(stream));
    // Risk: Unfiltered deserialization executes arbitrary gadget chains
    return ois.readObject();
}`,
    patched: `// SCSA AUDITED & REMEDIATED CODE
public Object receivePayload(byte[] stream) throws Exception {
    ObjectInputStream ois = new ValidatingObjectInputStream(new ByteArrayInputStream(stream));
    // Fixed: Whitelist filter restricts object classes before instantiation
    ((ValidatingObjectInputStream) ois).accept(UserProfileDTO.class, SecurityContext.class);
    return ois.readObject();
}`,
    vulnerableLine: 5,
    astNodes: [
      {
        node: "MethodInvocation: ois.readObject()",
        type: "Object Instantiation Sink",
        desc: "Stream payload instantiates arbitrary classes found on classpath during deserialization traversal.",
        impact: "Remote Code Execution (RCE) via CommonsCollections gadget chains",
        fix: "Implement ValidatingObjectInputStream class whitelist before invocation.",
      },
    ],
    metrics: {
      tool: "AST-SCSA Java Guard",
      confidence: "99.5%",
      analysisTime: "4.1 ms",
      astDepth: 18,
      verdict: "Pass — Deserialization Secure",
    },
  },
  {
    id: "node-cmd-injection",
    title: "Node.js Command Injection Analysis",
    cve: "CVE-2023-38552",
    cwe: "CWE-78: OS Command Injection",
    severity: "HIGH",
    cvss: "8.6",
    lang: "Node.js",
    vulnerable: `// UNCHECKED SOURCE CODE
const { exec } = require('child_process');

function pingServer(userHost) {
    // Risk: Shell parameter concatenation allows subshell execution
    exec('ping -c 1 ' + userHost, (err, stdout) => {
        sendResponse(stdout);
    });
}`,
    patched: `// SCSA AUDITED & REMEDIATED CODE
const { execFile } = require('child_process');

function pingServer(userHost) {
    // Fixed: execFile executes binary directly without shell interpolation
    execFile('/bin/ping', ['-c', '1', userHost], (err, stdout) => {
        sendResponse(stdout);
    });
}`,
    vulnerableLine: 6,
    astNodes: [
      {
        node: "CallExpression: exec('ping -c 1 ' + userHost)",
        type: "OS Process Sink",
        desc: "Untrusted string argument concatenated into shell invocation string (e.g. '127.0.0.1; rm -rf /').",
        impact: "Host OS Shell Takeover / System Compromise",
        fix: "Use execFile() with fixed argument arrays instead of invoking system shell parser.",
      },
    ],
    metrics: {
      tool: "Node-AST Security Analyzer",
      confidence: "99.9%",
      analysisTime: "2.1 ms",
      astDepth: 11,
      verdict: "Pass — Shell Safe",
    },
  },
];

export default function InteractiveCodeScanner() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [viewMode, setViewMode] = useState("split"); // "split", "vulnerable", "patched"
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAstDetails, setShowAstDetails] = useState(true);
  const [scanStep, setScanStep] = useState(0);

  const sample = SAMPLES[activeSampleIndex];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setScanStep(1);

    const step1 = setTimeout(() => setScanStep(2), 250);
    const step2 = setTimeout(() => setScanStep(3), 500);
    const step3 = setTimeout(() => {
      setScanStep(4);
      setIsAnalyzing(false);
    }, 750);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleCopyCode = () => {
    const codeToCopy = viewMode === "vulnerable" ? sample.vulnerable : sample.patched;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#080c14",
        borderRadius: "16px",
        border: "1px solid #1e293b",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 30px rgba(99, 102, 241, 0.08)",
        margin: "24px 0",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
        color: "#e2e8f0",
        width: "100%",
      }}
    >
      {/* 1. IDE Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "#0d1424",
          borderBottom: "1px solid #1e293b",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Terminal Dots */}
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "0.82rem" }}>
            <Terminal size={15} color="#818cf8" />
            <span style={{ fontWeight: 600, color: "#cbd5e1" }}>SCSA AST Static Engine v3.2.0</span>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              LLVM / Tree-Sitter
            </span>
          </div>
        </div>

        {/* Vulnerability Benchmark Selector Pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {SAMPLES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSampleIndex(idx);
                handleRunAnalysis();
              }}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                background: activeSampleIndex === idx ? "#1e1b4b" : "#0f172a",
                color: activeSampleIndex === idx ? "#a5b4fc" : "#94a3b8",
                border: "1px solid",
                borderColor: activeSampleIndex === idx ? "#6366f1" : "#1e293b",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Code2 size={13} color={activeSampleIndex === idx ? "#818cf8" : "#64748b"} />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#0a0f1d",
          borderBottom: "1px solid #1e293b",
          fontSize: "0.8rem",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* View Mode Buttons */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 600, marginRight: "4px" }}>
            VIEW MODE:
          </span>
          <button
            onClick={() => setViewMode("split")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "6px",
              background: viewMode === "split" ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: viewMode === "split" ? "#818cf8" : "#64748b",
              border: "1px solid",
              borderColor: viewMode === "split" ? "rgba(99, 102, 241, 0.4)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.76rem",
            }}
          >
            <Columns size={13} />
            <span>Split Diff</span>
          </button>
          <button
            onClick={() => setViewMode("vulnerable")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "6px",
              background: viewMode === "vulnerable" ? "rgba(239, 68, 68, 0.15)" : "transparent",
              color: viewMode === "vulnerable" ? "#f87171" : "#64748b",
              border: "1px solid",
              borderColor: viewMode === "vulnerable" ? "rgba(239, 68, 68, 0.4)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.76rem",
            }}
          >
            <AlertTriangle size={13} />
            <span>Unchecked</span>
          </button>
          <button
            onClick={() => setViewMode("patched")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "6px",
              background: viewMode === "patched" ? "rgba(16, 185, 129, 0.15)" : "transparent",
              color: viewMode === "patched" ? "#34d399" : "#64748b",
              border: "1px solid",
              borderColor: viewMode === "patched" ? "rgba(16, 185, 129, 0.4)" : "transparent",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.76rem",
            }}
          >
            <ShieldCheck size={14} />
            <span>SCSA Remediated</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowAstDetails(!showAstDetails)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "6px",
              background: showAstDetails ? "rgba(56, 189, 248, 0.15)" : "transparent",
              color: showAstDetails ? "#38bdf8" : "#64748b",
              border: "1px solid",
              borderColor: showAstDetails ? "rgba(56, 189, 248, 0.4)" : "#1e293b",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.76rem",
            }}
          >
            <Layers size={13} />
            <span>{showAstDetails ? "AST Inspector Active" : "Show AST Graph"}</span>
          </button>

          <button
            onClick={handleCopyCode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 11px",
              borderRadius: "6px",
              background: copied ? "rgba(16, 185, 129, 0.2)" : "#1e293b",
              color: copied ? "#34d399" : "#cbd5e1",
              border: "1px solid #334155",
              cursor: "pointer",
              fontSize: "0.76rem",
              fontWeight: 600,
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              color: "#ffffff",
              border: "none",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              opacity: isAnalyzing ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            <RefreshCw size={13} className={isAnalyzing ? "spin-anim" : ""} />
            <span>{isAnalyzing ? "Analyzing AST..." : "Run AST Verification"}</span>
          </button>
        </div>
      </div>

      {/* 3. Vulnerability Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "rgba(15, 23, 42, 0.9)",
          borderBottom: "1px solid #1e293b",
          fontSize: "0.78rem",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 800,
              background: sample.severity === "CRITICAL" ? "#ef4444" : "#f59e0b",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {sample.severity} ({sample.cvss})
          </span>
          <span style={{ color: "#f8fafc", fontWeight: 700 }}>{sample.cve}</span>
          <span style={{ color: "#94a3b8" }}>— {sample.cwe}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontSize: "0.75rem" }}>
          <span>Language: <strong style={{ color: "#38bdf8" }}>{sample.lang}</strong></span>
          <span>AST Depth: <strong style={{ color: "#cbd5e1" }}>{sample.metrics.astDepth}</strong></span>
        </div>
      </div>

      {/* 4. Code Display Body (Split View or Single Tab) */}
      <div style={{ position: "relative", minHeight: "220px", overflowX: "auto" }}>
        {/* Loading overlay during analysis */}
        {isAnalyzing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(8, 12, 20, 0.92)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              color: "#38bdf8",
              zIndex: 10,
              backdropFilter: "blur(4px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Cpu size={24} className="pulse-anim" color="#818cf8" />
              <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f8fafc" }}>
                SCSA Static Analyzer Running...
              </span>
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#94a3b8",
                background: "#0f172a",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #1e293b",
                maxWidth: "480px",
                textAlign: "center",
              }}
            >
              {scanStep === 1 && "⚡ Step 1/3: Lexical Tokenization & AST Tree Construction..."}
              {scanStep === 2 && "🔍 Step 2/3: Traversing Dataflow Graph & Checking Taint Sinks..."}
              {scanStep === 3 && "🛡️ Step 3/3: Match Security Rules & Verifying Automated Patch..."}
              {scanStep === 4 && "✅ Audit Complete: AST Code Remediated with 100% Assurance."}
            </div>
          </div>
        )}

        {/* Code Content Layout */}
        {viewMode === "split" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              divideX: "1px solid #1e293b",
            }}
          >
            {/* Left: Unchecked Vulnerable Code */}
            <div style={{ padding: "16px 20px", background: "#0b101d", borderRight: "1px solid #1e293b" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "6px",
                  borderBottom: "1px dashed rgba(239, 68, 68, 0.3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f87171", fontSize: "0.76rem", fontWeight: 700 }}>
                  <AlertTriangle size={14} />
                  <span>UNCHECKED SOURCE CODE</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                  Vulnerable
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: "0.82rem",
                  lineHeight: "1.65",
                  color: "#fca5a5",
                  fontFamily: "inherit",
                  whiteSpace: "pre-wrap",
                }}
              >
                <code>{sample.vulnerable}</code>
              </pre>
            </div>

            {/* Right: SCSA Remediated Code */}
            <div style={{ padding: "16px 20px", background: "#071217" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "6px",
                  borderBottom: "1px dashed rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#34d399", fontSize: "0.76rem", fontWeight: 700 }}>
                  <ShieldCheck size={14} />
                  <span>SCSA REMEDIATED CODE</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                  Patched
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: "0.82rem",
                  lineHeight: "1.65",
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
          /* Single Tab View Mode */
          <div style={{ padding: "18px 24px", background: viewMode === "vulnerable" ? "#0c101c" : "#071317" }}>
            <pre
              style={{
                margin: 0,
                fontSize: "0.85rem",
                lineHeight: "1.7",
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

      {/* 5. Interactive AST Node Security Inspector */}
      {showAstDetails && (
        <div
          style={{
            padding: "16px 20px",
            background: "#070c18",
            borderTop: "1px solid #1e293b",
            fontSize: "0.8rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: 700, fontSize: "0.8rem" }}>
              <Layers size={15} />
              <span>AST Graph Traversal & Vulnerability Analysis</span>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              Taint Source → AST Node → Dataflow Sink
            </span>
          </div>

          {sample.astNodes.map((ast, idx) => (
            <div
              key={idx}
              style={{
                background: "#0f172a",
                borderRadius: "10px",
                border: "1px solid #1e293b",
                padding: "14px 16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                  FLAGGED AST NODE & TYPE
                </div>
                <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.83rem", fontFamily: "inherit" }}>
                  {ast.node}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#cbd5e1", marginTop: "4px" }}>
                  Role: <span style={{ color: "#f59e0b" }}>{ast.type}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                  ROOT CAUSE & IMPACT
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "0.78rem", lineHeight: "1.4" }}>
                  {ast.desc}
                </div>
                <div style={{ color: "#f87171", fontSize: "0.74rem", fontWeight: 600, marginTop: "4px" }}>
                  ⚠️ {ast.impact}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                  SCSA REMEDIATION PATTERN
                </div>
                <div style={{ color: "#34d399", fontSize: "0.78rem", lineHeight: "1.4", fontWeight: 600 }}>
                  ✓ {ast.fix}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Output Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#0a0f1d",
          borderTop: "1px solid #1e293b",
          fontSize: "0.75rem",
          color: "#94a3b8",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span>Engine: <strong style={{ color: "#f8fafc" }}>{sample.metrics.tool}</strong></span>
          <span>Confidence: <strong style={{ color: "#38bdf8" }}>{sample.metrics.confidence}</strong></span>
          <span>Analysis Time: <strong style={{ color: "#cbd5e1" }}>{sample.metrics.analysisTime}</strong></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: viewMode === "vulnerable" ? "#ef4444" : "#10b981",
              boxShadow: viewMode === "vulnerable" ? "0 0 8px #ef4444" : "0 0 8px #10b981",
            }}
          />
          <span style={{ fontWeight: 700, color: viewMode === "vulnerable" ? "#ef4444" : "#10b981" }}>
            {viewMode === "vulnerable" ? "Vulnerability Flagged" : sample.metrics.verdict}
          </span>
        </div>
      </div>
    </div>
  );
}
