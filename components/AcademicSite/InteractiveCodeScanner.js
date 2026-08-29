import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import BorderBeam from "./BorderBeam";
import styles from "./InteractiveCodeScanner.module.css";

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
    <div className={styles.scannerCard}>
      <BorderBeam size={240} duration={14} colorFrom="#0284c7" colorTo="#38bdf8" />
      {/* 1. Header with Language Selector Tabs */}
      <div className={styles.scannerHeader}>
        <div className={styles.scannerTitleGroup}>
          <Code2 size={16} color="var(--brand-primary, #0284c7)" />
          <span className={styles.scannerTitle}>
            Vulnerability Inspector
          </span>
        </div>

        {/* Language Tabs */}
        <div
          role="tablist"
          aria-label="Code vulnerability language samples"
          className={styles.langTabsList}
        >
          {SAMPLES.map((s, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(idx)}
                className={`${styles.langTab} ${isActive ? styles.langTabActive : ""}`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Metadata & View Controls */}
      <div className={styles.metadataBar}>
        <div className={styles.metaInfoGroup}>
          <span
            className={
              sample.severity === "CRITICAL"
                ? styles.severityBadgeCritical
                : styles.severityBadgeHigh
            }
          >
            {sample.severity} {sample.cvss}
          </span>
          <span className={styles.cveCode}>{sample.cve}</span>
          <span className={styles.cweDesc}>— {sample.cwe}</span>
        </div>

        {/* View Switcher & Copy */}
        <div className={styles.controlsGroup}>
          <div className={styles.viewModeToggle}>
            <button
              onClick={() => setViewMode("split")}
              className={`${styles.viewBtn} ${viewMode === "split" ? styles.viewBtnSplitActive : ""}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("vulnerable")}
              className={`${styles.viewBtn} ${viewMode === "vulnerable" ? styles.viewBtnVulnActive : ""}`}
            >
              Vulnerable
            </button>
            <button
              onClick={() => setViewMode("patched")}
              className={`${styles.viewBtn} ${viewMode === "patched" ? styles.viewBtnPatchActive : ""}`}
            >
              Remediated
            </button>
          </div>

          <button
            onClick={handleCopy}
            title="Copy current code"
            className={styles.copyBtn}
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* 3. Code Display Area */}
      <div className={styles.codeArea}>
        {viewMode === "split" ? (
          <div className={styles.splitGrid}>
            {/* Vulnerable Code */}
            <div className={styles.vulnerableColumn}>
              <div className={styles.columnHeaderVuln}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <AlertTriangle size={13} />
                  <span>VULNERABLE CODE</span>
                </div>
              </div>
              <pre className={styles.vulnerablePre}>
                <code>{sample.vulnerable}</code>
              </pre>
            </div>

            {/* Patched Code */}
            <div className={styles.remediatedColumn}>
              <div className={styles.columnHeaderRemediated}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <ShieldCheck size={13} />
                  <span>REMEDIATED CODE</span>
                </div>
              </div>
              <pre className={styles.remediatedPre}>
                <code>{sample.patched}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className={styles.singleCodeWrap}>
            <pre className={viewMode === "vulnerable" ? styles.vulnerablePre : styles.remediatedPre}>
              <code>{viewMode === "vulnerable" ? sample.vulnerable : sample.patched}</code>
            </pre>
          </div>
        )}
      </div>

      {/* 4. Streamlined Summary Banner */}
      <div className={styles.summaryBanner}>
        <div className={styles.summaryItem}>
          <AlertTriangle size={14} color="#dc2626" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <span className={styles.summaryTitleVuln}>
              Identified Vulnerability
            </span>
            <span className={styles.summaryText}>
              {sample.vulnerabilityNote}
            </span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <ShieldCheck size={14} color="#059669" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <span className={styles.summaryTitleRemediated}>
              Applied Remediation
            </span>
            <span className={styles.summaryText}>
              {sample.remediationNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

