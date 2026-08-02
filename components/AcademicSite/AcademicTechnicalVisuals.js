import React from "react";

/**
 * 1. AST & Static Code Security Analysis Graphic
 */
export function ASTAnalysisGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AST Node Analysis"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />
      
      {/* Grid pattern */}
      <path d="M 0 30 H 120 M 0 60 H 120 M 0 90 H 120 M 30 0 V 120 M 60 0 V 120 M 90 0 V 120" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />

      {/* Tree connections */}
      <path d="M 60 28 L 36 56 M 60 28 L 84 56 M 36 56 L 24 86 M 36 56 L 48 86 M 84 56 L 72 86 M 84 56 L 96 86" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

      {/* Root Node */}
      <circle cx="60" cy="28" r="10" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
      <path d="M 56 28 H 64 M 60 24 V 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

      {/* Internal Branch Nodes */}
      <circle cx="36" cy="56" r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="84" cy="56" r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />

      {/* Vulnerable / Security Scanned Leaf Nodes */}
      <circle cx="24" cy="86" r="6" fill="#10b981" />
      <circle cx="48" cy="86" r="6" fill="#f43f5e" stroke="#fda4af" strokeWidth="1.5" />
      <circle cx="72" cy="86" r="6" fill="#10b981" />
      <circle cx="96" cy="86" r="6" fill="#10b981" />

      {/* Highlight pulse on vulnerable node */}
      <circle cx="48" cy="86" r="10" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
    </svg>
  );
}

/**
 * 2. Vulnerability Detection & Patch Verification Graphic
 */
export function VulnerabilityDetectionGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vulnerability Detection Platform"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />

      {/* Shield Vector */}
      <path
        d="M 60 20 L 92 32 V 60 C 92 80 78 96 60 102 C 42 96 28 80 28 60 V 32 L 60 20 Z"
        fill="#0284c7"
        fillOpacity="0.15"
        stroke="#0284c7"
        strokeWidth="2"
      />

      {/* Core Security Lock/Check */}
      <path
        d="M 48 58 L 56 66 L 74 48"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data Pulse Rings */}
      <circle cx="60" cy="58" r="32" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

/**
 * 3. Software Testing & Automated Fuzzing Graphic
 */
export function SoftwareTestingGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Automated Software Testing & Fuzzing"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />

      {/* Code Window Header */}
      <rect x="22" y="24" width="76" height="72" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <circle cx="32" cy="34" r="3" fill="#f43f5e" />
      <circle cx="42" cy="34" r="3" fill="#eab308" />
      <circle cx="52" cy="34" r="3" fill="#10b981" />

      {/* Test lines */}
      <rect x="32" y="46" width="36" height="4" rx="2" fill="#38bdf8" />
      <rect x="32" y="56" width="48" height="4" rx="2" fill="#10b981" />
      <rect x="32" y="66" width="28" height="4" rx="2" fill="#6366f1" />
      <rect x="32" y="76" width="40" height="4" rx="2" fill="#10b981" />

      {/* Magnifier / Coverage Inspector */}
      <circle cx="76" cy="72" r="14" fill="#0f172a" stroke="#818cf8" strokeWidth="2.5" />
      <path d="M 86 82 L 96 92" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 70 72 L 74 76 L 82 68" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 4. Malware Analysis & Bytecode Entropy Graphic
 */
export function MalwareAnalysisGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Malware & Obfuscated Code Analysis"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />

      {/* Chip Base */}
      <rect x="32" y="32" width="56" height="56" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      
      {/* Microcontroller pins */}
      <path d="M 44 20 V 32 M 60 20 V 32 M 76 20 V 32 M 44 88 V 100 M 60 88 V 100 M 76 88 V 100" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M 20 44 H 32 M 20 60 H 32 M 20 76 H 32 M 88 44 H 100 M 88 60 H 100 M 88 76 H 100" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

      {/* Binary Matrix inside chip */}
      <rect x="42" y="42" width="36" height="36" rx="4" fill="#090d16" />
      <path d="M 48 50 H 72 M 48 60 H 64 M 48 70 H 68" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
      
      {/* Alert Indicator */}
      <circle cx="70" cy="50" r="3" fill="#f43f5e" />
    </svg>
  );
}

/**
 * 5. Code Clone & Similarity Graph Graphic
 */
export function CodeCloneGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Code Clone Analysis"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />

      {/* Document 1 */}
      <rect x="24" y="28" width="40" height="52" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="32" y="38" width="24" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="32" y="46" width="20" height="3" rx="1.5" fill="#38bdf8" />
      <rect x="32" y="54" width="24" height="3" rx="1.5" fill="#38bdf8" />
      <rect x="32" y="62" width="16" height="3" rx="1.5" fill="#94a3b8" />

      {/* Document 2 (Cloned) */}
      <rect x="56" y="40" width="40" height="52" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
      <rect x="64" y="50" width="24" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="64" y="58" width="20" height="3" rx="1.5" fill="#0284c7" />
      <rect x="64" y="66" width="24" height="3" rx="1.5" fill="#0284c7" />
      <rect x="64" y="74" width="16" height="3" rx="1.5" fill="#94a3b8" />

      {/* Similarity Bridge Sync Icon */}
      <path d="M 52 38 C 64 38 64 48 54 58" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  );
}

/**
 * 6. Big Data Research & Telemetry Infrastructure Graphic
 */
export function DataInfrastructureGraphic({ size = 120, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Large Scale Code Telemetry Infrastructure"
    >
      <rect width="120" height="120" rx="16" fill="#0f172a" fillOpacity="0.6" />
      <rect x="0.5" y="0.5" width="119" height="119" rx="15.5" stroke="#1e293b" strokeWidth="1" />

      {/* Stack Layers */}
      <rect x="24" y="26" width="72" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="34" cy="35" r="3" fill="#10b981" />
      <rect x="44" y="33" width="30" height="4" rx="2" fill="#64748b" />

      <rect x="24" y="51" width="72" height="18" rx="4" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="34" cy="60" r="3" fill="#10b981" />
      <rect x="44" y="58" width="40" height="4" rx="2" fill="#64748b" />

      <rect x="24" y="76" width="72" height="18" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
      <circle cx="34" cy="85" r="3" fill="#10b981" />
      <rect x="44" y="83" width="24" height="4" rx="2" fill="#64748b" />

      {/* Connectors */}
      <path d="M 84 44 V 51 M 84 69 V 76" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  );
}

/**
 * Dispatcher helper for research domain graphics
 */
export default function DomainTechnicalGraphic({ domainId, size = 120, className = "" }) {
  switch (domainId) {
    case "cyber-security":
      return <ASTAnalysisGraphic size={size} className={className} />;
    case "vulnerability-detection":
      return <VulnerabilityDetectionGraphic size={size} className={className} />;
    case "software-testing":
      return <SoftwareTestingGraphic size={size} className={className} />;
    case "malware-analysis":
      return <MalwareAnalysisGraphic size={size} className={className} />;
    case "code-clone":
      return <CodeCloneGraphic size={size} className={className} />;
    case "data-infra":
    default:
      return <DataInfrastructureGraphic size={size} className={className} />;
  }
}
