// fypProjects.js — Supervised Final-Year Engineering & Research Projects (COMSATS)
// Ground-truth records for undergraduate and postgraduate capstone supervision.

export const defaultFypProjects = [
  {
    "title": "MegiLance — AI and Blockchain-Powered Freelancing Platform",
    "slug": "megilance-ai-blockchain-freelancing-platform",
    "summary": "A supervised final-year engineering development project combining a full-stack freelancing marketplace with AI decision assistance and blockchain payment escrow.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Full-Stack Development",
    "category": "Full-Stack & Systems",
    "programme": "BS Software Engineering",
    "session": "2022–2026",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Ghulam Mujtaba",
        "registration": "FA22-BSE-199",
        "profileUrl": "https://github.com/ghulam-mujtaba5",
        "image": "/academic/students/ghulam-mujtaba.png"
      },
      {
        "name": "Muhammad Waqar Ul Mulk",
        "registration": "FA22-BSE-153",
        "profileUrl": "https://linkedin.com",
        "image": "/academic/students/muhammad-waqar-ul-mulk.png"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "coSupervisor": "Ms. Khula Qadeer",
    "specializations": [
      "Full-Stack Web Development",
      "Artificial Intelligence",
      "Blockchain Escrow"
    ],
    "sdgs": [
      "Industry, Innovation and Infrastructure",
      "Decent Work and Economic Growth"
    ],
    "technologies": [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Python",
      "Turso / libSQL",
      "Solidity",
      "MetaMask"
    ],
    "coverImage": "/academic/fyp/megilance-final-year-project-poster.jpeg?v=3",
    "coverAlt": "MegiLance final-year project poster",
    "gallery": [
      {
        "url": "/academic/fyp/megilance-final-year-project-poster.jpeg?v=3",
        "caption": "MegiLance Official FYP Project Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/megilance-landing-page.png?v=3",
        "caption": "MegiLance Landing Page & Platform Overview",
        "order": 2
      },
      {
        "url": "/academic/fyp/megilance-system-architecture.png?v=3",
        "caption": "System Architecture & Blockchain Escrow Layer",
        "order": 3
      },
      {
        "url": "/academic/fyp/megilance-ai-fraud-analysis.png?v=3",
        "caption": "AI Fraud Risk Analysis & Escrow Verification",
        "order": 4
      },
      {
        "url": "/academic/fyp/megilance-client-dashboard.png?v=3",
        "caption": "Client Dashboard & Job Proposal Management",
        "order": 5
      },
      {
        "url": "/academic/fyp/megilance-freelancer-earnings-dashboard.png?v=3",
        "caption": "Freelancer Earnings & Smart Contract Analytics",
        "order": 6
      },
      {
        "url": "/academic/fyp/megilance-admin-command-center.png?v=3",
        "caption": "Admin Command Center & Dispute Resolution",
        "order": 7
      },
      {
        "url": "/academic/fyp/megilance-ai-matching.png?v=3",
        "caption": "AI Talent Matching Engine",
        "order": 8
      },
      {
        "url": "/academic/fyp/megilance-ai-features.png?v=3",
        "caption": "AI Proposal Assistant & Auto-Scoring",
        "order": 9
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 1
  },
  {
    "title": "Software Vulnerability Detection using LLM Model",
    "slug": "software-vulnerability-detection-llm-model",
    "summary": "Supervised research project leveraging Large Language Models (LLMs) to detect complex software vulnerabilities in source code through fine-tuning, Abstract Syntax Tree (AST) parsing, and AST-guided prompt engineering.",
    "status": "Running",
    "categoryType": "running",
    "projectType": "Running Project",
    "isRunning": true,
    "nature": "Software Security Research",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "2023–2027 (Session SP23)",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Syed Muhammad Irtaza Shahid",
        "registration": "SP23-BSE-156"
      },
      {
        "name": "Muhammad Waleed",
        "registration": "SP23-BSE-134"
      },
      {
        "name": "Muhammad Muneeb Azhar",
        "registration": "SP23-BSE-125",
        "image": "/academic/students/muhammad-muneeb-azhar.png"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Vulnerability Detection",
      "Large Language Models",
      "Source Code Security",
      "AST Parsing"
    ],
    "technologies": [
      "Python",
      "PyTorch",
      "Hugging Face Transformers",
      "Tree-sitter",
      "CodeBERT",
      "LLaMA",
      "Docker"
    ],
    "coverImage": "/academic/fyp/vuln-detect-llm-pipeline.webp?v=3",
    "coverAlt": "Source Code Vulnerability Detection AI Pipeline Architecture",
    "problem": "Traditional static application security testing (SAST) tools rely heavily on heuristic rule matching and abstract syntax tree patterns, yielding unacceptably high false-positive rates exceeding 40% and missing complex multi-line semantic vulnerabilities. While deep learning models offer promise, they frequently struggle with long-range code dependencies, syntax boundary preservation, and token budget constraints. Addressing critical vulnerabilities such as buffer overflows (CWE-120), SQL injection (CWE-89), and improper input validation (CWE-20) requires an intelligent system capable of interpreting full syntactic context alongside developer intent.",
    "solution": "This research project develops an end-to-end vulnerability detection pipeline that fuses Abstract Syntax Tree (AST) serialization with fine-tuned Large Language Models (LLMs). Using Tree-sitter, source code is parsed into normalized syntax trees and function-level control flow graphs. We design an AST-guided prompt engineering and tokenization strategy that injects structural code invariants directly into Transformer attention heads. The model is fine-tuned on benchmark corpora including Devign, Big-Vul, and curated real-world CVEs, optimizing for precision and low false alarm rates across C/C++, Java, and Python source repositories.",
    "architecture": [
      {
        "title": "Source Code Parsing & AST Extraction",
        "detail": "Ingests raw source code files and leverages Tree-sitter to construct high-fidelity Abstract Syntax Trees and function-level control/data dependency subgraphs."
      },
      {
        "title": "Code Tokenization & Structural Embedding",
        "detail": "Normalizes identifier names, serializes hierarchical AST paths into token sequences, and injects structural position embeddings for neural consumption."
      },
      {
        "title": "Fine-Tuned LLM Reasoning Engine",
        "detail": "Employs fine-tuned transformer architectures (CodeBERT and LLaMA) to evaluate code semantics and identify subtle security vulnerability patterns."
      },
      {
        "title": "Vulnerability Classification & Explanation",
        "detail": "Outputs binary detection flags, CWE category classifications, confidence scores, and natural-language explanations highlighting precise vulnerable lines."
      }
    ],
    "objectives": [
      "Extract syntactic and semantic code features from open-source C/C++, Java, and Python codebases.",
      "Fine-tune state-of-the-art transformer-based LLMs on curated Common Weakness Enumeration (CWE) datasets.",
      "Achieve an F1-score exceeding 85% on standard vulnerability benchmarks with significantly reduced false positive rates.",
      "Provide explainable vulnerability summaries with precise line-level localisation for software engineers."
    ],
    "outcome": "The system successfully detects critical memory safety, taint propagation, and input validation vulnerabilities with an F1-score of 87.4% on the Big-Vul evaluation split, demonstrating a 32% reduction in false positives compared to standard rule-based static analyzers.",
    "contributions": [
      "Developed custom Tree-sitter AST traversal algorithms for source code normalization and tokenization.",
      "Constructed a curated vulnerability dataset mapping CVE commits to function-level diffs.",
      "Implemented an interactive dashboard for line-level vulnerability inspection and confidence score analysis."
    ],
    "limitations": [
      "High GPU inference latency when analyzing massive monolithic codebases exceeding 100k lines of code simultaneously.",
      "Sensitivity to token truncation on functions extending beyond standard model context windows."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/vuln-detect-llm-pipeline.webp?v=3",
        "caption": "Source Code Vulnerability Detection & AI Model Inference Pipeline Architecture",
        "order": 1
      },
      {
        "url": "/academic/fyp/vuln-detect-ast-prompt-tuning.webp?v=3",
        "caption": "AST-Guided Prompt Construction & Sliced Code Context Assembly",
        "order": 2
      },
      {
        "url": "/academic/fyp/vuln-detect-benchmark-evaluation.webp?v=3",
        "caption": "Cross-Language CVE Vulnerability Detection Benchmark & Precision Matrix",
        "order": 3
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 2
  },
  {
    "title": "Token-Based Semantic Code Clone Detection",
    "slug": "token-based-semantic-code-clone-detection",
    "summary": "Supervised software security project building a scalable token-based semantic code clone detection platform to capture Type-3 and Type-4 clones across large open-source repositories.",
    "status": "Running",
    "categoryType": "running",
    "projectType": "Running Project",
    "isRunning": true,
    "nature": "Code Clone Analysis",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "2023–2027 (Session SP23)",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Ali Muhammad",
        "registration": "SP23-BSE-032"
      },
      {
        "name": "Ali Murtaza",
        "registration": "SP23-BSE-033"
      },
      {
        "name": "Hafiz Muhammad Shams ul Huda",
        "registration": "SP23-BSE-067",
        "image": "/academic/students/hafiz-shams-ul-huda.png"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Code Clone Detection",
      "Semantic Analysis",
      "Software Quality",
      "Information Retrieval"
    ],
    "technologies": [
      "Python",
      "AST Parsing",
      "Tokenization",
      "Elasticsearch",
      "FastAPI",
      "Next.js"
    ],
    "coverImage": "/academic/fyp/code-clone-architecture.webp?v=3",
    "coverAlt": "Token-Based Semantic Code Clone Detection Architecture",
    "problem": "Code duplication is a major source of technical debt and security vulnerability propagation across software systems. While Type-1 (identical) and Type-2 (renamed identifier) code clones are easily discovered by traditional string matchers, Type-3 (modified statements) and Type-4 (syntactically distinct but semantically identical) clones remain notoriously difficult to detect at scale. Existing graph-based semantic clone detection techniques suffer from exponential computational complexity, making them impractical for multi-million-line repositories such as the Linux kernel or large enterprise software suites.",
    "solution": "This project implements an efficient, scalable token-based semantic code clone detection framework that captures subtle semantic similarities without graph isomorphism bottlenecks. The pipeline tokenizes source code into normalized token streams, generates multi-scale n-gram shingles, and constructs an inverted Elasticsearch index for rapid sub-linear search. For candidate pairs, the framework computes weighted Jaccard similarity and semantic token frequency distributions, enabling real-time discovery of Type-3 and Type-4 clones across heterogeneous source trees with high recall and precision.",
    "architecture": [
      {
        "title": "Lexical Tokenization & Normalization",
        "detail": "Strips whitespace and comments while normalizing identifiers and literals into canonical token representations across diverse programming languages."
      },
      {
        "title": "N-Gram Shingling & Min-Hashing",
        "detail": "Generates overlapping token n-gram sliding windows and computes compact min-hash signatures for rapid candidate pairing."
      },
      {
        "title": "Elasticsearch Indexing & Inverted Lookup",
        "detail": "Populates an inverted token index enabling sub-linear candidate pair retrieval across multi-million-line code repositories in milliseconds."
      },
      {
        "title": "Semantic Similarity Scoring & Verification",
        "detail": "Computes deep token similarity metrics, statement edit distances, and categorizes clone pairs across Type-1, Type-2, Type-3, and Type-4 clone classes."
      }
    ],
    "objectives": [
      "Design a scalable lexical tokenizer supporting multiple languages (C, C++, Java, Python).",
      "Implement inverted index architecture to search millions of lines of code in seconds.",
      "Benchmark detection accuracy on the BigCloneBench dataset against classical clone detectors.",
      "Develop an interactive visual report highlighting matched clone fragments side-by-side."
    ],
    "outcome": "Demonstrated sub-second clone search across 2.5 million lines of code with a 91.2% precision rate on BigCloneBench Type-3 and Type-4 clones, outperforming legacy text-based tokenizers.",
    "contributions": [
      "Engineered a language-agnostic token abstraction engine with customizable token weights.",
      "Built a high-performance clone search index powered by Elasticsearch and FastAPI.",
      "Created a side-by-side diff visualizer for comparing matched code clone blocks."
    ],
    "limitations": [
      "Lower recall on complex Type-4 clones involving algorithmic transformations with zero lexical overlap."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/code-clone-architecture.webp?v=3",
        "caption": "Token-Based Semantic Code Clone Detection System Architecture Overview",
        "order": 1
      },
      {
        "url": "/academic/fyp/code-clone-token-pipeline.webp?v=3",
        "caption": "Token-Based Lexical & Semantic Code Clone Detection Pipeline",
        "order": 2
      },
      {
        "url": "/academic/fyp/code-clone-ast-similarity.webp?v=3",
        "caption": "Abstract Syntax Tree (AST) Subtree Isomorphism & Vector Embedding",
        "order": 3
      },
      {
        "url": "/academic/fyp/code-clone-semantic-benchmark.webp?v=3",
        "caption": "BigCloneBench Evaluation & Semantic Type-4 Clone Classification Matrix",
        "order": 4
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 3
  },
  {
    "title": "LLM-based Software Vulnerability Patch Optimizer",
    "slug": "llm-based-vulnerability-patch-optimizer",
    "summary": "Supervised research project developing an automated patch optimization engine powered by LLMs that synthesizes and verifies security patch suggestions for vulnerable code snippets.",
    "status": "Running",
    "categoryType": "running",
    "projectType": "Running Project",
    "isRunning": true,
    "nature": "Automated Program Repair",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "2023–2027 (Session FA23)",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Urwa Kamal",
        "registration": "FA23-BSE-190"
      },
      {
        "name": "Maha Khawar",
        "registration": "FA23-BSE-073"
      },
      {
        "name": "Laiba Amir",
        "registration": "FA23-BSE-067"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Vulnerability Patching",
      "Program Repair",
      "LLM Optimization",
      "Docker Sandboxing"
    ],
    "technologies": [
      "Python",
      "LLM Fine-tuning",
      "Git Diff Parser",
      "Docker",
      "PyTorch",
      "FastAPI"
    ],
    "coverImage": "/academic/fyp/llm-patch-system-architecture.webp?v=3",
    "coverAlt": "LLM-Based Vulnerability Patch Optimizer System Architecture",
    "problem": "When security vulnerabilities are discovered in production software, manual patch creation is slow, error-prone, and requires deep security domain expertise. Automated Program Repair (APR) tools frequently generate plausibly compilable patches that nonetheless introduce regression bugs or fail to completely neutralize the security defect. Furthermore, existing patch generation systems lack automated verification pipelines to test patch correctness in secure, sandboxed execution environments before production deployment.",
    "solution": "This project builds an automated vulnerability patch synthesis and optimization engine that couples Large Language Models with automated regression verification. When supplied with a vulnerable function and its corresponding CVE description, the optimizer retrieves relevant security patch patterns from a historical knowledge base using Retrieval-Augmented Generation (RAG). The LLM generates candidate patches that preserve original code invariants. Each candidate is automatically compiled and evaluated inside isolated Docker containers against targeted security test vectors and regression test suites.",
    "architecture": [
      {
        "title": "Vulnerability Ingestion & Context Retrieval",
        "detail": "Extracts vulnerable code snippets, CVE advisories, and retrieves related historical patch templates via vector-based RAG."
      },
      {
        "title": "LLM Patch Synthesis Engine",
        "detail": "Generates candidate code diffs using prompt templates constrained by coding style, AST boundaries, and semantic syntax rules."
      },
      {
        "title": "Dockerized Compilation & Test Sandbox",
        "detail": "Compiles patched source code in isolated containers and executes automated unit and security regression test suites."
      },
      {
        "title": "Patch Optimization & Ranking",
        "detail": "Evaluates patch cleanliness, test pass rates, and outputs the optimal verified patch diff with a natural language explanation."
      }
    ],
    "objectives": [
      "Synthesize compilable security patches for top CWE categories (CWE-79, CWE-89, CWE-119).",
      "Automate verification using isolated Docker test sandboxes and continuous test runners.",
      "Minimize regression side effects through syntax-preserving prompt constraints.",
      "Produce clean Git diffs ready for direct pull request submission."
    ],
    "outcome": "Successfully synthesized and verified functional security patches for 68% of benchmarked vulnerabilities in the Defects4J and Vulncode-DB datasets, reducing manual remediation turnaround time.",
    "contributions": [
      "Created a RAG-powered vulnerability patch retrieval corpus mapping CVEs to fixing commits.",
      "Designed automated Docker sandbox test orchestration for multi-language patching.",
      "Developed a clean Git diff patch exporter with security verification badges."
    ],
    "limitations": [
      "Limited to vulnerabilities with existing automated test suites capable of validating patch efficacy."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/llm-patch-system-architecture.webp?v=3",
        "caption": "4-Layer LLM Vulnerability Patching & Automated Repair System Architecture",
        "order": 1
      },
      {
        "url": "/academic/fyp/llm-patch-prompt-architecture.webp?v=3",
        "caption": "Few-Shot Prompt Engineering & AST-Constrained Patch Generation Architecture",
        "order": 2
      },
      {
        "url": "/academic/fyp/llm-patch-docker-validation.webp?v=3",
        "caption": "Containerized Automated Test Execution & Patch Verification Harness",
        "order": 3
      },
      {
        "url": "/academic/fyp/llm-patch-cve-repair-benchmarks.webp?v=3",
        "caption": "LLM-Guided Remediation & Candidate Patch Generation Workflow",
        "order": 4
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 4
  },
  {
    "title": "Feature Envy Detection and Refactoring System & Visualization",
    "slug": "feature-envy-detection-refactoring-system",
    "summary": "Supervised intelligent code smell detection tool targeting Feature Envy through AST structural analysis, Graph Neural Networks, and automated refactoring recommendations with interactive visual analytics.",
    "status": "Running",
    "categoryType": "running",
    "projectType": "Running Project",
    "isRunning": true,
    "nature": "Code Smell & Refactoring",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "2023–2027 (Session FA23)",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Muhammad Soman Saeed",
        "registration": "FA23-BSE-138"
      },
      {
        "name": "Hadeeq Ahmed",
        "registration": "FA23-BSE-205"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Feature Envy Detection",
      "Graph Neural Networks",
      "Code Refactoring",
      "Visual Analytics"
    ],
    "technologies": [
      "Python",
      "PyTorch Geometric",
      "AST Parsing",
      "React",
      "D3.js",
      "Tree-sitter"
    ],
    "coverImage": "/academic/fyp/feature-envy-gnn-architecture.webp?v=3",
    "coverAlt": "Feature Envy Detection & Refactoring Workflow Architecture",
    "problem": "Code smells such as Feature Envy—where a method accesses data or methods of another class more than its host class—severely degrade software modularity, increase coupling, and complicate long-term maintenance. Traditional metric-based detection rules (e.g., Access to Foreign Data and Locality of Data) produce excessive false positives because they fail to capture rich graph-level relationships between methods and attributes across complex object-oriented systems.",
    "solution": "This project presents an intelligent code smell detection and automated refactoring suite powered by Graph Neural Networks (GNNs) and Program Dependence Graphs (PDGs). Source code is transformed into typed dependency graphs where nodes represent classes, methods, and fields, and edges represent call and access relationships. A Graph Convolutional Network (GCN) predicts Feature Envy instances with high confidence and automatically generates safe 'Move Method' refactoring suggestions. An interactive visual analytics dashboard visualizes the class coupling graph before and after refactoring.",
    "architecture": [
      {
        "title": "Program Dependence Graph (PDG) Construction",
        "detail": "Parses Java and Python source code into comprehensive class-attribute-method dependency graphs capturing call frequencies and data access flows."
      },
      {
        "title": "Graph Embedding & GNN Inference",
        "detail": "Applies Graph Convolutional Networks over the PDG to identify structural coupling anomalies and classify Feature Envy smells."
      },
      {
        "title": "Automated Refactoring Engine",
        "detail": "Computes Move Method transformations while maintaining semantic equivalence and signature compatibility."
      },
      {
        "title": "Interactive Visual Coupling Analytics",
        "detail": "Renders real-time D3.js dependency graph visualizations comparing pre- and post-refactoring coupling metrics."
      }
    ],
    "objectives": [
      "Construct accurate class dependency graphs from Java and Python projects.",
      "Train a GNN model on open-source repositories to classify Feature Envy smells.",
      "Generate automated, compile-safe Move Method refactoring diffs.",
      "Provide interactive D3.js visualizations showing coupling and cohesion improvements."
    ],
    "outcome": "Achieved a 92.4% detection accuracy on standard benchmark software suites and generated automated refactoring patches that reduced cross-class coupling by an average of 34%.",
    "contributions": [
      "Engineered a PDG graph extractor using Tree-sitter and Spoon AST.",
      "Built a GNN classification model specialized in object-oriented coupling smells.",
      "Implemented an interactive D3.js graph visualizer for refactoring analysis."
    ],
    "limitations": [
      "Currently restricted to object-oriented architectures where methods have clear target candidate classes."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/feature-envy-gnn-architecture.webp?v=3",
        "caption": "Feature Envy Detection, AST/CFG Feature Extraction & Refactoring Workflow",
        "order": 1
      },
      {
        "url": "/academic/fyp/feature-envy-ast-refactoring-graph.webp?v=3",
        "caption": "Class Dependency Call-Graph & Method-Level Distance Heatmap",
        "order": 2
      },
      {
        "url": "/academic/fyp/feature-envy-detection-matrix.webp?v=3",
        "caption": "Automated Move Method Refactoring Recommendation & Quality Verification Matrix",
        "order": 3
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 5
  },
  {
    "title": "MultiSense: Web-Based AI Screening for Psychological & Autism Spectrum Disorders",
    "slug": "multisense-ai-screening-psychological-disorders",
    "summary": "Supervised multi-modal web-based AI screening platform combining vision analytics, behavioral questionnaires, and machine learning models for early screening of autism spectrum and psychological disorders.",
    "status": "Running",
    "categoryType": "running",
    "projectType": "Running Project",
    "isRunning": true,
    "nature": "AI Healthcare & Screening",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "2023–2027 (Session SP26)",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "SP26SE52 Student Team",
        "registration": "SP26SE52"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "AI Healthcare",
      "Computer Vision",
      "Psychological Screening"
    ],
    "technologies": [
      "Python",
      "OpenCV",
      "TensorFlow",
      "Next.js",
      "TailwindCSS"
    ],
    "coverImage": "/academic/fyp/multisense-screening-pipeline.webp?v=3",
    "coverAlt": "MultiSense Multimodal AI Screening Pipeline Architecture",
    "gallery": [
      {
        "url": "/academic/fyp/multisense-screening-pipeline.webp?v=3",
        "caption": "MultiSense Multimodal AI for Preliminary Screening of ASD and ADHD Architecture",
        "order": 1
      },
      {
        "url": "/academic/fyp/multisense-platform-architecture.webp?v=3",
        "caption": "MultiSense End-to-End System Workflow & Guardian/Admin Architecture",
        "order": 2
      },
      {
        "url": "/academic/fyp/multisense-model-training.webp?v=3",
        "caption": "Vision Transformer (DeiT3) Hyperparameter Setup & Training Configuration",
        "order": 3
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 6
  },
  {
    "title": "Robust Android Malware Detector",
    "slug": "robust-android-malware-detector",
    "summary": "Completed supervised project implementing static disassembly analysis, APK opcode feature vectors, MobSF sandbox behavioral analysis, and ensemble machine learning classifiers with weighted risk scoring for resilient Android malware detection.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Malware Research",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "Spring 2026",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Sunnia Irfan",
        "registration": "FA22-BSE-007",
        "profileUrl": "",
        "image": ""
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Android Malware",
      "Apktool Disassembly",
      "Random Forest Classifier",
      "XGBoost",
      "MobSF Sandbox",
      "Weighted Risk Scoring"
    ],
    "technologies": [
      "Python",
      "Apktool",
      "Androguard",
      "Scikit-learn",
      "XGBoost",
      "MobSF",
      "VirusTotal API",
      "FastAPI"
    ],
    "coverImage": "/academic/fyp/robust-android-malware-detector-poster.webp?v=3",
    "coverAlt": "Robust Android Malware Detector Poster",
    "problem": "Smartphones are now critical endpoints of personal and organizational operations and thus are prime targets for zero-day exploits, evasive malware, and data theft. Existing mobile anti-malware and mobile device management systems rely predominantly on rigid signature-based detection that compromises user privacy and easily fails against code obfuscation, identifier renaming, and dynamic API reflection.",
    "solution": "This supervised research project delivers a privacy-centric hybrid Android malware classification system. Combining on-device machine learning with global threat intelligence, MobSF sandbox-assisted behavioral analysis, and a weighted multi-source risk algorithm, the system extracts Dalvik opcode sequences, dangerous permissions, and API call graphs into dense feature vectors to reliably identify malicious APK packages without requiring time-consuming runtime emulation.",
    "architecture": [
      {
        "title": "APK Decompilation & Manifest Parsing (AD-05)",
        "detail": "Extracts AndroidManifest.xml and disassembles Dalvik bytecode into Smali opcode representations using Apktool and Androguard."
      },
      {
        "title": "Static Feature Vector Extraction & ML Prediction (AD-04)",
        "detail": "Mines dangerous permission requests, API call graphs, and opcode n-gram frequencies into dense feature vectors evaluated by ensemble classifiers (Random Forest, Extra Trees, XGBoost)."
      },
      {
        "title": "Sandbox & Dynamic Analysis (AD-06)",
        "detail": "Integrates with MobSF sandbox engine to conduct static and dynamic behavioral inspection, detecting sensitive network calls, dropped payloads, and dangerous intent filters."
      },
      {
        "title": "Multi-Engine Scanning (AD-07)",
        "detail": "Queries multi-engine threat intelligence feeds (VirusTotal) to cross-reference known malware signatures across 60+ AV detection engines."
      },
      {
        "title": "Weighted Multi-Source Risk Scoring (AD-08)",
        "detail": "Executes a custom weighted risk algorithm combining on-device ML probability, VirusTotal detection rates, static permission risks, and dynamic behavior scores into a normalized 0-100 threat score."
      }
    ],
    "objectives": [
      "Automate high-throughput static disassembly of Android APK packages without root permissions.",
      "Extract discriminative opcode frequency patterns resilient to renaming obfuscation.",
      "Integrate MobSF sandbox analysis and multi-engine threat verification.",
      "Develop a weighted multi-source risk algorithm (VirusTotal, Static, Dynamic, ML).",
      "Deploy a responsive web dashboard for real-time app inventory, APK threat scoring, and analysis reporting."
    ],
    "outcome": "Achieved 96.8% detection accuracy with a 1.2% false alarm rate on a benchmark corpus of 12,000 Android APKs, reliably detecting advanced malware, ransomware, adware, and trojan variants such as NetHunter with comprehensive risk breakdowns.",
    "contributions": [
      "Constructed an automated APK disassembly and feature extraction pipeline.",
      "Trained an ensemble classifier optimized for fast inference on modest hardware.",
      "Implemented a weighted 4-source risk assessment engine integrating VirusTotal and MobSF.",
      "Built interactive Security Dashboard and Uploaded Apps inspection interfaces."
    ],
    "limitations": [
      "Cannot detect zero-day malware that downloads and executes encrypted native payloads dynamically at runtime."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/robust-android-malware-detector-poster.webp?v=3",
        "caption": "Robust Android Malware Detector — Official Final Year Project Research Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/robust-android-malware-security-dashboard.webp?v=3",
        "caption": "Security Dashboard — Real-time Android Malware Detection Insights & Device Inventory",
        "order": 2
      },
      {
        "url": "/academic/fyp/robust-android-malware-uploaded-apps.webp?v=3",
        "caption": "Uploaded Apps Management — MobSF Connected Sandbox APK Analysis & Multi-Engine Verification",
        "order": 3
      },
      {
        "url": "/academic/fyp/robust-android-malware-risk-analysis.webp?v=3",
        "caption": "Analysis Results — Weighted Multi-Source Risk Algorithm Score (78.5/100 Malicious) & Threat Breakdown",
        "order": 4
      }
    ],
    "published": true,
    "featured": true,
    "displayOrder": 7
  },
  {
    "title": "HemaAI — Diagnostic Intelligence System",
    "slug": "hemaai-diagnostic-intelligence-system",
    "summary": "Completed biomedical machine learning project deploying deep convolutional neural networks to classify blood cell microscopic images and detect diagnostic anomalies automatically.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Medical AI Research",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "Spring 2026",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "HemaAI Student Team"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Medical Image AI",
      "Convolutional Neural Networks",
      "Cell Classification"
    ],
    "technologies": [
      "Python",
      "TensorFlow",
      "OpenCV",
      "Flask / React"
    ],
    "gallery": [],
    "published": true,
    "featured": false,
    "displayOrder": 8
  },
  {
    "title": "XSSNIPER — ML-Enhanced XSS Vulnerability Detection & Defense System",
    "slug": "xss-vulnerability-detection-defense",
    "summary": "Completed web security capstone project delivering an automated Cross-Site Scripting (XSS) static code auditor, ML pre/post filter, and dynamic browser defense extension.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Web Application Security",
    "category": "Vulnerability & Security",
    "programme": "BS Computer Science",
    "session": "Spring 2026",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Sheheryar Altaf",
        "registration": "FA22-BCS-043"
      },
      {
        "name": "Maryam Aasim",
        "registration": "FA22-BCS-141"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "XSS Defense",
      "Web Security Auditing",
      "Browser Extension Security",
      "Taint Analysis",
      "XSStrike ML Filter"
    ],
    "technologies": [
      "JavaScript",
      "Python",
      "DOM Analysis",
      "Node.js",
      "Chrome Extension API",
      "Machine Learning"
    ],
    "coverImage": "/academic/fyp/xss-vulnerability-poster.webp?v=3",
    "coverAlt": "XSSNIPER — ML-Enhanced XSS Scanner Research Poster",
    "problem": "Cross-Site Scripting (XSS)—encompassing Stored, Reflected, and DOM-based variants—consistently ranks among the most prevalent OWASP Top 10 web vulnerabilities. Web applications frequently employ flawed regular expressions or incomplete HTML sanitization routines that sophisticated attackers can bypass with polyglot payloads, leading to session hijacking, credential theft, and unauthorized actions.",
    "solution": "This completed project delivers a dual-layer XSS security ecosystem: an automated static code scanner that audits server-side and client-side JavaScript/HTML for insecure data sinks (e.g., innerHTML, eval, document.write), and a lightweight browser defense extension that monitors runtime DOM mutations and enforces strict Contextual Content Security Policies (CSP). By intercepting taint flows before execution, the system prevents payload detonation with zero noticeable browser latency.",
    "architecture": [
      {
        "title": "Static Code Taint Analysis",
        "detail": "Analyzes JavaScript source code and AST nodes to trace untrusted inputs to dangerous sink functions."
      },
      {
        "title": "Sanitizer Efficacy Validation",
        "detail": "Tests sanitization routines against automated XSS polyglot fuzzing vectors."
      },
      {
        "title": "Runtime DOM Defense Extension",
        "detail": "Hooks browser DOM mutation observers to detect and block reflected and stored injection vectors in real time."
      },
      {
        "title": "Security Dashboard & Audit Reports",
        "detail": "Produces vulnerability reports with line-level code fixes and recommended CSP headers."
      }
    ],
    "objectives": [
      "Build a static AST scanner to detect Stored, Reflected, and DOM XSS vulnerabilities.",
      "Develop a browser extension that enforces real-time client-side DOM defense.",
      "Benchmark against OWASP Benchmark and vulnerable web applications (DVWA, Juice Shop)."
    ],
    "outcome": "Detected 94% of DOM and reflected XSS test cases across benchmark web applications and successfully blocked 100% of tested polyglot attack vectors in the browser runtime.",
    "contributions": [
      "Built an AST-based taint analysis engine for modern JavaScript and React codebases.",
      "Developed and packaged a Chromium-compatible security extension.",
      "Compiled a comprehensive testing suite of modern XSS bypass vectors."
    ],
    "limitations": [
      "Browser extension defense requires client installation and does not replace the necessity of server-side sanitization."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/xss-vulnerability-poster.webp?v=3",
        "caption": "XSSNIPER — ML-Enhanced XSS Scanner Research Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/xss-sniper-dashboard.webp?v=3",
        "caption": "XSS Sniper Interactive Web Vulnerability Analysis & Scanning Dashboard",
        "order": 2
      },
      {
        "url": "/academic/fyp/xss-sniper-attack-analysis.webp?v=3",
        "caption": "Payload Mutation & Exploitation Vector Deep-Dive Analysis",
        "order": 3
      },
      {
        "url": "/academic/fyp/xss-sniper-scan-results.webp?v=3",
        "caption": "Real-time Attack Telemetry, Sanitization Verification & Severity Breakdown",
        "order": 4
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 9
  },
  {
    "title": "Cric-Craft — AI Cricket Performance Analysis System",
    "slug": "cric-craft-ai-cricket-analysis-system",
    "summary": "Completed sports analytics platform combining computer vision for ball-tracking, player biomechanics assessment, and statistical match prediction.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Computer Vision Analytics",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Ehtisham Ahmed Gondal",
        "registration": "SP22-BSE-112"
      },
      {
        "name": "Syeda Saleha Khubaib",
        "registration": "SP22-BSE-100"
      },
      {
        "name": "Hafiz Mutahar Hashmi",
        "registration": "SP22-BSE-030"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Computer Vision",
      "YOLO Object Tracking",
      "Sports Analytics"
    ],
    "technologies": [
      "Python",
      "OpenCV",
      "YOLOv8",
      "Streamlit"
    ],
    "coverImage": "/academic/fyp/cric-craft-ball-analysis.webp?v=3",
    "coverAlt": "Cric-Craft Match Footage & Ball Delivery Analysis",
    "gallery": [
      {
        "url": "/academic/fyp/cric-craft-ball-analysis.webp?v=3",
        "caption": "Cric-Craft Video Stroke Recognition & Delivery Tracking Interface",
        "order": 1
      },
      {
        "url": "/academic/fyp/cric-craft-match-scorecard.webp?v=3",
        "caption": "Automated Match Scorecard & Ball-by-Ball Analytics Dashboard",
        "order": 2
      },
      {
        "url": "/academic/fyp/cric-craft-video-annotation.webp?v=3",
        "caption": "Match Summary, Squad Selection & Team Analytics View",
        "order": 3
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 10
  },
  {
    "title": "ApneaGuard AI — Sleep Apnea Detection System",
    "slug": "apneaguard-ai-sleep-apnea-detection",
    "summary": "Completed biomedical signal processing system utilizing audio sensor processing and machine learning to detect nocturnal sleep apnea events in real time.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Biomedical AI Research",
    "category": "AI & Machine Learning",
    "programme": "BS Computer Science",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Husnain Sardar",
        "registration": "SP22-BCS-087"
      },
      {
        "name": "Taha Waheed",
        "registration": "SP22-BCS-012"
      },
      {
        "name": "Rida Zahra",
        "registration": "SP22-BCS-105"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Biomedical Signal Processing",
      "Acoustic Classification",
      "Real-Time Monitoring"
    ],
    "technologies": [
      "Python",
      "Librosa",
      "Signal Processing",
      "React Native"
    ],
    "coverImage": "/academic/fyp/apneaguard-poster.webp?v=3",
    "coverAlt": "ApneaGuard AI Project Poster",
    "gallery": [
      {
        "url": "/academic/fyp/apneaguard-poster.webp?v=3",
        "caption": "ApneaGuard AI Nocturnal Sleep Monitoring System Official Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/apneaguard-dashboard.webp?v=3",
        "caption": "Deep Learning Ensemble (InceptionTime) Biosignal Apnea Detection Architecture",
        "order": 2
      },
      {
        "url": "/academic/fyp/apneaguard-telemetry-monitor.webp?v=3",
        "caption": "ApneaGuard 3-Tier Cloud & IoT System Architecture",
        "order": 3
      },
      {
        "url": "/academic/fyp/apneaguard-mobile-interface.webp?v=3",
        "caption": "ApneaGuard Mobile Companion — Telehealth & Specialist Consultation Interface",
        "order": 4
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 11
  },
  {
    "title": "Vulnerability Management & Benchmarking System (VBS)",
    "slug": "vulnerability-management-benchmarking-system",
    "summary": "Completed software vulnerability management platform aggregating CVE repositories, automated severity scoring, and code vulnerability tracking across enterprise projects.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Vulnerability Infrastructure",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Mustafa Tariq",
        "registration": "SP22-BSE-119"
      },
      {
        "name": "Abdul Rehman",
        "registration": "SP22-BSE-014"
      },
      {
        "name": "Syed Muhammad Umer Ijaz",
        "registration": "SP22-BSE-049"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "CVE Management",
      "Vulnerability Benchmarking",
      "Security Dashboard",
      "CVSS Scoring"
    ],
    "technologies": [
      "Python",
      "Django",
      "PostgreSQL",
      "NVD API",
      "React"
    ],
    "coverImage": "/academic/fyp/vulnerability-patch-recommendation-poster.webp?v=3",
    "coverAlt": "Automated Vulnerability Detection and Patch Recommendation System Poster",
    "problem": "Modern software development teams grapple with thousands of reported Common Vulnerabilities and Exposures (CVEs) across third-party dependencies and internal codebases. Security teams lack unified platforms that can aggregate multi-source vulnerability feeds, compute realistic contextual exploitability scores, track patch remediation lifecycles, and benchmark tool detection efficacy against standard ground-truth corpora.",
    "solution": "The Vulnerability Management & Benchmarking System (VBS) is an enterprise-grade academic platform that integrates with the National Vulnerability Database (NVD), GitHub Security Advisories, and CVE repositories. VBS normalizes vulnerability advisories, calculates Common Vulnerability Scoring System (CVSS v3.1) metrics alongside Exploit Prediction Scoring System (EPSS) probabilities, and tracks remediation SLAs across connected repositories with automated vulnerability benchmarking.",
    "architecture": [
      {
        "title": "Multi-Source Feed Ingestion",
        "detail": "Automatically fetches and parses updates from NVD, GitHub Advisory Database, and security mailing lists."
      },
      {
        "title": "Vulnerability Normalization & Scoring",
        "detail": "Maps entries to CWE categories, CVSS v3.1 vectors, and computes EPSS exploitability probabilities."
      },
      {
        "title": "Repository Dependency Mapping",
        "detail": "Scans project Software Bills of Materials (SBOM) and correlates vulnerable components to active codebases."
      },
      {
        "title": "Benchmarking & SLA Analytics",
        "detail": "Provides executive security dashboards, remediation tracking, and benchmark tool comparisons."
      }
    ],
    "objectives": [
      "Aggregate real-time vulnerability intelligence from multiple authoritative repositories.",
      "Implement automated CVSS and EPSS scoring correlation.",
      "Provide benchmark datasets for evaluating commercial and academic static analysis tools.",
      "Deliver an intuitive web dashboard for tracking patch completion and compliance."
    ],
    "outcome": "Aggregated over 180,000 CVE records into a queryable relational database and benchmarked 5 leading static analysis tools against curated CWE test cases.",
    "contributions": [
      "Engineered automated ETL pipelines for NVD and GitHub Advisory feeds.",
      "Designed a relational schema optimized for multi-dimensional vulnerability search.",
      "Built interactive analytics dashboards using Django, PostgreSQL, and React."
    ],
    "limitations": [
      "Dependent on upstream availability and update latency of public CVE and NVD feeds."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/vulnerability-patch-recommendation-poster.webp?v=3",
        "caption": "Automated Vulnerability Detection and Patch Recommendation System Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/vbs-benchmark-dashboard.webp?v=3",
        "caption": "Clone Detector — Interactive Vulnerability & Patch Analysis Dashboard",
        "order": 2
      },
      {
        "url": "/academic/fyp/vbs-cve-evaluation.webp?v=3",
        "caption": "Security Fix Validation & Code Analysis History Repository",
        "order": 3
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 12
  },
  {
    "title": "Code Smell Detection and Refactoring System",
    "slug": "code-smell-detection-refactoring-system",
    "summary": "Completed static code analysis suite detecting structural code smells (God Class, Long Method, Feature Envy) and generating safe automated refactoring patches.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Software Quality Research",
    "category": "Full-Stack & Systems",
    "programme": "BS Software Engineering",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Yaseen Nazir",
        "registration": "SP22-BSE-111"
      },
      {
        "name": "Haider Abbas",
        "registration": "SP22-BSE-022"
      },
      {
        "name": "Muhammad Ubaidullah",
        "registration": "SP22-BSE-133"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Code Smells",
      "AST Analysis",
      "Automated Refactoring",
      "Software Metrics"
    ],
    "technologies": [
      "Java",
      "Spoon AST",
      "Python",
      "React",
      "Tree-sitter"
    ],
    "coverImage": "/academic/fyp/code-smell-detection-poster.webp?v=3",
    "coverAlt": "Code Smells Detection & Refactoring Research Poster",
    "problem": "Structural code smells like God Classes, Long Methods, and Spaghetti Code heavily increase code complexity and defect propensity while complicating software testing and maintenance. Developers frequently overlook these smells during code reviews due to lack of automated diagnostic tools capable of proposing safe, compile-verifiable refactorings.",
    "solution": "This project provides an automated static analysis suite built on Spoon AST and Tree-sitter. It evaluates software metrics (Cyclomatic Complexity, LCOM, WMC) to pinpoint critical structural code smells and automatically synthesizes Extract Method and Move Method refactoring diffs verified against test suites.",
    "architecture": [
      {
        "title": "AST Metric Extraction",
        "detail": "Computes method-level and class-level complexity metrics using Spoon AST analysis."
      },
      {
        "title": "Smell Detection Classifier",
        "detail": "Applies rule-based thresholds and machine learning classifiers to flag structural defects."
      },
      {
        "title": "Automated Patch Generation",
        "detail": "Synthesizes clean AST refactorings ensuring preserved program semantics."
      }
    ],
    "objectives": [
      "Detect God Class and Long Method code smells across enterprise Java projects.",
      "Synthesize automated refactoring diffs with zero syntax regressions."
    ],
    "outcome": "Detected over 450 code smells across benchmark repositories with an automated refactoring success rate exceeding 88%.",
    "contributions": [
      "Engineered automated Spoon AST transformation scripts.",
      "Designed an interactive web interface for inspecting refactoring proposals."
    ],
    "limitations": [
      "Large refactorings spanning multiple interdependent packages require human validation."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/code-smell-detection-poster.webp?v=3",
        "caption": "Code Smells Detection and Refactoring System Official Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/code-smell-dataset-pipeline.webp?v=3",
        "caption": "Feature Envy Dataset Construction & CodeT5 Fine-Tuning Pipeline",
        "order": 2
      },
      {
        "url": "/academic/fyp/code-smell-analysis-dashboard.webp?v=3",
        "caption": "Codify Code Smell Distribution & Quality Assessment Dashboard",
        "order": 3
      },
      {
        "url": "/academic/fyp/code-smell-code-inspector.webp?v=3",
        "caption": "Codify In-Editor Code Smell & Utility Class Refactoring View",
        "order": 4
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 13
  },
  {
    "title": "Source Code Structure Capturing & Recommendation",
    "slug": "source-code-structure-capturing-recommendation",
    "summary": "Completed research project capturing hierarchical Abstract Syntax Tree and Control Flow Graph structures to recommend software architectural improvements.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Software Architecture",
    "category": "Full-Stack & Systems",
    "programme": "BS Software Engineering",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "Source Code Structure Team"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "AST Structure",
      "CFG Extraction",
      "Architecture Recommendation",
      "Modularity"
    ],
    "technologies": [
      "Python",
      "Tree-sitter",
      "Graphviz",
      "Next.js",
      "NetworkX"
    ],
    "coverImage": "/academic/fyp/source-code-structure-poster.webp?v=3",
    "coverAlt": "Clarifai Code Structure Capturing & Recommendation Poster",
    "problem": "As software systems expand over years of continuous development, architectural decay occurs: module boundaries blur, cyclic dependencies proliferate, and component coupling increases. Developers lack automated tools that can visualize high-level structural patterns from raw source code and recommend actionable refactoring strategies to restore clean architectural integrity.",
    "solution": "This project constructs an automated architectural analysis engine that extracts Abstract Syntax Trees (AST) and Control Flow Graphs (CFG) from large multi-package codebases. The tool maps inter-package communication, identifies cyclic dependencies and god classes, and applies hierarchical clustering algorithms to recommend modular component reorganizations that improve cohesion while minimizing cross-boundary couplings.",
    "architecture": [
      {
        "title": "Source Parsing & Multi-Level Graph Extraction",
        "detail": "Extracts AST nodes, symbol tables, and inter-module call graphs using Tree-sitter."
      },
      {
        "title": "Structural Metric Computation",
        "detail": "Calculates cohesion (LCOM), coupling (CBO), and detects circular dependency chains."
      },
      {
        "title": "Hierarchical Architecture Clustering",
        "detail": "Applies graph clustering algorithms to synthesize optimized module boundaries."
      },
      {
        "title": "Interactive Visual Architecture Explorer",
        "detail": "Generates interactive Graphviz and web visualizations of software package structures."
      }
    ],
    "objectives": [
      "Parse large C, C++, Java, and Python codebases into unified structural graph models.",
      "Compute standard object-oriented and architectural quality metrics automatically.",
      "Generate automated architectural refactoring recommendations.",
      "Render interactive visual structural maps for software engineers."
    ],
    "outcome": "Analyzed open-source codebases exceeding 500,000 lines of code, identifying and proposing modularization refactorings that reduced cyclic dependencies by 45%.",
    "contributions": [
      "Built a multi-language AST parser for structural graph extraction.",
      "Implemented modularity clustering algorithms tailored for software architecture.",
      "Designed an interactive web-based structural visualization interface."
    ],
    "limitations": [
      "Requires manual domain review to ensure recommended component groupings match business domain boundaries."
    ],
    "gallery": [
      {
        "url": "/academic/fyp/source-code-structure-poster.webp?v=3",
        "caption": "Clarifai Code Structure Capturing and Recommendation Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/source-structure-architecture.webp?v=3",
        "caption": "Clarifai 4-Layer System Architecture: UI, Application, Processing & Data Layers",
        "order": 2
      },
      {
        "url": "/academic/fyp/source-structure-cfg-graph.webp?v=3",
        "caption": "Interactive Control Flow Graph (CFG) Extraction & Method Visualizer",
        "order": 3
      },
      {
        "url": "/academic/fyp/source-structure-dependency-graph.webp?v=3",
        "caption": "Clarifai Code Preview & AST Analysis Workspace",
        "order": 4
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 14
  },
  {
    "title": "AI Dermatologist Diagnostic Platform",
    "slug": "ai-dermatologist-diagnostic-platform",
    "summary": "Completed computer vision healthcare system utilizing deep convolutional networks for automated skin lesion segmentation and dermatological risk classification.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Computer Vision Research",
    "category": "AI & Machine Learning",
    "programme": "BS Computer Science",
    "session": "Fall 2025",
    "institution": "COMSATS University Islamabad, Lahore Campus",
    "students": [
      {
        "name": "AI Dermatologist Team"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Computer Vision",
      "Lesion Segmentation",
      "Dermatology AI"
    ],
    "technologies": [
      "Python",
      "PyTorch",
      "EfficientNet",
      "Flask"
    ],
    "coverImage": "/academic/fyp/ai-dermatologist-poster.webp?v=3",
    "coverAlt": "AI Dermatologist Official Project Poster",
    "published": true,
    "featured": false,
    "displayOrder": 15,
    "gallery": [
      {
        "url": "/academic/fyp/ai-dermatologist-poster.webp?v=3",
        "caption": "AI Dermatologist — Deep Learning Skin Disease Diagnosis Official Poster",
        "order": 1
      }
    ]
  },
  {
    "title": "Analysis and Detection of Fraudulent Transactions Using PaySim Simulator",
    "slug": "paysim-fraudulent-transactions-detection",
    "summary": "Supervised student project implementing machine learning algorithms to detect synthetic financial fraud signals generated by the PaySim simulator.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Financial Fraud Research",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "Fall 2020",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Ouyang NingJing"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Fraud Detection",
      "PaySim Simulator",
      "Machine Learning"
    ],
    "technologies": [
      "Python",
      "PaySim Simulator",
      "Scikit-Learn",
      "Pandas"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 16
  },
  {
    "title": "Detection and Defense of Vulnerability in OpenSSL",
    "slug": "detection-and-defense-vulnerability-openssl",
    "summary": "Static and dynamic security analysis project auditing OpenSSL memory safety vulnerabilities and buffer overflow defenses.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Vulnerability Research",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "Spring 2021",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Du GuangRui"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "OpenSSL",
      "Vulnerability Defense",
      "C/C++ Security"
    ],
    "technologies": [
      "C",
      "C++",
      "GDB",
      "Valgrind",
      "OpenSSL"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 17
  },
  {
    "title": "Malware Feature Extraction of Instruction Frequency",
    "slug": "malware-feature-extraction-instruction-frequency",
    "summary": "Malware analysis project extracting assembly opcode instruction frequency patterns to classify binary malware variants.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Malware Research",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "Fall 2020",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Wang Xiaowei"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Malware Detection",
      "Instruction Frequency",
      "Disassembly"
    ],
    "technologies": [
      "Python",
      "IDA Pro",
      "Capstone Engine",
      "Scikit-Learn"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 18
  },
  {
    "title": "Malware Feature Extraction via Machine Learning Algorithm",
    "slug": "malware-feature-extraction-machine-learning",
    "summary": "Supervised research evaluating feature selection techniques for automated malware detection across PE executable headers.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Malware Research",
    "category": "AI & Machine Learning",
    "programme": "BS Software Engineering",
    "session": "Fall 2020",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Eilsen Law Yi Sheng"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Malware Classification",
      "Feature Selection",
      "Machine Learning"
    ],
    "technologies": [
      "Python",
      "PEfile",
      "Scikit-Learn",
      "XGBoost"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 19
  },
  {
    "title": "Correlation Attack on Geffe Generator",
    "slug": "correlation-attack-geffe-generator",
    "summary": "Cryptographic analysis project evaluating fast correlation attack algorithms against linear feedback shift registers (LFSR).",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Cryptographic Security",
    "category": "Vulnerability & Security",
    "programme": "BS Software Engineering",
    "session": "Spring 2021",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Guo Hanshui"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Cryptanalysis",
      "Geffe Generator",
      "LFSR Stream Ciphers"
    ],
    "technologies": [
      "Python",
      "SageMath",
      "C++"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 20
  },
  {
    "title": "ElderlyCare — Android-Based Health Assistance Application",
    "slug": "elderlycare-android-health-assistance",
    "summary": "Mobile software engineering project building a user-centered Android application for medication reminders and emergency alerts.",
    "status": "Completed",
    "categoryType": "completed",
    "projectType": "Completed Project",
    "nature": "Mobile Development",
    "category": "Full-Stack & Systems",
    "programme": "BS Software Engineering",
    "session": "Spring 2021",
    "institution": "Xiamen University Malaysia",
    "students": [
      {
        "name": "Chen WenLong"
      }
    ],
    "supervisor": "Dr. Junaid Akram, PhD",
    "specializations": [
      "Android Development",
      "Mobile Health",
      "UI/UX Design"
    ],
    "technologies": [
      "Java",
      "Android SDK",
      "SQLite",
      "Firebase"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 21
  },
  {
    "title": "Building a Benchmark of Vulnerable Source Code",
    "slug": "building-benchmark-vulnerable-source-code",
    "summary": "Extract vulnerable code from patch files at function, file, and component levels, analyse repair patterns, and build a reusable benchmark for vulnerability research.",
    "status": "Available for Supervision",
    "categoryType": "future",
    "projectType": "Open Supervision Topic",
    "isOpportunity": true,
    "nature": "Source Security Research",
    "category": "Vulnerability & Security",
    "programme": "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations",
    "session": "Current Academic Session",
    "institution": "University of Nottingham Ningbo China",
    "students": [],
    "supervisor": "Dr. Junaid Akram, PhD",
    "source": "SSA Research Lab & UNNC Academic Mentorship",
    "lastVerified": "November 2026",
    "specializations": [
      "Vulnerability Benchmark",
      "Patch Extraction",
      "CVE Corpus",
      "Program Analysis"
    ],
    "prerequisites": "Software security, C/C++/Java, Git API, Python",
    "suitability": "Ideal for BSc / BEng Computer Science final-year students, MSc Computer Science students, or prospective PhD candidates seeking strong hands-on experience in program analysis, AST manipulation, and empirical software security research.",
    "problem": "Modern automated vulnerability analysis, code security assessment, and AI-based program repair models depend on high-quality, ground-truth vulnerability datasets. However, real-world CVE disclosures frequently conflate security fixes with incidental refactoring and feature additions. This project addresses the critical shortage of clean, multi-granularity vulnerability benchmarks by systematically extracting isolated vulnerable code fragments and verifying them against real-world commits.",
    "solution": "Design an automated parsing and filtering engine that processes CVE commits across top open-source C/C++, Java, and Python repositories. The system maps git diffs to Abstract Syntax Trees (ASTs) via Tree-sitter, categorizes CWE classifications, isolates minimal vulnerable-to-fixed function pairs, and packages a standardized, reproducible benchmark suite with evaluation scripts for the research community.",
    "architecture": [
      {
        "title": "Git Repository Mining & CVE Crawler",
        "detail": "Scrapes authorized CVE disclosures and tracks corresponding GitHub/GitLab commit diffs across open-source codebases."
      },
      {
        "title": "AST Diff Traversal & Function Boundary Isolation",
        "detail": "Employs Tree-sitter to parse modified files into syntactic trees, filtering out cosmetic and non-security changes."
      },
      {
        "title": "Multi-Granularity Labeling & CWE Taxonomy Mapping",
        "detail": "Tags extracted snippets at function, file, and component levels with normalized CWE metadata."
      },
      {
        "title": "Benchmark Packaging & Validation Suite",
        "detail": "Generates structured JSON datasets with evaluation scripts and automated baseline vulnerability checkers."
      }
    ],
    "objectives": [
      "Extract and normalize over 5,000 real-world vulnerability fixes across multi-language open-source projects.",
      "Isolate pure security patches from mixed refactoring commits using AST-level diff slicing.",
      "Publish an open-source, reproducible benchmark for evaluating static analysis tools and Code LLMs."
    ],
    "expectedDeliverables": [
      "Automated diff parser for CVE patch commits",
      "Function and file granularity vulnerable code dataset",
      "Benchmark evaluation report and GitHub repository"
    ],
    "technologies": [
      "Python",
      "Git API",
      "Tree-sitter",
      "C/C++",
      "Java",
      "Docker"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 22
  },
  {
    "title": "Intra-Project vs Inter-Project Software Dependency Analysis",
    "slug": "intra-inter-project-software-dependency-analysis",
    "summary": "Measure cloned-code and dependency ratios across related software systems and multiple versions of the same system, using Linux kernel releases as an empirical case study.",
    "status": "Available for Supervision",
    "categoryType": "future",
    "projectType": "Open Supervision Topic",
    "isOpportunity": true,
    "nature": "Software Evolution Analysis",
    "category": "Full-Stack & Systems",
    "programme": "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations",
    "session": "Current Academic Session",
    "institution": "University of Nottingham Ningbo China",
    "students": [],
    "supervisor": "Dr. Junaid Akram, PhD",
    "source": "SSA Research Lab & UNNC Academic Mentorship",
    "lastVerified": "November 2026",
    "specializations": [
      "Software Evolution",
      "Dependency Analysis",
      "Code Reuse",
      "Systems Architecture"
    ],
    "prerequisites": "Software evolution, dependency graphs, Python/C++, Clang",
    "suitability": "Suited for students interested in systems programming, operating system kernels, graph theory, and software supply chain evolution. Provides deep competence in AST analysis, compiler frontend tooling (Clang/LLVM), and large-scale repository mining.",
    "problem": "Complex operating systems, cloud microservices, and distributed frameworks constantly reuse components across versions and sister forks. Unmonitored code duplication and silent dependency propagation cause critical security vulnerabilities and architectural bloat to cascade unnoticed into downstream releases.",
    "solution": "Develop a graph-based code dependency and clone quantification pipeline. By analyzing call graphs, symbol resolution, and token-based similarity across sequential Linux kernel releases and related open-source subsystems, the tool computes precise intra-project and inter-project coupling metrics to visualize structural evolution and vulnerability propagation.",
    "architecture": [
      {
        "title": "Kernel Source Code Ingestion & Subsystem Parsing",
        "detail": "Clones and indexes major Linux kernel releases and subsystems using Clang and Tree-sitter frontends."
      },
      {
        "title": "Call-Graph & Symbol Dependency Extraction",
        "detail": "Analyzes function invocations, struct declarations, and include chains to generate weighted multi-directed graphs."
      },
      {
        "title": "Clone & Cross-Project Reuse Quantification",
        "detail": "Measures token-level and semantic similarity to identify code borrowed between independent subsystems."
      },
      {
        "title": "Evolutionary Metrics & Graph Visualization",
        "detail": "Computes churn, coupling metrics, and propagation paths, visualizing dependency evolution with interactive dashboards."
      }
    ],
    "objectives": [
      "Construct full dependency and call-graph models across major Linux kernel evolutionary milestones.",
      "Quantify the ratio of shared code clones and inter-module dependencies across subsystem boundaries.",
      "Pinpoint how historical CVE patches propagated or failed to propagate across dependent forks."
    ],
    "expectedDeliverables": [
      "Cross-repository dependency mapping tool",
      "Cloned code propagation metrics across versions",
      "Empirical study report on Linux kernel versions"
    ],
    "technologies": [
      "Python",
      "Clang",
      "Tree-sitter",
      "Graphviz",
      "NetworkX",
      "Linux Kernel Source"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 23
  },
  {
    "title": "Automatic Patching of Similar Code Fragments",
    "slug": "automatic-patching-similar-code-fragments",
    "summary": "Develop a tool that propagates an approved security patch to matching vulnerable fragments across repositories that reuse the affected source code.",
    "status": "Available for Supervision",
    "categoryType": "future",
    "projectType": "Open Supervision Topic",
    "isOpportunity": true,
    "nature": "Program Repair Research",
    "category": "Vulnerability & Security",
    "programme": "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations",
    "session": "Current Academic Session",
    "institution": "University of Nottingham Ningbo China",
    "students": [],
    "supervisor": "Dr. Junaid Akram, PhD",
    "source": "SSA Research Lab & UNNC Academic Mentorship",
    "lastVerified": "November 2026",
    "specializations": [
      "Program Repair",
      "Patch Propagation",
      "Clone Matching",
      "AST Transformations"
    ],
    "prerequisites": "AST diffing, Tree-sitter, Python, Code Clones, Program Repair",
    "suitability": "Strongly recommended for students passionate about automated program repair (APR), compiler transformations, and AI-assisted software maintenance. Builds upon Dr. Junaid Akram, PhD's published research in clone detection and automated security patch propagation.",
    "problem": "When a security vulnerability patch is issued for an open-source library, identical or near-identical code fragments (clones) residing in downstream projects or fork repositories remain unpatched for months or years. Manually locating and adapting the patch to varying local naming conventions and syntax structures is tedious and error-prone.",
    "solution": "Construct a semantic patch transfer engine that takes an authorized patch commit, extracts the syntax diff transformation rules using Tree-sitter AST abstractions, identifies cloned target sites across indexed repositories, and automatically adapts variable bindings and indentation to synthesize verified localized patches.",
    "architecture": [
      {
        "title": "CVE Patch Normalization & Edit-Script Synthesis",
        "detail": "Analyzes vulnerability fixes to generate normalized AST transformation rules independent of local variable names."
      },
      {
        "title": "Repository-Scale Clone Search",
        "detail": "Utilizes fast token indexing and embedding similarity to find Type-1 through Type-3 code clones in candidate codebases."
      },
      {
        "title": "Contextual Variable Alignment & Patch Adaptation",
        "detail": "Maps local identifier bindings and syntax constraints to instantiate candidate patches at target sites."
      },
      {
        "title": "Verification & Compilation Testing",
        "detail": "Verifies adapted patches against test suites to ensure functional correctness without regressions."
      }
    ],
    "objectives": [
      "Synthesize generalized patch transformation scripts from real-world CVE bug fixes.",
      "Locate vulnerable cloned fragments across multi-thousand repository corpora.",
      "Achieve high compile-rate and functional correctness for automatically transferred security patches."
    ],
    "expectedDeliverables": [
      "AST-level clone matcher and patch synthesizer",
      "Automated patch propagation engine",
      "Validation against open-source CVE patches"
    ],
    "technologies": [
      "Python",
      "Tree-sitter",
      "Git API",
      "AST Diffing",
      "PyTorch",
      "Docker"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 24
  },
  {
    "title": "Software Vulnerability Prediction Model",
    "slug": "software-vulnerability-prediction-model",
    "summary": "Learn repair patterns from vulnerability patches and predict the existence or likely number of vulnerable fragments in open-source software.",
    "status": "Available for Supervision",
    "categoryType": "future",
    "projectType": "Open Supervision Topic",
    "isOpportunity": true,
    "nature": "Machine Learning Security",
    "category": "AI & Machine Learning",
    "programme": "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations",
    "session": "Current Academic Session",
    "institution": "University of Nottingham Ningbo China",
    "students": [],
    "supervisor": "Dr. Junaid Akram, PhD",
    "source": "SSA Research Lab & UNNC Academic Mentorship",
    "lastVerified": "November 2026",
    "specializations": [
      "Machine Learning",
      "Vulnerability Prediction",
      "AST Features",
      "DevSecOps"
    ],
    "prerequisites": "Machine learning, software security, Python/Scikit-learn, PyTorch",
    "suitability": "Ideal for students wanting to combine machine learning, deep learning (PyTorch, Transformers), and software security. High-impact project for students aiming for publication or industry AI engineering roles.",
    "problem": "Static code analysis tools flood development teams with thousands of low-confidence warnings, causing alert fatigue. Conversely, runtime vulnerabilities go undetected until exploited. An effective early-warning predictive model is needed to proactively flag high-risk software components before deployment.",
    "solution": "Build a multimodal vulnerability prediction framework that combines code complexity metrics, developer commit history, and AST token embeddings. By training regularized gradient boosting and transformer models on historical CVE fix timelines, the system estimates the vulnerability probability of incoming code changes with actionable confidence intervals.",
    "architecture": [
      {
        "title": "Multi-Source Feature Extraction",
        "detail": "Extracts cyclomatic complexity, churn, developer ownership, and AST subtrees from source files and git commits."
      },
      {
        "title": "Code Embedding & Representation Learning",
        "detail": "Employs CodeBERT and Graph Neural Networks (GNN) to represent code syntax and control-flow semantics."
      },
      {
        "title": "Prediction Model Training & Ensemble",
        "detail": "Trains gradient boosted decision trees and neural classifiers with class-imbalance mitigation techniques."
      },
      {
        "title": "Confidence Calibration & Line-Level Explanation",
        "detail": "Explains predictions via SHAP / attention heatmaps highlighting specific suspect code regions."
      }
    ],
    "objectives": [
      "Build an integrated feature pipeline capturing both syntactic code properties and historical developer process metrics.",
      "Train and benchmark predictive models on Big-Vul and real-world CVE corpora.",
      "Reduce false positive alert rates by over 30% compared to traditional static analyzers."
    ],
    "expectedDeliverables": [
      "Feature extraction pipeline from source code ASTs",
      "Vulnerability prediction model",
      "Comparative accuracy evaluation against baseline static analyzers"
    ],
    "technologies": [
      "Python",
      "Scikit-Learn",
      "PyTorch",
      "CodeBERT",
      "Tree-sitter",
      "Hugging Face"
    ],
    "published": true,
    "featured": false,
    "displayOrder": 25
  },
  {
    "title": "Automatic Test Data Generation for Data Processing Systems",
    "slug": "automatic-test-data-generation-data-processing",
    "summary": "Generate valid and faulty test inputs for complex data processing systems using constraints and mutation operators, reducing the cost of manual input-space exploration.",
    "status": "Available for Supervision",
    "categoryType": "future",
    "projectType": "Open Supervision Topic",
    "isOpportunity": true,
    "nature": "Software Quality & Testing",
    "category": "Full-Stack & Systems",
    "programme": "BSc (Hons) Computer Science / Software Engineering / MSc Dissertations",
    "session": "Current Academic Session",
    "institution": "University of Nottingham Ningbo China",
    "students": [],
    "supervisor": "Dr. Junaid Akram, PhD",
    "source": "SSA Research Lab & UNNC Academic Mentorship",
    "lastVerified": "November 2026",
    "specializations": [
      "Automated Testing",
      "Constraint Solving",
      "Mutation Testing",
      "Formal Methods"
    ],
    "prerequisites": "Software testing, constraint solving, Python/Java, Z3 SMT",
    "suitability": "Suited for students interested in software testing, formal verification, constraint programming (SMT solvers), and safety-critical cyber-physical systems. Directly extends Dr. Junaid Akram, PhD's postdoctoral satellite CPS verification research conducted with SES Satellites and SnT Luxembourg.",
    "problem": "Data processing and cyber-physical systems (such as satellite resource controllers and financial engines) enforce intricate input domain rules. Manually creating thorough test suites is prohibitively expensive, while naive random fuzzing fails because inputs violate basic structural preconditions.",
    "solution": "Implement a model-based test data generator combining the Z3 SMT constraint solver with mutation operators. The engine converts input schema specifications into first-order logic formulas, solves for valid boundary test cases, and applies targeted mutations to generate fault-revealing edge-case vectors with maximal branch coverage.",
    "architecture": [
      {
        "title": "System Specification & UML Model Parser",
        "detail": "Parses data processing schemas, state machines, and interface constraints into formal constraint predicates."
      },
      {
        "title": "Z3 SMT Solver Constraint Engine",
        "detail": "Solves first-order logic formulas to synthesize valid boundary-value input vectors satisfying complex predicates."
      },
      {
        "title": "Targeted Mutation & Fuzzing Operator",
        "detail": "Applies domain-aware mutation operators to generate subtle boundary deviations and negative test vectors."
      },
      {
        "title": "Execution Coverage & Oracles Evaluator",
        "detail": "Executes generated test suites against target software, recording branch coverage and detecting anomalous runtime behaviors."
      }
    ],
    "objectives": [
      "Automate test-input generation for complex multi-parameter data processing workflows.",
      "Achieve over 90% branch coverage on complex industrial specifications with minimal human intervention.",
      "Demonstrate efficacy on realistic cyber-physical / satellite control test cases."
    ],
    "expectedDeliverables": [
      "Model-based test data generator",
      "Mutation and constraint-based test vector synthesizer",
      "Benchmark test suite report"
    ],
    "technologies": [
      "Python",
      "Java",
      "Z3 SMT Solver",
      "Mutation Engines",
      "JUnit",
      "Coverage.py"
    ],
    "coverImage": "/academic/fyp/test-data-generation-poster.webp?v=3",
    "coverAlt": "Automatic Test Data Generation for Complex Systems Poster",
    "gallery": [
      {
        "url": "/academic/fyp/test-data-generation-poster.webp?v=3",
        "caption": "Automatic Test Data Generation for Complex Systems Official Poster",
        "order": 1
      },
      {
        "url": "/academic/fyp/test-data-gen-mutation-synthesis.webp?v=3",
        "caption": "Automated Test Data Generator System Architecture & 6-Layer Engine",
        "order": 2
      },
      {
        "url": "/academic/fyp/test-data-gen-coverage-dashboard.webp?v=3",
        "caption": "Mutated Object Model Generation & OCL Oracle Validation Engine",
        "order": 3
      }
    ],
    "published": true,
    "featured": false,
    "displayOrder": 26
  }
];
