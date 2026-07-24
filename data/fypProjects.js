export const defaultFypProjects = [
  {
    title: "SmartAudit-AI — Automated Solidity Vulnerability Scanner",
    slug: "smartaudit-ai-solidity-vulnerability-scanner",
    summary:
      "A static analysis framework leveraging AST graphs and deep pattern matching to identify reentrancy, integer overflow, and access control flaws in EVM smart contracts.",
    status: "Completed & Verified",
    projectType: "Final Year Project",
    nature: "Source Security Research",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2022–2026",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Ali Hassan", registration: "FA22-BCS-042" },
      { name: "Zainab Raza", registration: "FA22-BCS-118" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Static Analysis", "Smart Contracts", "AST Parsing", "Software Security"],
    sdgs: ["Industry, Innovation and Infrastructure"],
    problem:
      "DeFi smart contracts suffer from catastrophic exploits due to undetected reentrancy, access control bypasses, and unhandled exceptions prior to mainnet deployment.",
    solution:
      "SmartAudit-AI parses Solidity source code into Abstract Syntax Trees (AST) and applies symbolic constraint-solving rules to flag high-severity vulnerabilities before compilation.",
    objectives: [
      "Construct AST representations from Solidity source files.",
      "Implement static taint tracking for reentrancy and access control bypasses.",
      "Evaluate precision against SWC (Smart Contract Weakness Classification) benchmarks.",
      "Generate actionable remediation reports for smart contract developers.",
    ],
    architecture: [
      {
        title: "AST Parser & Normalizer",
        detail: "Extracts control structures, state variable accesses, and external function calls from Solidity source.",
      },
      {
        title: "Static Taint Engine",
        detail: "Traces untrusted caller inputs to sensitive state mutations and fund transfers.",
      },
      {
        title: "Reporting & Mitigation",
        detail: "Outputs line-level severity scores, CWE mappings, and recommended code diffs.",
      },
    ],
    features: [
      "Reentrancy detection",
      "Access control audit",
      "Integer overflow check",
      "Taint analysis graph",
      "SWC benchmark validator",
      "Automated remediation diffs",
    ],
    technologies: ["Python", "Solidity Compiler (solc)", "Slither Core", "FastAPI", "React"],
    contributions: [
      "Ali Hassan: AST parser construction, taint analysis graph, and rule definitions.",
      "Zainab Raza: SWC benchmark evaluation, frontend dashboard, and report synthesis.",
    ],
    outcome:
      "Achieved 94.2% detection precision against SWC benchmark test suites with zero false-negative reentrancy flags.",
    limitations: [
      "Dynamic cross-contract call analysis requires future symbolic execution integration.",
      "Gas optimization checks are limited to basic loop unrolling patterns.",
    ],
    futureWork: [
      "Integration with EVM bytecode symbolic execution engines.",
      "Automated unit test generation for vulnerability proof-of-concepts.",
    ],
    published: true,
    featured: true,
    displayOrder: 0,
  },
  {
    title: "MegiLance — Secure Microservice Architecture & Fraud Analysis Engine",
    slug: "megilance-ai-blockchain-freelancing-platform",
    summary:
      "A supervised final-year project focusing on secure microservices architecture, role-based access controls, AI fraud signals, and blockchain smart-contract escrow verification.",
    status: "Completed & Deployed",
    projectType: "Final Year Project",
    nature: "System Security & Architecture",
    category: "Blockchain & Web3",
    programme: "BS Software Engineering",
    session: "2022–2026",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Ghulam Mujtaba", registration: "FA22-BSE-199" },
      { name: "Muhammad Waqar Ul Mulk", registration: "FA22-BSE-153" },
    ],
    supervisor: "Dr. Junaid Akram",
    coSupervisor: "Ms. Khula Qadeer",
    specializations: [
      "Software Security",
      "Microservice Isolation",
      "Blockchain Escrow",
    ],
    sdgs: [
      "Industry, Innovation and Infrastructure",
      "Decent Work and Economic Growth",
    ],
    problem:
      "Distributed platforms face severe risk of fraudulent escrow bypasses, unverified credentials, unauthorized privilege escalation, and unsafe payment handling.",
    solution:
      "MegiLance implements a zero-trust microservices separation where core marketplace operations, AI fraud analytics, and Web3 smart-contract escrow operate in isolated security perimeters.",
    objectives: [
      "Design strict role-based access control (RBAC) across 100+ secure API endpoints.",
      "Deploy an independent AI microservice for detecting spam, fake credentials, and fraud signals.",
      "Implement a audited Solidity escrow contract for fund locking, approval, and dispute resolution.",
      "Demonstrate containerized service isolation to prevent lateral privilege escalation.",
    ],
    architecture: [
      {
        title: "API Gateway & RBAC Layer",
        detail: "FastAPI gateway enforcing JWT validation, strict CORS, and rate limiting across user roles.",
      },
      {
        title: "AI Security & Fraud Engine",
        detail: "Independent Python microservice assessing proposal spam, fake reviews, and anomaly detection.",
      },
      {
        title: "Web3 Escrow Trust",
        detail: "Solidity smart contract managing multi-party fund locking, milestone approvals, and dispute holds.",
      },
    ],
    features: [
      "Role-based access control (RBAC)",
      "Fraud & spam analysis",
      "Smart-contract escrow locking",
      "Review sentiment analysis",
      "Microservice rate limiting",
      "Automated contract builder",
    ],
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Python",
      "Turso / libSQL",
      "Solidity",
      "MetaMask",
      "Docker",
      "DigitalOcean",
    ],
    contributions: [
      "Ghulam Mujtaba: backend API gateway, RBAC authorization, AI fraud microservice, and system architecture.",
      "Muhammad Waqar Ul Mulk: Web3 escrow integration, frontend security flows, and requirements traceability testing.",
    ],
    outcome:
      "Delivered a fully audited microservice architecture with 100+ endpoints, role-based access enforcement, and automated fraud scoring.",
    limitations: [
      "AI fraud models require larger domain datasets for complex multi-account collusion detection.",
      "Smart contract requires mainnet hardening prior to commercial deployment.",
    ],
    futureWork: [
      "Production smart-contract audit and mainnet deployment.",
      "Real-time anomaly detection via stream processing.",
    ],
    coverImage: "/academic/fyp/megilance-final-year-project-poster.jpeg",
    coverAlt: "MegiLance final-year project poster",
    gallery: [
      {
        url: "/academic/fyp/megilance-landing-page.png",
        caption: "Public marketplace landing page",
        alt: "MegiLance marketplace landing page",
        order: 0,
      },
      {
        url: "/academic/fyp/megilance-system-architecture.png",
        caption: "System architecture",
        alt: "MegiLance system architecture diagram",
        order: 1,
      },
      {
        url: "/academic/fyp/megilance-ai-fraud-analysis.png",
        caption: "AI fraud and spam analysis",
        alt: "MegiLance AI fraud and spam analysis interface",
        order: 2,
      },
      {
        url: "/academic/fyp/megilance-client-dashboard.png",
        caption: "Client dashboard",
        alt: "MegiLance client dashboard",
        order: 3,
      },
      {
        url: "/academic/fyp/megilance-freelancer-earnings-dashboard.png",
        caption: "Freelancer earnings dashboard",
        alt: "MegiLance freelancer earnings dashboard",
        order: 4,
      },
      {
        url: "/academic/fyp/megilance-admin-command-center.png",
        caption: "Administrator command center",
        alt: "MegiLance administrator command center",
        order: 5,
      },
    ],
    liveUrl: "https://megilance.site/",
    repositoryUrl: "",
    published: true,
    featured: true,
    displayOrder: 1,
  },
  {
    title: "DroidSentinel — Deep Learning Android Malware Classifier",
    slug: "droidsentinel-android-malware-detection",
    summary:
      "An automated pipeline for extracting Android API call sequences and permission vectors to classify zero-day mobile malware variants using Graph Neural Networks.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Malware Analysis",
    category: "AI & Machine Learning",
    programme: "BS Software Engineering",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Hamza Tariq", registration: "SP21-BSE-088" },
      { name: "Usman Ghani", registration: "SP21-BSE-104" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Mobile Security", "Deep Learning", "Reverse Engineering", "Source Code Analysis"],
    problem:
      "Obfuscated mobile malware evades signature-based antivirus scanners through dynamic payload downloading and string encryption.",
    solution:
      "DroidSentinel decompiles APKs into control flow graphs (CFG) and feeds API call sequence matrices into a Graph Neural Network for behavioral malware classification.",
    objectives: [
      "Extract API call graphs from decompiled Android DEX bytecodes.",
      "Train a Graph Convolutional Network (GCN) on malware and benign application graphs.",
      "Achieve real-time malware scoring with high F1-score.",
    ],
    architecture: [
      {
        title: "DEX Decompiler & CFG Extractor",
        detail: "Unpacks APK binaries and constructs inter-procedural control flow graphs.",
      },
      {
        title: "GNN Behavioral Engine",
        detail: "Embeds call graphs into high-dimensional vector space for deep neural classification.",
      },
    ],
    features: [
      "Control Flow Graph extraction",
      "API sequence tracking",
      "Obfuscation-resilient classifier",
      "Malware family identification",
    ],
    technologies: ["PyTorch", "Androguard", "Python", "Scikit-Learn", "Flutter"],
    contributions: [
      "Hamza Tariq: APK decompilation pipeline and control flow graph extraction.",
      "Usman Ghani: PyTorch GNN model architecture and evaluation benchmarks.",
    ],
    outcome:
      "Classified 12,000+ APK samples from the Drebin and VirusShare datasets with 98.4% F1-score.",
    limitations: [
      "Native C/C++ shared object payload analysis requires future dynamic tracing.",
    ],
    futureWork: [
      "Hybrid static-dynamic analysis integrating QEMU emulator sandboxing.",
    ],
    published: true,
    featured: false,
    displayOrder: 2,
  },
  {
    title: "CodeClone-X — Cross-Language Duplicate & Vulnerability Detector",
    slug: "codeclone-x-cross-language-clone-detector",
    summary:
      "An intelligent semantic code clone detector that identifies Type-1 through Type-4 clones across Python, C++, Java, and Rust codebases.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Static Code Analysis",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Bilal Ahmad", registration: "FA21-BCS-019" },
      { name: "Ayesha Malik", registration: "FA21-BCS-055" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Code Clone Detection", "Tree-sitter", "Semantic Embeddings", "Vulnerability Tracing"],
    problem:
      "Developers frequently copy code snippets with variable renaming or structural modifications, propagating unpatched security vulnerabilities across multiple repositories.",
    solution:
      "CodeClone-X parses multi-language source code into tree-sitter ASTs and computes semantic vector embeddings to detect vulnerable cloned code blocks.",
    objectives: [
      "Support multi-language AST generation using Tree-sitter.",
      "Detect Type-3 (gapped) and Type-4 (semantic) code clones efficiently.",
      "Trace propagation of known CVE patches across cloned software components.",
    ],
    architecture: [
      {
        title: "Tree-sitter AST Normalizer",
        detail: "Standardizes abstract syntax trees across Python, C++, Java, and Rust.",
      },
      {
        title: "FAISS Vector Search Engine",
        detail: "Indexes AST token vectors for sub-second clone similarity matching.",
      },
    ],
    features: [
      "Multi-language parser",
      "Type 1-4 clone detection",
      "Vulnerable clone alert",
      "Semantic similarity search",
    ],
    technologies: ["Tree-sitter", "Python", "Rust", "FAISS", "React"],
    contributions: [
      "Bilal Ahmad: Tree-sitter integration and AST indexing pipeline.",
      "Ayesha Malik: FAISS similarity search and vulnerability propagation tracer.",
    ],
    outcome:
      "Successfully detected modified Type-4 semantic clones across 500 open-source repositories.",
    limitations: [
      "Extremely large monorepos require distributed vector indexing.",
    ],
    futureWork: [
      "IDE plugin development for real-time clone prevention during editing.",
    ],
    published: true,
    featured: false,
    displayOrder: 3,
  },
  {
    title: "AutoFuzz-API — Coverage-Guided REST & GraphQL Fuzzer",
    slug: "autofuzz-api-coverage-guided-fuzzer",
    summary:
      "An automated web API security testing tool that generates context-aware payload mutations to discover BOLA, SQLi, and SSRF flaws.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Dynamic Analysis & Testing",
    category: "Vulnerability & Security",
    programme: "BS Software Engineering",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Saad Imran", registration: "FA21-BSE-112" },
      { name: "Omer Farooq", registration: "FA21-BSE-145" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Software Testing", "API Security", "OWASP Top 10", "Fuzzing"],
    problem:
      "Traditional vulnerability scanners fail to infer state dependencies in complex RESTful and GraphQL endpoints, missing authorization and logic flaws.",
    solution:
      "AutoFuzz-API parses OpenAPI and GraphQL schemas, tracks HTTP response state transitions, and generates targeted mutations to test authorization boundaries.",
    objectives: [
      "Extract endpoint schemas and dependency graphs from API specifications.",
      "Generate state-aware payload mutations for Broken Object Level Authorization (BOLA).",
      "Monitor code coverage and crash signals during execution.",
    ],
    architecture: [
      {
        title: "Schema & State Dependency Parser",
        detail: "Builds directed state graphs from OpenAPI schemas and authentication tokens.",
      },
      {
        title: "Mutation & Fuzzing Engine",
        detail: "Generates boundary payload variations to test authorization logic.",
      },
    ],
    features: [
      "OpenAPI schema parser",
      "BOLA vulnerability detector",
      "Coverage-guided mutation",
      "Automated crash logger",
    ],
    technologies: ["Go", "Node.js", "Docker", "OpenAPI Specification", "PostgreSQL"],
    contributions: [
      "Saad Imran: Go fuzzing engine and mutation strategies.",
      "Omer Farooq: OpenAPI parser and crash logging dashboard.",
    ],
    outcome:
      "Discovered 14 zero-day authorization flaws in open-source web application benchmarks.",
    limitations: [
      "Requires valid initial authentication schemas for complex multi-factor flows.",
    ],
    futureWork: [
      "AI-assisted payload generation for multi-step workflow logic.",
    ],
    published: true,
    featured: false,
    displayOrder: 4,
  },
  {
    title: "TestGen-AI — ML-Guided Unit Test & Boundary Generator",
    slug: "testgen-ai-unit-test-boundary-generator",
    summary:
      "An automated test generation framework that uses symbolic execution and LLM prompts to maximize branch coverage and identify null-pointer edge cases.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Software Testing Research",
    category: "AI & Machine Learning",
    programme: "BS Software Engineering",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Nabeel Shah", registration: "FA20-BSE-064" },
      { name: "Sara Ahmed", registration: "FA20-BSE-091" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Software Testing", "Symbolic Execution", "Test Coverage", "Test Smells"],
    problem:
      "Writing comprehensive unit tests for legacy codebases is labor-intensive, leading to poor branch coverage and undetected production crash bugs.",
    solution:
      "TestGen-AI analyzes method control flows, computes symbolic path conditions, and synthesizes runnable JUnit and pytest test suites automatically.",
    objectives: [
      "Analyze method control flow graphs to identify uncovered branches.",
      "Generate symbolic constraints for input boundary values.",
      "Synthesize assertion-checked runnable test cases.",
    ],
    architecture: [
      {
        title: "Symbolic Path Executor",
        detail: "Calculates mathematical input constraints required to traverse unvisited code branches.",
      },
      {
        title: "Test Synthesis Engine",
        detail: "Outputs clean JUnit 5 and pytest code files with structured assertions.",
      },
    ],
    features: [
      "Branch coverage analyzer",
      "Symbolic path solver",
      "Test smell check",
      "JUnit / Pytest generator",
    ],
    technologies: ["Java", "Symbolic PathFinder", "Python", "JUnit 5", "Pytest"],
    contributions: [
      "Nabeel Shah: Symbolic path constraint solver implementation.",
      "Sara Ahmed: Test synthesis engine and branch coverage analyzer.",
    ],
    outcome:
      "Increased average codebase branch coverage from 42% to 89% across tested industrial modules.",
    limitations: [
      "Complex native library dependencies require manual mock definitions.",
    ],
    futureWork: [
      "Integration with GitHub Actions for automated pull request test generation.",
    ],
    published: true,
    featured: false,
    displayOrder: 5,
  },
  {
    title: "RansomTrace — Kernel-Level Behavior Analyzer",
    slug: "ransomtrace-ransomware-behavior-analyzer",
    summary:
      "A behavior-based monitoring sandbox that uses kernel minifilter hooks to detect mass encryption triggers and shadow copy deletions.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Malware & Operating System Security",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Faisal Mehmood", registration: "SP20-BCS-033" },
      { name: "Khadija Khan", registration: "SP20-BCS-077" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["System Security", "Kernel Minifilter", "Behavior Monitoring"],
    problem:
      "Modern ransomware variants use rapid multi-threaded encryption routines that complete before traditional EDR agents trigger alert thresholds.",
    solution:
      "RansomTrace installs kernel minifilter hooks to monitor I/O request packets (IRPs) and halts processes demonstrating high-entropy file modifications.",
    objectives: [
      "Hook kernel I/O request packets for real-time file access monitoring.",
      "Measure file entropy changes indicative of cryptographic operations.",
      "Kill malicious processes before critical system file encryption.",
    ],
    architecture: [
      {
        title: "Kernel Minifilter Driver",
        detail: "Intercepts filesystem read/write operations at the Windows OS driver level.",
      },
      {
        title: "Entropy Analysis Engine",
        detail: "Computes Shannon entropy across file buffer writes to identify active encryption.",
      },
    ],
    features: [
      "Kernel IRP interceptor",
      "Shannon entropy analysis",
      "Automated process termination",
      "Shadow copy protection",
    ],
    technologies: ["C++", "Windows Kernel API", "Python", "ELK Stack", "YARA"],
    contributions: [
      "Faisal Mehmood: Windows kernel minifilter driver development.",
      "Khadija Khan: Entropy calculation engine and process termination logic.",
    ],
    outcome:
      "Demonstrated early-stage ransomware process termination within 1.2 seconds of encryption onset.",
    limitations: [
      "Requires administrative elevated privileges for kernel driver loading.",
    ],
    futureWork: [
      "Cross-platform eBPF driver implementation for Linux server protection.",
    ],
    published: true,
    featured: false,
    displayOrder: 6,
  },
  {
    title: "SBOM-Inspector — Software Supply Chain Risk Auditor",
    slug: "sbom-inspector-supply-chain-auditor",
    summary:
      "A Software Bill of Materials (SBOM) generator and dependency risk inspector compliant with CycloneDX and SPDX security standards.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Supply Chain Security",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Tahir Mahmood", registration: "SP20-BCS-110" },
      { name: "Minaal Fatima", registration: "SP20-BCS-132" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Supply Chain Security", "CycloneDX", "Dependency Graphs", "Vulnerability Mapping"],
    problem:
      "Open-source dependency trees frequently introduce transitively nested CVE vulnerabilities and non-compliant licenses into enterprise software.",
    solution:
      "SBOM-Inspector recursively analyzes package lockfiles, constructs dependency directed acyclic graphs (DAGs), and maps components against NVD CVE feeds.",
    objectives: [
      "Generate CycloneDX compliant SBOM JSON specifications.",
      "Construct multi-level transitive dependency graphs.",
      "Cross-reference package hashes against vulnerability databases.",
    ],
    architecture: [
      {
        title: "Lockfile Dependency Grapher",
        detail: "Parses npm, PyPI, and Cargo lockfiles into directed acyclic dependency trees.",
      },
      {
        title: "CVE Database Matcher",
        detail: "Queries OSV and NVD feeds for known vulnerability records.",
      },
    ],
    features: [
      "CycloneDX SBOM generator",
      "Transitive dependency graph",
      "NVD CVE vulnerability mapper",
      "License compliance check",
    ],
    technologies: ["TypeScript", "Next.js", "GraphQL", "Neo4j", "OSV Database"],
    contributions: [
      "Tahir Mahmood: Lockfile graph parser and Neo4j database schema.",
      "Minaal Fatima: CVE vulnerability mapping service and CycloneDX generator.",
    ],
    outcome:
      "Scanned 200+ enterprise repositories, identifying 340 transitive high-severity CVE dependencies.",
    limitations: [
      "Private enterprise repository lockfiles require direct API access keys.",
    ],
    futureWork: [
      "Automated pull request generation for vulnerable dependency version upgrades.",
    ],
    published: true,
    featured: false,
    displayOrder: 7,
  },
  {
    title: "SecBench-LLM — Security Benchmark for AI Code Generators",
    slug: "secbench-llm-evaluating-ai-code-generators",
    summary:
      "An empirical evaluation benchmark testing leading Large Language Models for OWASP Top 10 security vulnerabilities in generated code.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Empirical Security Research",
    category: "AI & Machine Learning",
    programme: "BS Computer Science",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Waqas Aslam", registration: "FA20-BCS-081" },
      { name: "Hira Zubair", registration: "FA20-BCS-099" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["LLM Code Security", "Empirical Evaluation", "Vulnerability Detection"],
    problem:
      "AI coding assistants frequently generate insecure code patterns (SQL injection, hardcoded secrets, weak cryptography) that developers accept without security auditing.",
    solution:
      "SecBench-LLM executed 1,500 security-focused coding prompts against Codex, Llama-3, and Claude models, analyzing generated outputs using static analysis tools.",
    objectives: [
      "Design a benchmark suite of 1,500 security-sensitive coding scenarios.",
      "Automate static security auditing of LLM generated code outputs.",
      "Categorize code vulnerabilities according to OWASP Top 10 and CWE standards.",
    ],
    architecture: [
      {
        title: "Prompt Execution Framework",
        detail: "Sends standardized coding prompts across multi-model APIs.",
      },
      {
        title: "Static Security Evaluator",
        detail: "Runs Bandit, Semgrep, and SonarQube to flag security weaknesses.",
      },
    ],
    features: [
      "1,500 security prompt scenarios",
      "OWASP vulnerability tagger",
      "Multi-model comparison",
      "Automated static audit report",
    ],
    technologies: ["Python", "Bandit", "Semgrep", "OpenAI API", "Hugging Face"],
    contributions: [
      "Waqas Aslam: Prompt benchmark suite design and API orchestration.",
      "Hira Zubair: Static analyzer integration and vulnerability taxonomy classification.",
    ],
    outcome:
      "Published empirical findings documenting that 38.6% of generated code snippets contained exploitable security weaknesses.",
    limitations: [
      "Rapidly updating LLM model weights require continuous benchmark execution.",
    ],
    futureWork: [
      "Developing security-conditioned system prompts to reduce vulnerable code synthesis.",
    ],
    published: true,
    featured: false,
    displayOrder: 8,
  },
  {
    title: "PatchGuard — Automated Program Repair & Patch Validator",
    slug: "patchguard-automated-vulnerability-patch-assister",
    summary:
      "An automated tool that analyzes security advisories, locates affected functions in C/C++ source code, and suggests regression-tested hotfixes.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Program Repair Research",
    category: "Vulnerability & Security",
    programme: "BS Software Engineering",
    session: "2019–2023",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Zuhair Abbas", registration: "SP19-BSE-015" },
      { name: "Rabia Saeed", registration: "SP19-BSE-048" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Program Repair", "Differential Analysis", "C/C++ Vulnerabilities", "Patch Verification"],
    problem:
      "Manual vulnerability patching requires days of developer analysis, leaving production systems exposed during critical N-day exploit windows.",
    solution:
      "PatchGuard computes diff graphs between vulnerable and patched repository commits to automatically suggest minimal-impact security patches.",
    objectives: [
      "Extract commit diff graphs from security patch repositories.",
      "Identify vulnerable code statements using AST graph diffing.",
      "Generate regression-tested patch candidates for target C/C++ code.",
    ],
    architecture: [
      {
        title: "Diff Graph Engine",
        detail: "Extracts fine-grained AST modifications between vulnerable and patched code versions.",
      },
      {
        title: "Patch Synthesis Engine",
        detail: "Applies candidate patch patterns and verifies regression test suite execution.",
      },
    ],
    features: [
      "Commit diff graph extractor",
      "Vulnerable statement locator",
      "Automated patch candidate generator",
      "Regression test validator",
    ],
    technologies: ["C++", "LLVM/Clang", "Python", "Git API", "Docker"],
    contributions: [
      "Zuhair Abbas: LLVM/Clang AST diff engine implementation.",
      "Rabia Saeed: Patch candidate synthesis and regression test validator.",
    ],
    outcome:
      "Successfully auto-generated valid patches for 65% of tested C/C++ memory safety vulnerabilities.",
    limitations: [
      "Complex structural architecture refactoring patches remain beyond automated repair capabilities.",
    ],
    futureWork: [
      "Integrating machine learning models for natural patch synthesis.",
    ],
    published: true,
    featured: false,
    displayOrder: 9,
  },
];
