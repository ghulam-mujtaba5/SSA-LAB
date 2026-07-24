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
  "IPBG Annual Workshop at SnT, Luxembourg — paper presentation, 2022",
  "SnT Partnership Day at the University of Luxembourg, 2021",
  "ICST Conference, Xi’an, China, 2019",
  "COMPSAC, Tokyo, Japan, 2018",
];

const eventGalleryDimensions = [
  [1280, 951],
  [1153, 1788],
  [1280, 846],
  [1280, 1771],
  [960, 684],
  [1271, 1905],
  [1280, 704],
  [1163, 1152],
  [1245, 474],
  [1280, 488],
  [882, 212],
  [1280, 488],
];

export const eventGallery = [
  {
    src: "/academic/events/event-01.jpg",
    alt: "Dr. Junaid Akram presenting at the IPBG Annual Workshop at SnT",
    caption: "IPBG Annual Workshop presentation — SnT, Luxembourg, 2022",
    width: eventGalleryDimensions[0][0],
    height: eventGalleryDimensions[0][1],
  },
  {
    src: "/academic/events/event-02.jpg",
    alt: "Dr. Junaid Akram with his automated test data generation research poster",
    caption: "Automated test-data generation poster — IPBG Annual Workshop",
    width: eventGalleryDimensions[1][0],
    height: eventGalleryDimensions[1][1],
  },
  ...Array.from({ length: 10 }, (_, index) => ({
    src: `/academic/events/event-${String(index + 3).padStart(2, "0")}.jpg`,
    alt: `Research event photograph ${index + 3} from the original SCSA Lab site`,
    caption:
      index < 2
        ? "SnT Partnership Day — University of Luxembourg, 2021"
        : index < 6
          ? "Research collaboration and conference activity"
          : "COMPSAC and international research events",
    width: eventGalleryDimensions[index + 2][0],
    height: eventGalleryDimensions[index + 2][1],
  })),
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
  },
  {
    name: "Tsinghua University",
    image: "/academic/tsinghua-university-logo.png",
    href: "https://www.tsinghua.edu.cn/en/",
  },
  {
    name: "SnT, University of Luxembourg",
    image: "/academic/snt-university-luxembourg-logo.png",
    href: "https://www.uni.lu/snt-en/",
  },
  {
    name: "SES",
    image: "/academic/ses-logo.png",
    href: "https://www.ses.com/",
  },
  {
    name: "King Fahd University of Petroleum & Minerals",
    image: "/academic/king-fahd-university-logo.png",
    href: "https://www.kfupm.edu.sa/",
  },
];
