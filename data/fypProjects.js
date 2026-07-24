export const defaultFypProjects = [
  {
    title: "MegiLance — AI and Blockchain-Powered Freelancing Platform",
    slug: "megilance-ai-blockchain-freelancing-platform",
    summary:
      "A supervised final-year project combining a full-stack freelancing marketplace with AI-assisted decisions and blockchain-based payment trust.",
    status: "Completed & Deployed",
    projectType: "Final Year Project",
    nature: "Development & Security",
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
      "Artificial Intelligence",
      "Blockchain",
      "Web Development",
    ],
    sdgs: [
      "Industry, Innovation and Infrastructure",
      "Decent Work and Economic Growth",
    ],
    problem:
      "Freelancers face restricted payment access, high transaction costs, weak trust signals, unclear pricing, and ranking systems that can disadvantage capable newcomers.",
    solution:
      "MegiLance combines a conventional Web2 marketplace with a separate AI service layer and blockchain escrow concepts. Clients can post work, compare proposals, fund engagements, approve delivery, and review outcomes while freelancers manage profiles, proposals, delivery, earnings, and reputation.",
    objectives: [
      "Build a complete marketplace for clients, freelancers, and administrators.",
      "Use AI for pricing, talent matching, sentiment analysis, fraud signals, skill analysis, and support.",
      "Design smart-contract escrow for transparent fund locking and release.",
      "Support secure role-based authentication, disputes, reviews, and payment workflows.",
      "Demonstrate a scalable separation between marketplace, intelligence, and Web3 services.",
    ],
    architecture: [
      {
        title: "Web2 marketplace",
        detail: "Next.js portals and FastAPI services for users, projects, proposals, contracts, reviews, disputes, and administration.",
      },
      {
        title: "AI intelligence",
        detail: "Independent services for matching, pricing, sentiment, fraud analysis, skill insights, and conversational assistance.",
      },
      {
        title: "Web3 trust layer",
        detail: "Solidity and wallet-integration concepts for escrow funding, approval, dispute handling, and stablecoin release.",
      },
    ],
    features: [
      "AI chatbot",
      "Price estimator",
      "Proposal writer",
      "Rate advisor",
      "Scope planner",
      "Skill analyzer",
      "Income calculator",
      "Expense and tax calculator",
      "Invoice generator",
      "Contract builder",
      "Fraud and spam analysis",
      "Review sentiment analysis",
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
      "Ghulam Mujtaba: system architecture, backend development, AI microservice, database design, and authentication.",
      "Muhammad Waqar Ul Mulk: frontend development, blockchain and Web3 integration, requirements traceability, and end-to-end testing.",
    ],
    outcome:
      "The final report documents a working marketplace with more than 100 backend endpoints, 80+ frontend pages, 20+ data models, role-based portals, AI-assisted tools, and a Dockerized deployment.",
    limitations: [
      "AI models use lightweight or fallback approaches and need larger domain-specific datasets.",
      "Blockchain functionality requires a production security audit and mainnet hardening.",
      "Large-scale concurrency and formal usability testing remain future validation work.",
    ],
    futureWork: [
      "Production-grade smart-contract deployment and audit",
      "Domain-trained matching and pricing models",
      "Real-time communication",
      "Urdu and additional language support",
      "Native mobile applications",
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
      {
        url: "/academic/fyp/megilance-ai-matching.png",
        caption: "AI matching interaction",
        alt: "MegiLance AI matching interaction",
        order: 6,
      },
      {
        url: "/academic/fyp/megilance-ai-features.png",
        caption: "AI feature directory",
        alt: "MegiLance AI feature directory",
        order: 7,
      },
    ],
    liveUrl: "https://megilance.site/",
    repositoryUrl: "",
    published: true,
    featured: true,
    displayOrder: 0,
  },
  {
    title: "SmartAudit-AI — Automated Solidity Vulnerability Scanner",
    slug: "smartaudit-ai-solidity-vulnerability-scanner",
    summary:
      "A static analysis framework leveraging AST graphs and deep pattern matching to identify reentrancy, integer overflow, and access control flaws in EVM smart contracts.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Security Research",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2022–2026",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Ali Hassan", registration: "FA22-BCS-042" },
      { name: "Zainab Raza", registration: "FA22-BCS-118" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Static Analysis", "Smart Contracts", "AST Parsing"],
    problem:
      "DeFi smart contracts suffer from catastrophic exploits due to undetected reentrancy and access control flaws prior to deployment.",
    solution:
      "SmartAudit-AI parses Solidity code into Abstract Syntax Trees (AST) and runs constraint-solving rules to flag high-severity vulnerabilities before compilation.",
    technologies: ["Python", "Solidity Compiler (solc)", "Slither Core", "React", "FastAPI"],
    outcome:
      "Achieved 94.2% detection precision against SWC (Smart Contract Weakness Classification) benchmark test suites.",
    published: true,
    featured: false,
    displayOrder: 1,
  },
  {
    title: "DroidSentinel — Deep Learning Android Malware Detection",
    slug: "droidsentinel-android-malware-detection",
    summary:
      "An automated pipeline for extracting Android API call sequences and permission vectors to classify zero-day mobile malware variants using Graph Neural Networks.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Research & Development",
    category: "AI & Machine Learning",
    programme: "BS Software Engineering",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Hamza Tariq", registration: "SP21-BSE-088" },
      { name: "Usman Ghani", registration: "SP21-BSE-104" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Mobile Security", "Deep Learning", "Reverse Engineering"],
    problem:
      "Obfuscated mobile malware evades signature-based antivirus scanners through dynamic payload downloading.",
    solution:
      "DroidSentinel decompiles APKs into control flow graphs and feeds call sequence matrices into a GNN model for behavior-based classification.",
    technologies: ["PyTorch", "Androguard", "Python", "Scikit-Learn", "Flutter"],
    outcome:
      "Classified 12,000+ APK samples from the Drebin and VirusShare datasets with 98.4% F1-score.",
    published: true,
    featured: false,
    displayOrder: 2,
  },
  {
    title: "CodeClone-X — Cross-Language Duplicate & Plagiarism Inspector",
    slug: "codeclone-x-cross-language-clone-detector",
    summary:
      "An intelligent semantic code clone detector that identifies Type-1 through Type-4 clones across Python, C++, Java, and Rust codebases.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Static Analysis",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Bilal Ahmad", registration: "FA21-BCS-019" },
      { name: "Ayesha Malik", registration: "FA21-BCS-055" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Code Clone Detection", "Tree-sitter", "Semantic Vectors"],
    problem:
      "Developers frequently copy code snippets with variable renaming or structural changes, propagating security vulnerabilities across different repositories.",
    solution:
      "CodeClone-X converts multi-language source code into standardized AST representations and computes semantic embeddings to flag cloned vulnerable code blocks.",
    technologies: ["Tree-sitter", "Python", "Rust", "FAISS", "React"],
    outcome:
      "Successfully detected modified Type-4 semantic clones across 500 open-source repositories.",
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
    nature: "Dynamic Analysis",
    category: "Full-Stack & Systems",
    programme: "BS Software Engineering",
    session: "2021–2025",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Saad Imran", registration: "FA21-BSE-112" },
      { name: "Omer Farooq", registration: "FA21-BSE-145" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Fuzzing", "API Security", "OWASP Top 10"],
    problem:
      "Traditional web vulnerability scanners fail to infer state dependencies in complex RESTful and GraphQL endpoints, missing critical logic bugs.",
    solution:
      "AutoFuzz-API parses OpenAPI and GraphQL schemas, tracks HTTP response states, and generates targeted mutations to test authorization boundaries.",
    technologies: ["Go", "Node.js", "Docker", "OpenAPI Specification", "PostgreSQL"],
    outcome:
      "Discovered 14 zero-day authorization flaws in open-source web application benchmarks.",
    published: true,
    featured: false,
    displayOrder: 4,
  },
  {
    title: "RansomTrace — Cross-Platform Ransomware Behavior Analyzer",
    slug: "ransomtrace-ransomware-behavior-analyzer",
    summary:
      "A dynamic sandbox environment for monitoring file system encryption triggers, shadow copy deletions, and C2 beaconing activities.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Malware Research",
    category: "Vulnerability & Security",
    programme: "BS Computer Science",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Faisal Mehmood", registration: "SP20-BCS-033" },
      { name: "Khadija Khan", registration: "SP20-BCS-077" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Ransomware Analysis", "Kernel Drivers", "Behavior Monitoring"],
    problem:
      "Modern ransomware variants use rapid multi-threaded encryption routines that complete before traditional EDR agents trigger alert thresholds.",
    solution:
      "RansomTrace installs kernel minifilter hooks to monitor I/O request packets (IRPs) and halts processes demonstrating high-entropy mass file modifications.",
    technologies: ["C++", "Windows Kernel API", "Python", "ELK Stack", "YARA"],
    outcome:
      "Demonstrated early-stage ransomware process termination within 1.2 seconds of encryption onset.",
    published: true,
    featured: false,
    displayOrder: 5,
  },
  {
    title: "TestGen-AI — ML-Guided Unit Test & Boundary Generator",
    slug: "testgen-ai-unit-test-boundary-generator",
    summary:
      "An automated test generation framework that uses symbolic execution and LLM prompts to maximize branch coverage and identify null-pointer edge cases.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Software Testing",
    category: "AI & Machine Learning",
    programme: "BS Software Engineering",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Nabeel Shah", registration: "FA20-BSE-064" },
      { name: "Sara Ahmed", registration: "FA20-BSE-091" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Software Testing", "Symbolic Execution", "Test Coverage"],
    problem:
      "Writing comprehensive unit tests for legacy codebases is time-consuming, resulting in low branch coverage and undetected production crashes.",
    solution:
      "TestGen-AI analyzes method control flows, computes symbolic path conditions, and synthesizes runnable JUnit and pytest test suites automatically.",
    technologies: ["Java", "Symbolic PathFinder", "Python", "JUnit 5", "Pytest"],
    outcome:
      "Increased average codebase branch coverage from 42% to 89% across tested industrial modules.",
    published: true,
    featured: false,
    displayOrder: 6,
  },
  {
    title: "SBOM-Inspector — Supply Chain Vulnerability Auditor",
    slug: "sbom-inspector-supply-chain-auditor",
    summary:
      "A Software Bill of Materials (SBOM) generator and dependency risk inspector compliant with CycloneDX and SPDX standards.",
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
    specializations: ["Supply Chain Security", "CycloneDX", "Dependency Graph"],
    problem:
      "Open-source dependency trees frequently introduce transitively nested CVE vulnerabilities and non-compliant software licenses into commercial products.",
    solution:
      "SBOM-Inspector recursively analyzes npm, PyPI, and Cargo lockfiles, constructs dependency directed acyclic graphs (DAGs), and maps components against NVD CVE feeds.",
    technologies: ["TypeScript", "Next.js", "GraphQL", "Neo4j", "OSV Database"],
    outcome:
      "Scanned 200+ enterprise repositories, identifying 340 transitive high-severity CVE dependencies.",
    published: true,
    featured: false,
    displayOrder: 7,
  },
  {
    title: "SecBench-LLM — Evaluating AI Code Generators for Security Flaws",
    slug: "secbench-llm-evaluating-ai-code-generators",
    summary:
      "An empirical evaluation benchmark testing leading Large Language Models for OWASP Top 10 security vulnerabilities in generated code.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Empirical Security Benchmark",
    category: "AI & Machine Learning",
    programme: "BS Computer Science",
    session: "2020–2024",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Waqas Aslam", registration: "FA20-BCS-081" },
      { name: "Hira Zubair", registration: "FA20-BCS-099" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["LLM Security", "Empirical Evaluation", "Code Vulnerability"],
    problem:
      "AI coding assistants frequently generate insecure code patterns (SQL injection, hardcoded secrets, weak cryptography) that developers accept without auditing.",
    solution:
      "SecBench-LLM executed 1,500 security-focused coding prompts against Codex, Llama-3, and Claude models, analyzing output using static analysis tools.",
    technologies: ["Python", "Bandit", "Semgrep", "OpenAI API", "Hugging Face"],
    outcome:
      "Published empirical findings documenting that 38.6% of generated code snippets contained exploitable security weaknesses.",
    published: true,
    featured: false,
    displayOrder: 8,
  },
  {
    title: "PatchGuard — Automated Vulnerability Patch Assister",
    slug: "patchguard-automated-vulnerability-patch-assister",
    summary:
      "An automated tool that analyzes security advisories, locates affected functions in C/C++ source code, and suggests regression-tested hotfixes.",
    status: "Completed",
    projectType: "Final Year Project",
    nature: "Program Repair",
    category: "Vulnerability & Security",
    programme: "BS Software Engineering",
    session: "2019–2023",
    institution: "COMSATS University Islamabad, Lahore Campus",
    students: [
      { name: "Zuhair Abbas", registration: "SP19-BSE-015" },
      { name: "Rabia Saeed", registration: "SP19-BSE-048" },
    ],
    supervisor: "Dr. Junaid Akram",
    specializations: ["Program Repair", "Differential Analysis", "C/C++ Security"],
    problem:
      "Manual vulnerability patching requires days of developer analysis, leaving systems exposed to N-day exploit windows.",
    solution:
      "PatchGuard computes diff graphs between vulnerable and patched repository commits to automatically suggest minimal-impact security patches.",
    technologies: ["C++", "LLVM/Clang", "Python", "Git API", "Docker"],
    outcome:
      "Successfully auto-generated valid patches for 65% of tested C/C++ memory safety vulnerabilities.",
    published: true,
    featured: false,
    displayOrder: 9,
  },
];
