export const academicProfile = {
  name: "Junaid Akram, PhD",
  shortName: "Junaid Akram",
  role: "Assistant Professor",
  institution: "COMSATS University Islamabad, Lahore Campus",
  lab: "Source Code Security Assessment Lab",
  labShort: "SCSA Research Lab",
  office: "H Block — Room 26",
  officePhone: "111-001-007",
  emails: ["junaidakram@cuilahore.edu.pk", "junaid.tsinghua@yahoo.com"],
  labEmail: "scsa.laab@gmail.com",
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
      period: "During postdoctoral research",
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
    status: "Current project",
    summary:
      "A model-based approach and tool for generating and validating complex CPS test data using random, search-based, constraint-based, and mutation strategies.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg, and SES, Luxembourg.",
    image: "/academic/vulnerability-detection-workflow.jpg",
  },
  {
    title: "Test Smell Detection in the ARC System",
    status: "Completed",
    summary:
      "Tool-supported detection of poor testing practices in multi-level, BDD-based testing frameworks to improve test definition and maintainability.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg, and SES, Luxembourg.",
  },
  {
    title: "Log-Based Test Case Slicing",
    status: "Completed project",
    summary:
      "A tool-supported approach for decomposing complex system tests into smaller scenarios while preserving their assertions and reducing regression-test execution cost.",
    collaboration:
      "Software Verification and Validation Lab (SnT), University of Luxembourg.",
  },
  {
    title: "Obfuscated Code Detection in Android Applications",
    status: "Completed project",
    summary:
      "A clone-detection approach for identifying identifier-renaming and string-encryption obfuscation in Android source code, evaluated across obfuscated and non-obfuscated datasets.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
  },
  {
    title: "SQVDT — Source Code Vulnerability Detection",
    status: "Completed · 2018–2020",
    summary:
      "A file-level platform built from a fingerprint index of 2,931 vulnerable files and evaluated across 7 TB of C/C++ source code from 152,823 open-source projects.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    image: "/academic/vulnerability-detection-dashboard.png",
  },
  {
    title: "VCIPR — Vulnerability Detection at Function Level",
    status: "Completed · 2017–2018",
    summary:
      "A scalable, token-based and language-independent tool for detecting vulnerable and unpatched code fragments at function-level granularity.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
    image: "/academic/vulnerability-cve-dashboard.png",
  },
  {
    title: "Vulnerability Benchmark from Patch Files",
    status: "Completed · 2018–2020",
    summary:
      "A structured benchmark that traces patch files and extracts vulnerable source code at function, file, and component granularity for repeatable security assessment.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
  },
  {
    title: "DroidSD — Android Similarity Detection",
    status: "Completed · 2015–2017",
    summary:
      "A source-level clone-detection tool for identifying Type-1, Type-2, and Type-3 clones in a dataset of 30,500 Android applications.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
  },
  {
    title: "IBFET — Large-Scale Code Clone Detection",
    status: "Completed · 2015–2017",
    summary:
      "An index-based feature extraction technique evaluated over more than 324 billion lines of code in a Hadoop distributed environment.",
    collaboration:
      "Key Laboratory of Information System Security, School of Software, Tsinghua University.",
  },
];

export const publications = [
  {
    year: "2025",
    title:
      "An Advanced Ensemble Framework for Defending Against Obfuscated Windows, Android, and IoT Malware",
    authors: "Danish Vasan, Junaid Akram, Mohammad Hammoudeh, Adel F. Ahmed",
    venue: "Applied Soft Computing, Volume 173, 112908",
    href: "https://doi.org/10.1016/j.asoc.2025.112908",
  },
  {
    year: "2022",
    title: "Obfuscated Code is Identifiable by a Token Based Clone Detection Technique",
    authors: "Junaid Akram, Danish Vasan, Ping Luo",
    venue: "International Journal of Information and Computer Security, 19(3–4), 254–273",
    href: "https://doi.org/10.1504/IJICS.2022.127132",
  },
  {
    year: "2021",
    title:
      "DroidMD: An Efficient and Scalable Android Malware Detection Approach at Source Code Level",
    authors: "Junaid Akram, Majid Mumtaz, Gul Jabeen, Ping Luo",
    venue: "International Journal of Information and Computer Security",
    href: "https://doi.org/10.1504/IJICS.2021.117013",
  },
  {
    year: "2021",
    title: "SQVDT: Scalable Quantitative Vulnerability Detection Technique for Source Code Security Assessment",
    authors: "Junaid Akram, Ping Luo",
    venue: "Software: Practice and Experience, 51(2), 294–318",
    href: "https://doi.org/10.1002/spe.2905",
  },
  {
    year: "2020",
    title: "MTHAEL: Cross-Architecture IoT Malware Detection Based on Neural Network Advanced Ensemble Learning",
    authors: "Danish Vasan, Mamoun Alazab, Sitalakshmi, Junaid Akram, Zheng Qin",
    venue: "IEEE Transactions on Computers, 69(11)",
    href: "https://doi.org/10.1109/TC.2020.3015584",
  },
  {
    year: "2020",
    title: "DroidSD: An Efficient Indexed Based Android Applications Similarity Detection Tool",
    authors: "Junaid Akram, Zhendong Shi, Majid Mumtaz, Ping Luo",
    venue: "Journal of Information Science and Engineering, 36, 13–29",
  },
  {
    year: "2019",
    title: "How to Build a Vulnerability Benchmark to Overcome Cyber Security Attacks",
    authors: "Junaid Akram, Ping Luo",
    venue: "IET Information Security, 14(1), 60–71",
    href: "https://doi.org/10.1049/iet-ifs.2018.5647",
  },
  {
    year: "2019",
    title: "VCIPR: Vulnerable Code is Identifiable When a Patch is Released",
    authors: "Junaid Akram, Liang Qi, Ping Luo",
    venue: "IEEE Conference on Software Testing, Validation and Verification (ICST)",
    href: "https://doi.org/10.1109/ICST.2019.00049",
  },
  {
    year: "2018",
    title: "DroidCC: A Scalable Clone Detection Approach for Android Applications",
    authors: "Junaid Akram, Zhendong Shi, Majid Mumtaz, Ping Luo",
    venue: "IEEE COMPSAC",
  },
  {
    year: "2015",
    title: "Data Structure and Algorithm: A Visualized Web Based Courseware Improves Cognitive Learning",
    authors: "Junaid Akram, Fang Luping",
    venue: "International Journal of Digital Information and Wireless Communications, 5(3), 194–202",
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
    type: "Research & Development",
    availability: "Listed as available",
    prerequisites: "Interest in software security and strong programming skills",
    summary:
      "Extract vulnerable code from patch files at function, file, and component levels, analyse repair patterns, and build a reusable benchmark for vulnerability research.",
  },
  {
    title: "Intra-Project vs Inter-Project Software Dependency Analysis",
    type: "Research & Development",
    availability: "Listed as available",
    prerequisites: "Interest in software analysis and strong programming skills",
    summary:
      "Measure cloned-code and dependency ratios across related software systems and multiple versions of the same system, using Linux versions as a possible case study.",
  },
  {
    title: "Automatic Patching of Similar Code Fragments",
    type: "Research & Development",
    availability: "Listed as available",
    prerequisites: "Interest in software security and strong programming skills",
    summary:
      "Develop a tool that propagates an approved patch to matching vulnerable fragments across repositories that reuse the affected source code.",
  },
  {
    title: "Software Vulnerability Prediction Model",
    type: "Research & Development",
    availability: "Listed as available",
    prerequisites: "Software security, machine learning, and strong programming skills",
    summary:
      "Learn repair patterns from vulnerability patches and predict the existence or likely number of vulnerable fragments in open-source software.",
  },
  {
    title: "Automatic Test Data Generation for Data Processing Systems",
    type: "Research & Development",
    availability: "Listed as available",
    prerequisites: "Interest in software testing and strong programming skills",
    summary:
      "Generate valid and faulty test inputs for complex systems using constraints and mutation operators, reducing the cost of manual input-space exploration.",
  },
];

export const collaborators = [
  {
    name: "Danish Vassan, PhD",
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
