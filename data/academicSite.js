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
    title: "Cyber Security",
    description:
      "Source-level assessment methods for identifying, understanding, and mitigating software vulnerabilities.",
  },
  {
    title: "Vulnerability Detection",
    description:
      "Scalable techniques and tools that trace vulnerable code through patches, fingerprints, and code similarity.",
  },
  {
    title: "Software Testing",
    description:
      "Search-based testing, automated test-data generation, regression testing, and test-smell detection.",
  },
  {
    title: "Malware Detection",
    description:
      "Static and learning-based analysis of Android and cross-architecture malware at source-code level.",
  },
  {
    title: "Code Clone Analysis",
    description:
      "Large-scale detection of exact, near-miss, and obfuscated code clones across software systems.",
  },
  {
    title: "Software Evolution & Reuse",
    description:
      "Understanding how code, vulnerabilities, and reusable components propagate between systems.",
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
    image: "/academic/vulnerability-detection-dashboard.png",
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
    image: "/academic/vulnerability-cve-dashboard.png",
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
    type: "COMSATS Listed FYP Opportunity",
    availability: "Available for supervision",
    prerequisites: "Software security, C/C++/Java, Git API",
    source: "Official COMSATS FYP Listing",
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
    type: "COMSATS Listed FYP Opportunity",
    availability: "Available for supervision",
    prerequisites: "Software evolution, dependency graphs, Python/C++",
    source: "Official COMSATS FYP Listing",
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
    type: "COMSATS Listed FYP Opportunity",
    availability: "Available for supervision",
    prerequisites: "AST diffing, Tree-sitter, Python, Code Clones",
    source: "Official COMSATS FYP Listing",
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
    type: "COMSATS Listed FYP Opportunity",
    availability: "Available for supervision",
    prerequisites: "Machine learning, software security, Python/Scikit-learn",
    source: "Official COMSATS FYP Listing",
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
    type: "COMSATS Listed FYP Opportunity",
    availability: "Available for supervision",
    prerequisites: "Software testing, constraint solving, Python/Java",
    source: "Official COMSATS FYP Listing",
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

export const learningResources = [
  {
    title: "Machine Learning Architecture and Concepts",
    description:
      "A reference map of supervised, deep, and unsupervised learning methods and representative applications.",
    image: "/academic/resources/machine-learning-architecture.png",
    width: 1280,
    height: 1383,
  },
  {
    title: "Generative AI Infrastructure",
    description:
      "An ecosystem view spanning compute, data, training frameworks, inference, deployment, and analytics.",
    image: "/academic/resources/generative-ai-infrastructure.png",
    width: 1280,
    height: 1013,
  },
  {
    title: "OSI Model Architecture",
    description:
      "A visual explanation of the seven OSI layers and the protocols and responsibilities associated with each layer.",
    image: "/academic/resources/osi-model-architecture.png",
    width: 710,
    height: 717,
  },
  {
    title: "AI, ML, GenAI, LLMs, RAG, and Agentic AI",
    description:
      "A compact hierarchy and comparison of modern artificial-intelligence concepts.",
    image: "/academic/resources/ai-ml-genai-concepts.png",
    width: 467,
    height: 720,
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
    stats: { msStudents: "7 Active", fypTeams: "4 Teams", grants: "HEC Approved" }
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

