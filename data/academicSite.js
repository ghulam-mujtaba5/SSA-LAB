export const academicProfile = {
  name: "Junaid Akram, PhD",
  shortName: "Junaid Akram",
  role: "Assistant Professor",
  institution: "COMSATS University Islamabad, Lahore Campus",
  lab: "Source Code Security Assessment Lab",
  labShort: "SCSA Research Lab",
  office: "H Block — Room 14",
  officePhone: "(042) 111-001-007 (University Exchange)",
  emails: ["junaidakram@cuilahore.edu.pk", "junaid.tsinghua@yahoo.com"],
  labEmail: "scsa.laab@gmail.com",
  googleScholar: "https://scholar.google.com/citations?user=JunaidAkram",
  linkedin: "https://www.linkedin.com/in/junaidakram/",
  researchGate: "https://www.researchgate.net/profile/Junaid-Akram",
  orcid: "https://orcid.org/0000-0003-1752-6124",
  officialProfile: "https://lahore.comsats.edu.pk/employees/1333",
  officialFypIdeas: "https://lahore.comsats.edu.pk/cs/fyp/IdeasforStudents.aspx",
  sourceSite: "https://sites.google.com/view/temporaryr/home",
  credentials: [
    "Postdoctoral research at SnT, University of Luxembourg",
    "PhD from Tsinghua University",
    "HEC-approved PhD Supervisor",
  ],
  experience: [
    {
      role: "Assistant Professor",
      organization: "COMSATS University Islamabad, Lahore Campus",
      period: "March 2023 — present",
    },
    {
      role: "Postdoctoral Research Associate",
      organization: "University of Luxembourg / SnT",
      period: "May 2021 — May 2023",
    },
    {
      role: "Visiting Researcher",
      organization: "SES, Luxembourg — Adaptive Resource Control project",
      period: "2021 — 2023 (during postdoctoral research)",
    },
    {
      role: "Assistant Professor",
      organization: "Xiamen University Malaysia",
      period: "August 2020 — July 2021",
    },
  ],
  education: [
    {
      qualification: "Postdoctoral Research",
      institution: "University of Luxembourg",
      period: "2021 — 2023",
    },
    {
      qualification: "PhD in Software Engineering",
      institution: "Tsinghua University",
      period: "2015 — 2020",
    },
    {
      qualification: "MPhil",
      institution: "Zhejiang University of Technology",
      period: "2012 — 2015",
    },
  ],
};

export const researchDomains = [
  {
    id: "cyber-security",
    number: "01",
    image: "/ai-chatgpt/cyber-security-shield.png",
    title: "Cyber Security",
    description:
      "Source-level assessment methods for identifying, understanding, and mitigating software vulnerabilities.",
    overview:
      "Cyber Security is the main umbrella domain covering secure software design, source-code security assessment, vulnerability management, application security, DevSecOps, and software-supply-chain protection. Its goal is to prevent security weaknesses, discover them early, understand their impact, and support reliable remediation.",
    keyProblems: [
      "Security weaknesses introduced during software design and implementation",
      "Insecure authentication and authorization mechanisms",
      "Injection, memory-safety, cryptographic, and input-validation weaknesses",
      "Security misconfigurations in applications, cloud services, containers, and CI/CD pipelines",
      "Hard-coded credentials, API keys, tokens, and sensitive information",
      "Vulnerabilities inherited through third-party libraries and dependencies",
      "Incomplete or inaccurate software bills of materials",
      "Excessive false positives produced by security-analysis tools",
      "Difficulty prioritizing findings according to exploitability and business impact",
      "Security risks introduced by AI-generated source code",
      "Weak security controls in IoT and cyber-physical systems",
      "Lack of continuous security verification after software updates",
    ],
    currentDirections: [
      "Secure-by-design software architecture",
      "Automated secure-code review",
      "Hybrid static and dynamic security analysis",
      "AI-assisted vulnerability explanation and remediation",
      "Security assessment of AI-generated software",
      "DevSecOps security automation",
      "Software-supply-chain and dependency security",
      "SBOM generation and validation",
      "Exploitability-aware vulnerability prioritization",
      "Security analysis of cloud and infrastructure-as-code configurations",
      "Security digital twins for cyber-physical systems",
      "Explainable security-analysis tools",
    ],
    relatedLabWork: {
      items: [
        "Source-code vulnerability assessment",
        "SQVDT vulnerability-detection platform",
        "VCIPR function-level vulnerable-code detection",
        "Security-patch and vulnerability-benchmark analysis",
        "Malware and obfuscated-code detection",
        "Large-scale source-code analysis",
      ],
      summary:
        "The lab’s published and documented work supports source-level security assessment, patch analysis, vulnerability detection, malware analysis, testing, and code-similarity research.",
    },
    toolsAndDatasets: {
      items: [
        {
          name: "NIST Secure Software Development Framework",
          url: "https://csrc.nist.gov/projects/ssdf",
        },
        { name: "OWASP Top 10: 2025", url: "https://owasp.org/Top10/" },
        {
          name: "MITRE Common Weakness Enumeration",
          url: "https://cwe.mitre.org/",
        },
        {
          name: "CISA Secure by Design",
          url: "https://www.cisa.gov/securebydesign",
        },
        { name: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
        {
          name: "Open Source Security Foundation",
          url: "https://openssf.org/",
        },
      ],
      summary:
        "NIST’s SSDF organizes secure-development practices across the software lifecycle, while the OWASP Top 10:2025 includes risks such as broken access control, security misconfiguration, software-supply-chain failures, and insecure design.",
    },
    projectIdeas: [
      "Automated secure-code review platform",
      "AI-generated code security analyzer",
      "Source-code secret and credential detector",
      "DevSecOps security-posture dashboard",
      "Secure configuration analyzer for cloud applications",
      "Unified SAST, dependency, and secret-scanning platform",
      "Security-risk prioritization using exploitability evidence",
      "SBOM quality and completeness checker",
    ],
  },
  {
    id: "vulnerability-detection",
    number: "02",
    image: "/ai-chatgpt/vulnerability-chip.png",
    title: "Vulnerability Detection",
    description:
      "Scalable techniques and tools that trace vulnerable code through patches, fingerprints, and code similarity.",
    overview:
      "Vulnerability Detection focuses specifically on algorithms and tools that locate vulnerable source code. It covers CVE and patch mining, vulnerable-code fingerprints, static analysis, semantic analysis, code similarity, graph analysis, machine learning, and vulnerability verification.",
    keyProblems: [
      "CVE records without precise vulnerable files or functions",
      "Difficulty connecting vulnerabilities to their correct fixing commits",
      "Security patches containing unrelated formatting or refactoring changes",
      "High false-positive rates in static-analysis tools",
      "Detecting vulnerabilities across different projects and versions",
      "Identifying copied or reused vulnerable code",
      "Detecting vulnerabilities after identifier renaming or code restructuring",
      "Cross-language vulnerable-code detection",
      "Source-to-binary vulnerable-code matching",
      "Determining whether a vulnerable dependency is reachable",
      "Detecting incomplete or incorrectly applied security patches",
      "Dataset duplication, weak labels, and train-test leakage",
      "Poor generalization of machine-learning vulnerability detectors",
      "Unreliable explanations and patches generated by language models",
    ],
    currentDirections: [
      "CVE-to-commit and patch mapping",
      "File-, function-, statement-, and component-level detection",
      "Patch-guided vulnerable-code extraction",
      "Vulnerable-code fingerprinting",
      "Vulnerable-clone detection",
      "AST, control-flow, and data-flow analysis",
      "Code-property-graph vulnerability detection",
      "Graph-neural-network vulnerability detection",
      "Retrieval-based detection using code embeddings",
      "Cross-project and cross-language detection",
      "Reachability-aware dependency scanning",
      "Exploitability-aware risk ranking",
      "LLM-assisted vulnerability detection and explanation",
      "Automated patch generation with executable validation",
      "Continual learning for newly disclosed vulnerabilities",
      "Adversarially robust source-code analysis",
    ],
    relatedLabWork: {
      items: [
        "SQVDT: file-level vulnerable-code fingerprinting",
        "VCIPR: function-level vulnerable and unpatched code detection",
        "Security-patch collection and analysis",
        "Vulnerability benchmark construction",
        "Vulnerable-code matching across open-source repositories",
        "Token-based, language-independent source-code assessment",
      ],
      summary:
        "SQVDT was evaluated over large C/C++ repository collections, while VCIPR was designed to detect vulnerable and unpatched code at function level after security patches become available.",
    },
    toolsAndDatasets: {
      items: [
        {
          name: "National Vulnerability Database",
          url: "https://nvd.nist.gov/",
        },
        {
          name: "CISA Known Exploited Vulnerabilities Catalog",
          url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        },
        { name: "OSV Open Source Vulnerabilities", url: "https://osv.dev/" },
        {
          name: "NIST Software Assurance Reference Dataset",
          url: "https://samate.nist.gov/SARD/",
        },
        { name: "MITRE CWE", url: "https://cwe.mitre.org/" },
        { name: "CodeQL", url: "https://codeql.github.com/docs/" },
        { name: "Joern Code Property Graph", url: "https://joern.io/" },
        { name: "Semgrep", url: "https://semgrep.dev/" },
      ],
      summary:
        "The CISA KEV catalog is particularly useful for distinguishing vulnerabilities with evidence of active exploitation from vulnerabilities that have only theoretical or unverified risk.",
    },
    projectIdeas: [
      "CVE-to-fix-commit mapping system",
      "Function-level vulnerable-code detector",
      "Vulnerable code-clone detection platform",
      "Security-patch purity analyzer",
      "Reachability-aware dependency vulnerability scanner",
      "Explainable vulnerability detector",
      "Cross-language vulnerability matching system",
      "AI-generated patch verification framework",
      "Security-patch propagation tracker",
      "Leakage-resistant vulnerability benchmark",
    ],
  },
  {
    id: "software-testing",
    number: "03",
    image: "/ai-chatgpt/software-testing-checklist.png",
    title: "Software Testing",
    description:
      "Search-based testing, automated test-data generation, regression testing, and test-smell detection.",
    overview:
      "Software Testing examines how tests can be generated, selected, prioritized, executed, and evaluated automatically. The security connection includes fuzzing, vulnerability-triggering test generation, regression testing after security patches, mutation testing, and validation of AI-generated code.",
    keyProblems: [
      "Automatically generated tests without meaningful assertions",
      "Difficulty determining whether complex outputs are correct",
      "Inadequate test coverage of deep program states",
      "Flaky and nondeterministic tests",
      "Slow and expensive regression-test suites",
      "Duplicate or low-value test cases",
      "Test smells and poorly maintainable test definitions",
      "Difficulty testing distributed and cyber-physical systems",
      "Structured-input and protocol-aware fuzzing",
      "Environment-dependent test failures",
      "Weak tests that allow incorrect patches to pass",
      "Unrealistic or outdated software-testing benchmarks",
      "Evaluation leakage in LLM-based testing systems",
      "Coverage metrics that do not reflect fault-detection ability",
    ],
    currentDirections: [
      "Search-based software testing",
      "Constraint-based test-data generation",
      "Symbolic and concolic execution",
      "Coverage-guided fuzzing",
      "Stateful and protocol-aware fuzzing",
      "LLM-generated test cases and fuzz targets",
      "Automated test-oracle generation",
      "Metamorphic and differential testing",
      "Flaky-test detection and repair",
      "Change-aware regression-test selection",
      "Test-case prioritization",
      "Test-smell detection and refactoring",
      "Mutation testing",
      "Security-focused fault injection",
      "Test-case slicing using execution logs",
      "Automated validation of AI-generated patches",
    ],
    relatedLabWork: {
      items: [
        "Automated test-data generation for the ARC cyber-physical system",
        "Random, search-based, constraint-based, and mutation testing strategies",
        "Test-smell detection in multi-level BDD testing frameworks",
        "Log-based test-case slicing",
        "Reduction of complex regression-test execution cost",
      ],
      summary:
        "These testing projects are documented as research conducted with SnT, University of Luxembourg, and SES, including automated test-data generation, test-smell detection, and log-based test slicing.",
    },
    toolsAndDatasets: {
      items: [
        { name: "OSS-Fuzz", url: "https://github.com/google/oss-fuzz" },
        {
          name: "OSS-Fuzz-Gen",
          url: "https://github.com/google/oss-fuzz-gen",
        },
        { name: "Defects4J", url: "https://github.com/rjust/defects4j" },
        { name: "EvoSuite", url: "https://www.evosuite.org/" },
        { name: "PIT Mutation Testing", url: "https://pitest.org/" },
        {
          name: "NIST SARD",
          url: "https://samate.nist.gov/SARD/",
        },
      ],
      summary:
        "OSS-Fuzz combines modern fuzzing with distributed execution for open-source projects, while OSS-Fuzz-Gen generates and evaluates fuzz targets for real-world projects using language models. Defects4J supplies reproducible real-world software defects and supporting experimental infrastructure.",
    },
    projectIdeas: [
      "Automated security-test generator",
      "LLM-assisted fuzz-target generator",
      "Flaky-test prediction platform",
      "Regression-test prioritization system",
      "Test-smell detection and refactoring tool",
      "Mutation-testing system for security weaknesses",
      "Log-based test-case slicing platform",
      "Metamorphic testing framework",
      "AI-generated patch validation tool",
      "Automated cyber-physical test-data generator",
    ],
  },
  {
    id: "malware-detection",
    number: "04",
    image: "/ai-chatgpt/malware-ai-brain.png",
    title: "Malware Detection",
    description:
      "Static and learning-based analysis of Android and cross-architecture malware at source-code level.",
    overview:
      "Malware Detection studies how malicious programs can be identified, classified, explained, and tracked. It includes Android malware, Windows PE malware, IoT malware, malicious packages, static source-code analysis, binary analysis, behavior analysis, obfuscation detection, and machine-learning classification.",
    keyProblems: [
      "Identifier renaming and source-code obfuscation",
      "String encryption and runtime code loading",
      "Packing, polymorphism, and metamorphism",
      "Malware variants sharing code across families",
      "Inconsistent or noisy antivirus labels",
      "Near-duplicate samples across training and testing datasets",
      "Performance degradation as malware evolves",
      "Detecting previously unseen malware families",
      "Cross-architecture IoT malware detection",
      "Cross-platform behavior matching",
      "Malware evasion of dynamic-analysis sandboxes",
      "Adversarial modification of malware features",
      "Separating malicious application code from legitimate libraries",
      "Explainability of machine-learning malware classifiers",
      "Safe storage and handling of malware datasets",
      "Detection of malicious open-source packages",
    ],
    currentDirections: [
      "Static and dynamic hybrid malware detection",
      "Source-code-level Android malware analysis",
      "Obfuscation-resilient malware detection",
      "Cross-architecture IoT malware classification",
      "Temporal malware evaluation",
      "Concept-drift detection",
      "Open-set and zero-day malware recognition",
      "Few-shot malware-family classification",
      "Graph-based malware representations",
      "API-call and behavioral-sequence modeling",
      "Explainable malware classification",
      "Malware detection mapped to MITRE ATT&CK",
      "Continual-learning malware classifiers",
      "Federated malware learning",
      "Malicious package and supply-chain implant detection",
    ],
    relatedLabWork: {
      items: [
        "DroidMD: scalable Android malware detection at source-code level",
        "MTHAEL: cross-architecture IoT malware detection",
        "Detection of obfuscated Android source code",
        "Token-based identification of identifier-renaming and string-encryption obfuscation",
        "Ensemble defense against obfuscated Windows, Android, and IoT malware",
        "DroidSD and DroidCC Android similarity analysis",
      ],
      summary:
        "The publication record includes Android source-level malware detection, cross-architecture IoT malware classification, obfuscated-code analysis, and an advanced ensemble framework for Windows, Android, and IoT malware.",
    },
    toolsAndDatasets: {
      items: [
        { name: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
        {
          name: "EMBER Malware Benchmark",
          url: "https://github.com/elastic/ember",
        },
        {
          name: "SOREL-20M",
          url: "https://github.com/sophos/SOREL-20M",
        },
        { name: "AndroZoo", url: "https://androzoo.uni.lu/" },
        {
          name: "CICAndMal2017",
          url: "https://www.unb.ca/cic/datasets/andmal2017.html",
        },
        {
          name: "Drebin Android Malware Dataset",
          url: "https://drebin.mlsec.org/",
        },
      ],
      summary:
        "EMBER provides static Windows PE malware features for machine-learning research. SOREL-20M provides a much larger malware benchmark with labels, timestamps, metadata, baseline features, and reference models, although its full dataset requires substantial storage.",
    },
    projectIdeas: [
      "Android malware source-code detector",
      "Obfuscation-resilient malware classifier",
      "Cross-architecture IoT malware detector",
      "Temporal malware-drift monitoring system",
      "Explainable malware-family classifier",
      "Malicious npm or PyPI package detector",
      "Android third-party-library filtering tool",
      "Open-set zero-day malware classifier",
      "Malware behavior mapping to MITRE ATT&CK",
      "Static and dynamic malware evidence-fusion platform",
    ],
  },
  {
    id: "code-clone-analysis",
    number: "05",
    title: "Code Clone Analysis",
    description:
      "Large-scale detection of exact, near-miss, and obfuscated code clones across software systems.",
    overview:
      "Code Clone Analysis identifies duplicated or functionally similar source code within and across applications. It can support software maintenance, refactoring, provenance analysis, malware detection, plagiarism analysis, licensing studies, and the detection of copied vulnerable code.",
    keyProblems: [
      "Detecting exact Type-1 clones",
      "Detecting renamed Type-2 clones",
      "Detecting modified Type-3 clones",
      "Detecting semantic Type-4 clones",
      "Cross-language code-clone detection",
      "Source-to-binary similarity detection",
      "Clone detection across billions of lines of code",
      "Obfuscation-resistant similarity analysis",
      "Separating application clones from third-party libraries",
      "Incomplete and outdated clone benchmarks",
      "Tracking the original source of copied code",
      "Detecting inconsistent bug and security fixes across clones",
      "Identifying vulnerable code that has been copied into other systems",
      "Understanding clone evolution across forks and releases",
      "Detecting memorized or reproduced code generated by language models",
      "Evaluating whether similarity represents copying or common functionality",
    ],
    currentDirections: [
      "Semantic Type-4 clone detection",
      "Graph-based clone analysis",
      "Execution-based similarity detection",
      "Cross-language clone detection",
      "Source-to-binary clone matching",
      "Large-scale approximate-nearest-neighbor indexing",
      "Clone genealogy and provenance analysis",
      "Vulnerable-clone detection",
      "Security-patch propagation through clones",
      "Obfuscation-resilient clone detection",
      "Compiler-resilient binary similarity",
      "AI-generated code provenance",
      "Library-aware clone filtering",
      "Explainable clone-matching evidence",
      "Multilingual clone benchmarks",
    ],
    relatedLabWork: {
      items: [
        "IBFET: index-based feature extraction for very large code collections",
        "DroidCC: scalable clone detection for Android applications",
        "DroidSD: Android application similarity detection",
        "Token-based detection of obfuscated source code",
        "Vulnerable-code fingerprints and code similarity",
        "Detection of Type-1, Type-2, and Type-3 Android clones",
      ],
      summary:
        "The research page describes IBFET as being evaluated over more than 324 billion lines of code and DroidSD as being evaluated over 30,500 Android applications.",
    },
    toolsAndDatasets: {
      items: [
        {
          name: "BigCloneBench",
          url: "https://github.com/clonebench/BigCloneBench",
        },
        {
          name: "SourcererCC",
          url: "https://github.com/Mondego/SourcererCC",
        },
        {
          name: "Open-NiCad",
          url: "https://github.com/CordyJ/Open-NiCad",
        },
        {
          name: "CodeXGLUE",
          url: "https://github.com/microsoft/CodeXGLUE",
        },
        {
          name: "Code Clone Research Resources",
          url: "https://clones.usask.ca/",
        },
      ],
      summary:
        "BigCloneBench is a curated clone-detection benchmark with evaluation support through BigCloneEval. CodeXGLUE also includes clone and defect-detection tasks for code-intelligence research.",
    },
    projectIdeas: [
      "Semantic Type-4 clone detector",
      "Cross-language clone-detection platform",
      "Vulnerable-clone propagation tracker",
      "Android obfuscation-aware clone detector",
      "Source-to-binary similarity analyzer",
      "Clone genealogy visualization system",
      "AI-generated code-provenance analyzer",
      "Library-aware clone-filtering system",
      "Scalable clone-search engine",
      "Security-patch inconsistency detector",
    ],
  },
  {
    id: "software-evolution-reuse",
    number: "06",
    title: "Software Evolution & Reuse",
    description:
      "Understanding how code, vulnerabilities, and reusable components propagate between systems.",
    overview:
      "Software Evolution & Reuse examines how source code, dependencies, security patches, APIs, libraries, components, and vulnerabilities change and move between projects. It combines repository mining, dependency analysis, software provenance, supply-chain security, clone genealogy, and historical software analysis.",
    keyProblems: [
      "Vulnerable code copied into downstream applications",
      "Security fixes not reaching all forks or maintained branches",
      "Deep and changing dependency graphs",
      "Hidden or undeclared copied components",
      "Incomplete or outdated SBOM documents",
      "Difficulty linking source repositories to released packages",
      "Dependencies listed as vulnerable but unreachable at runtime",
      "Abandoned or poorly maintained software packages",
      "Compromised maintainers and release processes",
      "API changes causing compatibility and security regressions",
      "Unclear provenance of copied or generated source code",
      "License and attribution issues in reused code",
      "Non-reproducible software builds",
      "Repository histories modified through squashing or mirroring",
      "AI-generated code that introduces unknown dependencies or copied code",
      "Large-scale analysis of forks, commits, releases, and package ecosystems",
    ],
    currentDirections: [
      "Security-patch propagation analysis",
      "Fork and downstream-product vulnerability tracking",
      "Reachability-aware dependency analysis",
      "Software-component provenance",
      "Clone genealogy",
      "SBOM generation and reconciliation",
      "SBOM completeness and quality measurement",
      "Vulnerability Exploitability eXchange analysis",
      "Supply-chain risk prediction",
      "Reproducible builds and attestations",
      "Automated API migration",
      "Compatibility and regression analysis",
      "Detection of copied and undeclared dependencies",
      "Package-maintainer and ecosystem-risk analysis",
      "AI-generated code evolution and provenance",
      "Large-scale mining of software archives",
    ],
    relatedLabWork: {
      items: [
        "Security-patch history analysis",
        "Extraction of vulnerable and corrected source code",
        "Detection of reused vulnerable files and functions",
        "Large-scale source-code similarity analysis",
        "Android application reuse and clone detection",
        "Open-source vulnerability benchmark construction",
      ],
      summary:
        "The lab’s work connects software evolution with security by analyzing patches, vulnerable code, repository collections, code reuse, and propagation through similar source-code fragments.",
    },
    toolsAndDatasets: {
      items: [
        {
          name: "Software Heritage",
          url: "https://www.softwareheritage.org/",
        },
        {
          name: "Open Source Insights — deps.dev",
          url: "https://deps.dev/",
        },
        { name: "OSV", url: "https://osv.dev/" },
        { name: "OpenSSF Scorecard", url: "https://scorecard.dev/" },
        { name: "SPDX", url: "https://spdx.dev/" },
        { name: "CycloneDX", url: "https://cyclonedx.org/" },
        { name: "SLSA", url: "https://slsa.dev/" },
      ],
      summary:
        "Software Heritage preserves publicly available source code and its development history. SPDX and CycloneDX provide structured standards for communicating software-component, provenance, licensing, vulnerability, and supply-chain information.",
    },
    projectIdeas: [
      "Security-patch propagation tracking platform",
      "Vulnerable-code reuse detector",
      "SBOM completeness and consistency analyzer",
      "Dependency reachability analyzer",
      "Copied-component identification system",
      "Open-source package-risk scoring platform",
      "Software provenance explorer",
      "Fork and downstream-vulnerability monitor",
      "Automated API-migration assistant",
      "Software-build provenance verification tool",
    ],
  },
];

export const researchProjects = [
  {
    title: "Automated Test Data Generation for the ARC System",
    status: "Research project · University of Luxembourg & SES (Postdoctoral Research 2021–2023)",
    summary:
      "A model-based approach and tool for generating and validating complex CPS test data using random, search-based, constraint-based, and mutation strategies.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg, and SES, Luxembourg.",
    image: "/academic/vulnerability-detection-workflow.jpg",
    details: {
      problem: "Testing complex satellite resource control systems requires automated generation of valid and boundary test data across multi-dimensional constraint spaces.",
      approach: "Formulated model-based testing strategies combining random, search-based evolutionary algorithms, and mutation operators.",
      outcome: "Generated test vectors covering complex operational constraints, reducing manual test data preparation effort.",
    },
  },
  {
    title: "Test Smell Detection in the ARC System",
    status: "Completed · 2021–2023",
    summary:
      "Tool-supported detection of poor testing practices in multi-level, BDD-based testing frameworks to improve test definition and maintainability.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg, and SES, Luxembourg.",
    details: {
      problem: "Behavior-Driven Development (BDD) test suites accumulate design anti-patterns (test smells) that make regression testing brittle.",
      approach: "Implemented static rule checkers targeting multi-level test definitions to flag duplicate steps and unasserted scenarios.",
      outcome: "Cataloged test smells in satellite control test suites, enhancing long-term maintainability.",
    },
  },
  {
    title: "Log-Based Test Case Slicing",
    status: "Completed · 2021–2022",
    summary:
      "A tool-supported approach for decomposing complex system tests into smaller scenarios while preserving their assertions and reducing regression-test execution cost.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg.",
    details: {
      problem: "Long-running system integration tests slow down continuous regression loops when only small sub-features change.",
      approach: "Analyzed execution trace logs to dynamically slice end-to-end test scripts into minimal executable fragments preserving assertion semantics.",
      outcome: "Reduced regression execution time by isolating affected execution branches.",
    },
  },
  {
    title: "Obfuscated Code Detection in Android Applications",
    status: "Completed · 2018–2020",
    summary:
      "A clone-detection approach for identifying identifier-renaming and string-encryption obfuscation in Android source code, evaluated across obfuscated and non-obfuscated datasets.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    image: "/ai-chatgpt/bug-magnifier-v1.png",
    details: {
      problem: "Android malware authors use identifier renaming, control flow flattening, and string encryption to evade signature scanners.",
      approach: "Normalized AST token sequences and extracted invariant structural features immune to surface-level identifier mutations.",
      outcome: "Identified obfuscated code clones with high precision across transformed Android APKs.",
    },
  },
  {
    title: "SQVDT — Source Code Vulnerability Detection",
    status: "Completed · 2018–2020",
    summary:
      "A file-level platform built from a fingerprint index of 2,931 vulnerable files and evaluated across 7 TB of C/C++ source code from 152,823 open-source projects.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    image: "/ai-chatgpt/laptop-code.png",
    details: {
      problem: "Existing static analysis tools struggle to scale to multi-terabyte code repositories when tracking recurring unpatched vulnerabilities.",
      approach: "Indexed source-code syntax trees into high-dimensional hash fingerprints stored in a distributed inverted index for fast similarity lookup.",
      outcome: "Evaluated across 152,823 open-source projects (7 TB C/C++ source), demonstrating scalable quantitative vulnerability search.",
    },
  },
  {
    title: "VCIPR — Vulnerability Detection at Function Level",
    status: "Completed · 2017–2018",
    summary:
      "A scalable, token-based and language-independent tool for detecting vulnerable and unpatched code fragments at function-level granularity.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    image: "/ai-chatgpt/code-clone-sync.png",
    details: {
      problem: "Function-level vulnerabilities (e.g. buffer overflows in C/C++) are easily copied across software projects without triggering file-level matches.",
      approach: "Extracted normalized function token streams and calculated patch diff signatures to identify vulnerable code variants.",
      outcome: "Published at IEEE ICST 2019, showing precise function-level vulnerability matching upon patch release.",
    },
  },
  {
    title: "Patch Analysis and Vulnerability Research",
    status: "Completed · 2018–2020",
    summary:
      "A structured benchmark that traces open-source security patches and extracts vulnerable source code at function, file, and component granularity for repeatable security assessment.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    details: {
      problem: "Vulnerability research requires standardized, multi-granularity code benchmarks to benchmark detection tools fairly.",
      approach: "Parsed historical CVE security commits (git diffs), mapping before-and-after patch fragments with corresponding CWE classifications.",
      outcome: "Published benchmark methodology in IET Information Security (2020) for reproducible software security evaluations.",
    },
  },
  {
    title: "DroidSD — Android Similarity Detection",
    status: "Completed · 2015–2017",
    summary:
      "A source-level clone-detection tool for identifying Type-1, Type-2, and Type-3 clones in a dataset of 30,500 Android applications.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    details: {
      problem: "App repackaging and code plagiarization in Android app markets compromise developer copyright and spread malware.",
      approach: "Constructed an indexed feature database from disassembled Android bytecode and source structures to evaluate similarity at scale.",
      outcome: "Evaluated over 30,500 Android applications; published in Journal of Information Science and Engineering (2020).",
    },
  },
  {
    title: "IBFET — Large-Scale Code Clone Detection",
    status: "Completed · 2015–2017",
    summary:
      "An index-based feature extraction technique evaluated over more than 324 billion lines of code in a Hadoop distributed environment.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    details: {
      problem: "Comparing billions of lines of source code pairwise for clones exhibits quadratic time complexity O(N^2).",
      approach: "Designed an Index-Based Feature Extraction Technique (IBFET) using MapReduce on Hadoop to build an inverted token index.",
      outcome: "Indexed 324B+ lines of code, achieving near-linear scalability for massive code-clone detection.",
    },
  },
];

export const publications = [
  {
    year: "2025",
    type: "Journal",
    title:
      "An Advanced Ensemble Framework for Defending Against Obfuscated Windows, Android, and IoT Malware",
    authors: "Danish Vasan, Junaid Akram, Mohammad Hammoudeh, Adel F. Ahmed",
    venue: "Applied Soft Computing, Volume 173, 112908",
    href: "https://doi.org/10.1016/j.asoc.2025.112908",
    bibtex: `@article{vasan2025advanced,
  title={An Advanced Ensemble Framework for Defending Against Obfuscated Windows, Android, and IoT Malware},
  author={Vasan, Danish and Akram, Junaid and Hammoudeh, Mohammad and Ahmed, Adel F.},
  journal={Applied Soft Computing},
  volume={173},
  pages={112908},
  year={2025},
  publisher={Elsevier}
}`,
  },
  {
    year: "2022",
    type: "Journal",
    title: "Obfuscated Code is Identifiable by a Token Based Clone Detection Technique",
    authors: "Junaid Akram, Danish Vasan, Ping Luo",
    venue: "International Journal of Information and Computer Security, 19(3–4), 254–273",
    href: "https://doi.org/10.1504/IJICS.2022.127132",
    bibtex: `@article{akram2022obfuscated,
  title={Obfuscated Code is Identifiable by a Token Based Clone Detection Technique},
  author={Akram, Junaid and Vasan, Danish and Luo, Ping},
  journal={International Journal of Information and Computer Security},
  volume={19},
  number={3-4},
  pages={254--273},
  year={2022}
}`,
  },
  {
    year: "2021",
    type: "Journal",
    title:
      "DroidMD: An Efficient and Scalable Android Malware Detection Approach at Source Code Level",
    authors: "Junaid Akram, Majid Mumtaz, Gul Jabeen, Ping Luo",
    venue: "International Journal of Information and Computer Security, 16(3/4)",
    href: "https://doi.org/10.1504/IJICS.2021.116310",
    bibtex: `@article{akram2021droidmd,
  title={DroidMD: An Efficient and Scalable Android Malware Detection Approach at Source Code Level},
  author={Akram, Junaid and Mumtaz, Majid and Jabeen, Gul and Luo, Ping},
  journal={International Journal of Information and Computer Security},
  year={2021}
}`,
  },
  {
    year: "2021",
    type: "Journal",
    title: "SQVDT: Scalable Quantitative Vulnerability Detection Technique for Source Code Security Assessment",
    authors: "Junaid Akram, Ping Luo",
    venue: "Software: Practice and Experience, 51(2), 294–318",
    href: "https://doi.org/10.1002/spe.2905",
    bibtex: `@article{akram2021sqvdt,
  title={SQVDT: Scalable Quantitative Vulnerability Detection Technique for Source Code Security Assessment},
  author={Akram, Junaid and Luo, Ping},
  journal={Software: Practice and Experience},
  volume={51},
  number={2},
  pages={294--318},
  year={2021}
}`,
  },
  {
    year: "2020",
    type: "Journal",
    title: "MTHAEL: Cross-Architecture IoT Malware Detection Based on Neural Network Advanced Ensemble Learning",
    authors: "Danish Vasan, Mamoun Alazab, Sitalakshmi, Junaid Akram, Zheng Qin",
    venue: "IEEE Transactions on Computers, 69(11)",
    href: "https://doi.org/10.1109/TC.2020.3015584",
    bibtex: `@article{vasan2020mthael,
  title={MTHAEL: Cross-Architecture IoT Malware Detection Based on Neural Network Advanced Ensemble Learning},
  author={Vasan, Danish and Alazab, Mamoun and Venkatraman, Sitalakshmi and Akram, Junaid and Qin, Zheng},
  journal={IEEE Transactions on Computers},
  volume={69},
  number={11},
  pages={1654--1667},
  year={2020},
  publisher={IEEE}
}`,
  },
  {
    year: "2020",
    type: "Journal",
    title: "DroidSD: An Efficient Indexed Based Android Applications Similarity Detection Tool",
    authors: "Junaid Akram, Zhendong Shi, Majid Mumtaz, Ping Luo",
    venue: "Journal of Information Science and Engineering, 36, 13–29",
    bibtex: `@article{akram2020droidsd,
  title={DroidSD: An Efficient Indexed Based Android Applications Similarity Detection Tool},
  author={Akram, Junaid and Shi, Zhendong and Mumtaz, Majid and Luo, Ping},
  journal={Journal of Information Science and Engineering},
  volume={36},
  pages={13--29},
  year={2020}
}`,
  },
  {
    year: "2020",
    type: "Journal",
    title: "How to Build a Vulnerability Benchmark to Overcome Cyber Security Attacks",
    authors: "Junaid Akram, Ping Luo",
    venue: "IET Information Security, 14(1), 60–71",
    href: "https://doi.org/10.1049/iet-ifs.2018.5647",
    bibtex: `@article{akram2020build,
  title={How to Build a Vulnerability Benchmark to Overcome Cyber Security Attacks},
  author={Akram, Junaid and Luo, Ping},
  journal={IET Information Security},
  volume={14},
  number={1},
  pages={60--71},
  year={2020}
}`,
  },
  {
    year: "2019",
    type: "Conference",
    title: "VCIPR: Vulnerable Code is Identifiable When a Patch is Released",
    authors: "Junaid Akram, Liang Qi, Ping Luo",
    venue: "IEEE Conference on Software Testing, Validation and Verification (ICST 2019)",
    href: "https://doi.org/10.1109/ICST.2019.00049",
    bibtex: `@inproceedings{akram2019vcipr,
  title={VCIPR: Vulnerable Code is Identifiable When a Patch is Released},
  author={Akram, Junaid and Qi, Liang and Luo, Ping},
  booktitle={2019 IEEE Conference on Software Testing, Validation and Verification (ICST)},
  pages={436--443},
  year={2019},
  organization={IEEE}
}`,
  },
  {
    year: "2018",
    type: "Conference",
    title: "DroidCC: A Scalable Clone Detection Approach for Android Applications",
    authors: "Junaid Akram, Zhendong Shi, Majid Mumtaz, Ping Luo",
    venue: "IEEE 42nd Annual Computer Software and Applications Conference (COMPSAC 2018)",
    bibtex: `@inproceedings{akram2018droidcc,
  title={DroidCC: A Scalable Clone Detection Approach for Android Applications},
  author={Akram, Junaid and Shi, Zhendong and Mumtaz, Majid and Luo, Ping},
  booktitle={2018 IEEE 42nd Annual Computer Software and Applications Conference (COMPSAC)},
  year={2018},
  organization={IEEE}
}`,
  },
  {
    year: "2015",
    type: "Journal",
    title: "Data Structure and Algorithm: A Visualized Web Based Courseware Improves Cognitive Learning",
    authors: "Junaid Akram, Fang Luping",
    venue: "International Journal of Digital Information and Wireless Communications, 5(3), 194–202",
    bibtex: `@article{akram2015data,
  title={Data Structure and Algorithm: A Visualized Web Based Courseware Improves Cognitive Learning},
  author={Akram, Junaid and Luping, Fang},
  journal={International Journal of Digital Information and Wireless Communications},
  volume={5},
  number={3},
  pages={194--202},
  year={2015}
}`,
  },
];

export const supervisedProjects = [
  {
    student: "Ouyang NingJing",
    term: "Fall 2020",
    institution: "Xiamen University Malaysia",
    title: "Analysis and Detection of Fraudulent Transactions Using the PaySim Financial Simulator",
  },
  {
    student: "Wang Xiaowei",
    term: "Fall 2020",
    institution: "Xiamen University Malaysia",
    title: "Malware Feature Extraction of Instruction Frequency",
  },
  {
    student: "Eilsen Law Yi Sheng",
    term: "Fall 2020",
    institution: "Xiamen University Malaysia",
    title: "Malware Feature Extraction via Machine Learning Algorithm",
  },
  {
    student: "Chen WenLong",
    term: "Spring 2021",
    institution: "Xiamen University Malaysia",
    title: "ElderlyCare — an Android-based Elderly Health Assistance Application",
  },
  {
    student: "Du GuangRui",
    term: "Spring 2021",
    institution: "Xiamen University Malaysia",
    title: "Detection and Defense of Vulnerability in OpenSSL",
  },
  {
    student: "Guo Hanshui",
    term: "Spring 2021",
    institution: "Xiamen University Malaysia",
    title: "Correlation Attack on Geffe Generator",
  },
  {
    student: "Sun HuanYu",
    term: "Spring 2021",
    institution: "Xiamen University Malaysia",
    title: "Chess Game Development",
  },
];

export const alumniPlacements = [
  {
    name: "Mak Sue Sun",
    term: "Fall 2020",
    organization: "Ernst & Young Advisory Services Sdn. Bhd.",
  },
  {
    name: "Li SiHan",
    term: "Fall 2020",
    organization: "Maxwell Cloud Technology Sdn. Bhd.",
  },
  {
    name: "Lan YuLin",
    term: "Fall 2020",
    organization: "China ASEAN Information Harbor",
  },
  {
    name: "Chen Yu",
    term: "Spring 2021",
    organization: "Beijing Megvii Corporation, Ltd.",
  },
  {
    name: "Gao HongXu",
    term: "Spring 2021",
    organization: "Returnstar Interactive Technology",
  },
  {
    name: "Guo Yuhu",
    term: "Spring 2021",
    organization: "Zoho Technology Co., Hangzhou",
  },
  {
    name: "Liang TianWen",
    term: "Spring 2021",
    organization: "Meiya Pico, Xiamen Software Park",
  },
];

export const fypOpportunities = [
  {
    title: "Building a Benchmark of Vulnerable Source Code",
    type: "COMSATS Listed Supervision Topic",
    availability: "Available for supervision",
    prerequisites: "Software security, C/C++/Java, Git API",
    source: "Official COMSATS Supervision Listing",
    lastVerified: "July 2026",
    summary:
      "Extract vulnerable code from patch files at function, file, and component levels, analyse repair patterns, and build a reusable benchmark for vulnerability research.",
    expectedDeliverables: [
      "Automated diff parser for CVE patch commits",
      "Function and file granularity vulnerable code dataset",
      "Benchmark evaluation report and GitHub repo",
    ],
  },
  {
    title: "Intra-Project vs Inter-Project Software Dependency Analysis",
    type: "COMSATS Listed Supervision Topic",
    availability: "Available for supervision",
    prerequisites: "Software evolution, dependency graphs, Python/C++",
    source: "Official COMSATS Supervision Listing",
    lastVerified: "July 2026",
    summary:
      "Measure cloned-code and dependency ratios across related software systems and multiple versions of the same system, using Linux kernel releases as an empirical case study.",
    expectedDeliverables: [
      "Cross-repository dependency mapping tool",
      "Cloned code propagation metrics across versions",
      "Empirical study report on Linux kernel versions",
    ],
  },
  {
    title: "Automatic Patching of Similar Code Fragments",
    type: "COMSATS Listed Supervision Topic",
    availability: "Available for supervision",
    prerequisites: "AST diffing, Tree-sitter, Python, Code Clones",
    source: "Official COMSATS Supervision Listing",
    lastVerified: "July 2026",
    summary:
      "Develop a tool that propagates an approved security patch to matching vulnerable fragments across repositories that reuse the affected source code.",
    expectedDeliverables: [
      "AST-level clone matcher and patch synthesizer",
      "Automated patch propagation engine",
      "Validation against open-source CVE patches",
    ],
  },
  {
    title: "Software Vulnerability Prediction Model",
    type: "COMSATS Listed Supervision Topic",
    availability: "Available for supervision",
    prerequisites: "Machine learning, software security, Python/Scikit-learn",
    source: "Official COMSATS Supervision Listing",
    lastVerified: "July 2026",
    summary:
      "Learn repair patterns from vulnerability patches and predict the existence or likely number of vulnerable fragments in open-source software.",
    expectedDeliverables: [
      "Feature extraction pipeline from source code ASTs",
      "Vulnerability prediction model",
      "Comparative accuracy evaluation against baseline static analyzers",
    ],
  },
  {
    title: "Automatic Test Data Generation for Data Processing Systems",
    type: "COMSATS Listed Supervision Topic",
    availability: "Available for supervision",
    prerequisites: "Software testing, constraint solving, Python/Java",
    source: "Official COMSATS Supervision Listing",
    lastVerified: "July 2026",
    summary:
      "Generate valid and faulty test inputs for complex data processing systems using constraints and mutation operators, reducing the cost of manual input-space exploration.",
    expectedDeliverables: [
      "Model-based test data generator",
      "Mutation and constraint-based test vector synthesizer",
      "Benchmark test suite report",
    ],
  },
];

export const collaborators = [
  {
    name: "Danish Vasan, PhD",
    details: "Postdoctoral researcher at KFUPM; PostDoc from the University of Luxembourg; PhD from Tsinghua University.",
    email: "danish.vasan@kfupm.edu.sa",
    image: "/academic/danish-vassan.jpg",
  },
  {
    name: "Majid Mumtaz, PhD",
    details: "Assistant Professor; PhD from Tsinghua University.",
    email: "mmumtaz@ciitwah.edu.pk",
    image: "/academic/majid-mumtaz.png",
  },
];

export const eventHighlights = [
  {
    title: "IPBG Annual Workshop — SnT, Luxembourg",
    year: "2022",
    badge: "Keynote & Paper Presentation",
    venue: "Interdisciplinary Centre for Security, Reliability and Trust (SnT)",
    location: "University of Luxembourg, Luxembourg",
    summary:
      "Presented research paper on search-based automated test-data generation for complex cyber-physical systems and satellite domain software.",
  },
  {
    title: "SnT Partnership Day — University of Luxembourg",
    year: "2021",
    badge: "Research Partnership Exhibition",
    venue: "Kirchberg Campus / SnT Headquarters",
    location: "Luxembourg City, Luxembourg",
    summary:
      "Exhibited SCSA Lab research activities in software security, vulnerability detection, and automated program repair to European academic and industrial partners.",
  },
  {
    title: "IEEE International Conference on Software Testing (ICST 2019)",
    year: "2019",
    badge: "Peer-Reviewed Conference Presentation",
    venue: "IEEE Computer Society",
    location: "Xi’an, Shaanxi, China",
    summary:
      "Presented peer-reviewed research findings on automated test input generation and vulnerability assessment frameworks.",
  },
  {
    title: "IEEE Computers, Software, and Applications Conference (COMPSAC 2018)",
    year: "2018",
    badge: "International Conference Presentation",
    venue: "IEEE Computer Society",
    location: "Tokyo, Japan",
    summary:
      "Delivered conference presentation on big-data source code analysis, software clone detection, and Android malware identification.",
  },
];

export const eventGallery = [
  {
    src: "/academic/events/event-01.jpg",
    alt: "Dr. Junaid Akram presenting at the IPBG Annual Workshop at SnT",
    title: "IPBG Annual Workshop Presentation",
    caption: "Dr. Junaid Akram delivering research presentation on automated software testing at SnT, Luxembourg",
    badge: "Oral Presentation",
    category: "Workshop",
    date: "2022",
    location: "SnT, Luxembourg",
    orientation: "landscape",
    width: 1280,
    height: 951,
  },
  {
    src: "/academic/events/event-02.jpg",
    alt: "Dr. Junaid Akram presenting automated test data generation research poster",
    title: "Search-Based Test Generation Poster Session",
    caption: "Interactive poster session on automated test-data generation — IPBG Annual Workshop at SnT",
    badge: "Poster Exhibition",
    category: "Poster Session",
    date: "2022",
    location: "University of Luxembourg",
    orientation: "portrait",
    width: 1153,
    height: 1788,
  },
];

export const partnerLogos = [
  {
    name: "COMSATS University Islamabad",
    image: "/academic/comsats-university-islamabad-logo.png",
    href: "https://lahore.comsats.edu.pk/",
    role: "Host University & Research Base",
  },
  {
    name: "Tsinghua University",
    image: "/academic/tsinghua-university-logo.webp",
    href: "https://www.tsinghua.edu.cn/en/",
    role: "PhD Alma Mater & Key Lab Partner",
  },
  {
    name: "SnT, University of Luxembourg",
    image: "/academic/snt-university-luxembourg-logo.png",
    href: "https://www.uni.lu/snt-en/",
    role: "Postdoctoral Research Partner",
  },
  {
    name: "SES Satellites",
    image: "/academic/ses-logo.png",
    href: "https://www.ses.com/",
    role: "Industrial Satellite Systems Partner",
  },
  {
    name: "King Fahd University of Petroleum & Minerals",
    image: "/academic/king-fahd-university-logo.png",
    href: "https://www.kfupm.edu.sa/",
    role: "International Research Collaborator",
  },
];

export const pgResearchers = [
  {
    name: "Mahzaib Mukhtar",
    id: "FA23-RCS-005",
    degree: "MS Computer Science",
    topic: "Automated Search Based Test Data Generation for Complex Systems using UML Models",
    focus: "Software Testing & Search-Based Algorithms",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Zain Ul Abdeen",
    id: "FA23-RCS-011",
    degree: "MS Computer Science",
    topic: "LLM Based Software Vulnerability Patch Recommendation System",
    focus: "LLM Fine-Tuning & Program Repair",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Muhammad Orangzaib",
    id: "FA24-RCS-018",
    degree: "MS Computer Science",
    topic: "In-context Learning of Software Vulnerability Detection Using LLMs",
    focus: "In-Context Prompt Engineering & Security",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Ahsan Nisar",
    id: "FA24-RCS-017",
    degree: "MS Computer Science",
    topic: "Empowering a Graph Neural Network for Feature Envy Detection and Refactoring",
    focus: "Graph Neural Networks & Code Smells",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Muhammad Haris",
    id: "SP25-RCS-012",
    degree: "MS Computer Science",
    topic: "AICodeSummarizer: Optimizing Code Comment Generation through AST and CFG Structural Analysis",
    focus: "Code Summarization & AST/CFG Analysis",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Farina Iqbal",
    id: "SP25-RCS-004",
    degree: "MS Computer Science",
    topic: "Automated Test Smell Detection and Recommendation in BDD Specifications",
    focus: "BDD Specifications & Test Quality",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
  {
    name: "Hafsa Butt",
    id: "SP25-RCS-008",
    degree: "MS Computer Science",
    topic: "LLM-based Semantic-driven Approach to Detect Type-4 Code Clones",
    focus: "Semantic Code Clones & Deep Learning",
    status: "Active MS Thesis Research",
    institution: "COMSATS University Islamabad, Lahore Campus",
  },
];

export const coInvestigators = [
  {
    name: "Dr. Junaid Akram",
    role: "Lab Director & Principal Investigator",
    affiliation: "COMSATS University Islamabad / SnT Luxembourg Postdoc / Tsinghua PhD",
    specialization: "Source Code Security, Vulnerability Repair, Code Clone Detection, Software Testing",
    image: "/academic/junaid-akram-professor.jpg",
    email: "junaidakram@cuilahore.edu.pk",
    googleScholar: "https://scholar.google.com/citations?user=JunaidAkram",
    orcid: "https://orcid.org/0000-0003-1752-6124",
    researchGate: "https://www.researchgate.net/profile/Junaid-Akram",
    officialProfile: "https://lahore.comsats.edu.pk/employees/1333",
    bio: "Assistant Professor & HEC-Approved PhD Supervisor leading SCSA Lab. Former Postdoc at SnT Luxembourg & SES Satellites. PhD from Tsinghua University.",
    badge: "Lab Director",
  },
  {
    name: "Dr. Danish Vasan",
    role: "Senior Co-Investigator & International Collaborator",
    affiliation: "KFUPM Postdoc / SnT Luxembourg Postdoc / Tsinghua PhD",
    specialization: "Obfuscated Malware Detection, Ensemble Learning, IoT & Android Security",
    image: "/academic/danish-vassan.jpg",
    email: "danish.vasan@kfupm.edu.sa",
    bio: "Senior collaborator & co-author on advanced ensemble frameworks defending Windows, Android, and IoT malware systems (Applied Soft Computing 2025).",
    badge: "International Collaborator",
  },
  {
    name: "Dr. Majid Mumtaz",
    role: "Co-Investigator & Academic Partner",
    affiliation: "Assistant Professor, CUI Wah / Tsinghua PhD",
    specialization: "Software Security & System Architecture",
    image: "/academic/majid-mumtaz.png",
    email: "mmumtaz@ciitwah.edu.pk",
    bio: "Academic partner collaborating on source-code security assessment, empirical software engineering, and joint student development.",
    badge: "Academic Partner",
  },
  {
    name: "Prof. Ping Luo",
    role: "Academic Mentor & Research Collaborator",
    affiliation: "Key Laboratory of Information System Security, Tsinghua University",
    specialization: "Information Security & Program Analysis",
    image: "/academic/tsinghua-university-logo.webp",
    bio: "Key collaborator on large-scale vulnerability detection platforms (SQVDT) and token-based clone analysis across multi-billion LOC repositories.",
    badge: "Tsinghua Advisor",
  },
  {
    name: "Dr. Mohammad Hammoudeh",
    role: "Research Collaborator",
    affiliation: "Cybersecurity Chair & Senior Researcher",
    specialization: "Cybersecurity, IoT Security & Ensemble Learning",
    bio: "Collaborating researcher co-authoring high-impact cybersecurity and malware defense studies in top-tier journals.",
    badge: "Journal Co-Author",
  },
  {
    name: "Dr. Adel F. Ahmed",
    role: "Research Collaborator",
    affiliation: "Information & Computer Science Dept, KFUPM",
    specialization: "Machine Learning & Software Security",
    bio: "Collaborator on ensemble frameworks for obfuscated malware identification and threat intelligence.",
    badge: "Journal Co-Author",
  },
];

export const labMilestones = [
  {
    year: "2015 – 2020",
    era: "Phase 1",
    title: "Foundations & Distributed Code Intelligence",
    location: "Tsinghua University — Key Lab of Info System Security (Beijing, China)",
    tag: "Tsinghua Era",
    badge: "Big Data Security",
    summary: "Engineered distributed static code analysis engines indexing over 324 billion lines of code on Hadoop MapReduce and scanning 152k+ open-source repositories.",
    achievements: [
      "Built IBFET — MapReduce inverted token index scaling clone detection across 324B+ LOC.",
      "Developed SQVDT — Multi-terabyte C/C++ static vulnerability fingerprinting platform.",
      "Pioneered DroidSD — Obfuscated Android clone detection across 30,500 application APKs.",
      "Conferred PhD from Tsinghua University and published in IEEE ICST, IET InfoSec, and JISE."
    ],
    stats: { loc: "324B+", repos: "152K+", papers: "5+" }
  },
  {
    year: "2021 – 2023",
    era: "Phase 2",
    title: "Satellite CPS Testing & Postdoctoral Research",
    location: "SnT, University of Luxembourg & SES Satellites (Luxembourg)",
    tag: "European Postdoc Era",
    badge: "Industrial CPS Testing",
    summary: "Conducted postdoctoral research at the Interdisciplinary Centre for Security, Reliability and Trust (SnT) in direct industrial collaboration with SES Satellites.",
    achievements: [
      "Engineered automated model-based test data generator for SES satellite Adaptive Resource Control (ARC).",
      "Created static analyzer for identifying Behavior-Driven Development (BDD) test smells in satellite control test suites.",
      "Developed log-based test-case slicing for isolated regression execution in large-scale CPS pipelines.",
      "Presented key research at SnT Partnership Day and IPBG Annual Workshop in Luxembourg."
    ],
    stats: { system: "ARC CPS", partner: "SES Satellites", venue: "SnT Luxembourg" }
  },
  {
    year: "2023 – Present",
    era: "Phase 3",
    title: "SCSA Research Lab Establishment & AI Transformation",
    location: "COMSATS University Islamabad, Lahore Campus",
    tag: "Current SCSA Era",
    badge: "AI & Program Repair",
    summary: "Established the Source Code Security Assessment (SCSA) Research Lab at COMSATS Lahore, uniting source code analysis, LLM patch synthesis, GNN refactoring, and student mentorship.",
    achievements: [
      "Supervising 7+ active MS/PhD theses spanning LLM patch synthesis, AST/CFG code summarizers, and GNN feature envy.",
      "Supervising 12+ BS Software Engineering researchers across high-impact projects like MegiLance.",
      "Approved as HEC PhD Supervisor and established state-of-the-art vulnerability detection benchmarks.",
      "Formed joint research teams with international co-investigators from KFUPM and Tsinghua University."
    ],
    stats: { msStudents: "7 Active", supervisedTeams: "4 Teams", grants: "HEC Approved" }
  },
  {
    year: "2025 – Beyond",
    era: "Phase 4",
    title: "Autonomous Security Agents & Multimodal Defense",
    location: "Global SCSA Ecosystem (COMSATS, KFUPM, SnT, Tsinghua)",
    tag: "Future Vision",
    badge: "Next-Gen Security",
    summary: "Expanding into autonomous LLM security agents, multi-architecture malware ensemble defense, and real-time continuous vulnerability patch synthesis.",
    achievements: [
      "Published groundbreaking ensemble malware defense framework in Applied Soft Computing (Elsevier 2025).",
      "Building continuous automated security assessment pipelines for open-source ecosystem patch verification.",
      "Scaling international student exchange, industry security audits, and open-source vulnerability benchmarks."
    ],
    stats: { journal: "Elsevier '25", paradigm: "AI Security Agents", scope: "Autonomous Repair" }
  }
];

export const labPillars = [
  {
    id: "vulnerability",
    title: "Source-Level Vulnerability Intelligence",
    iconName: "ShieldCheck",
    desc: "Indexing, matching, and tracing software vulnerabilities through AST fingerprints, patch diff signatures, and multi-terabyte code similarity lookup."
  },
  {
    id: "ai-repair",
    title: "AI & LLM-Driven Program Repair",
    iconName: "Sparkles",
    desc: "Leveraging Large Language Models, in-context learning, and Graph Neural Networks (GNN) for automated security patch synthesis and refactoring."
  },
  {
    id: "testing",
    title: "Automated Verification & Software Testing",
    iconName: "Cpu",
    desc: "Search-based test data generation, model-based satellite CPS testing, BDD test smell detection, and log-based regression test slicing."
  },
  {
    id: "malware",
    title: "Obfuscation & Malware Ensemble Defense",
    iconName: "Zap",
    desc: "Token-based obfuscated code clone identification and advanced ensemble machine learning frameworks defending Windows, Android, and IoT systems."
  }
];

export const labImpactStats = [
  { label: "Lines of Code Analyzed", value: "324B+", note: "Indexed on Hadoop MapReduce" },
  { label: "Open-Source Repos Scanned", value: "152,823+", note: "SQVDT Vulnerability Engine" },
  { label: "Researchers & Students Mentored", value: "50+", note: "PhD, MS & BS Engineering Graduates" },
  { label: "Global Academic & Industry Partners", value: "5", note: "COMSATS, Tsinghua, SnT, SES, KFUPM" },
  { label: "High-Impact Publications", value: "15+", note: "Applied Soft Computing, IEEE, IET" }
];

