# Dr. Junaid Akram — Academic & SCSA Research Platform

A high-performance, responsive academic web platform for **Dr. Junaid Akram** (Assistant Professor, HEC-approved PhD supervisor) and the **Source Code Security Assessment (SCSA) Research Laboratory** at COMSATS University Islamabad, Lahore Campus.

---

## 🔬 Core Academic & Research Specializations

- **Source Code Security Assessment (SCSA)**: Static analysis methods for identifying, understanding, and mitigating software vulnerabilities.
- **Vulnerability Detection Platforms**: Scalable vulnerability detection engines (**SQVDT**, **VCIPR**) indexing 152,000+ open-source repositories and CVE patch datasets.
- **Code Clone & Obfuscation Analysis**: Multi-language detection of Type-1 through Type-4 code clones and obfuscated Android malware.
- **Software Testing & Automated Test Generation**: Model-based testing, constraint-based test data generation (**ARC System**), and test-smell detection.
- **Supervised FYP Directory**: Interactive directory showcasing supervised final-year student development projects and research case studies.

---

## 🚀 Main Platform Sections

1. **Home (`/`)**: Executive academic summary, research metrics, interactive SCSA pipeline visualizer, and recent highlights.
2. **About (`/about`)**: Background (PhD Tsinghua University, Postdoc SnT Luxembourg), experience, and lab overview.
3. **Research (`/research`)**: Research domains, funded projects, vulnerability detection platforms, and interactive workflow.
4. **Publications (`/publications`)**: Categorized peer-reviewed journal papers (Applied Soft Computing, IEEE, IJICS) and conference proceedings.
5. **FYP Supervision (`/alumni`)**: Supervised final-year student projects, filterable category directory, and dedicated case study detail pages (`/alumni/case-study/[slug]`).
6. **Team (`/team`)**: Supervised BS, MS, PhD students, student placements, and international research collaborators.
7. **Resources (`/resources`)**: Curated machine learning, network architecture, and security reference materials.
8. **Contact (`/contact`)**: Institutional office hours, lab location, email directory, and prospective student inquiry form.
9. **Admin Portal (`/admin`)**: Enterprise management dashboard for publishing research articles, media, and FYP project records.

---

## 🛠️ Tech Stack & Design System

- **Framework**: Next.js 16 (Pages Router), React 19, TypeScript
- **Styling**: Vanilla CSS Modules with custom Design Token system (`styles/tokens.css`) supporting dynamic Light & Dark themes
- **Animations**: Framer Motion, Lottie React, CSS keyframes
- **Database**: MongoDB with Mongoose ODM (with fallback to static datasets for zero-downtime static rendering)
- **Deployment**: Optimized for Vercel, Netlify, or Node.js serverless runtimes

---

## 💻 Local Development Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build validation
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SITE_URL=https://junaidakram.com
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/academic
NEXTAUTH_SECRET=your-secure-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```
