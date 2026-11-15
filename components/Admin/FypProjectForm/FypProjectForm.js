import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import GalleryManager from "../GalleryManager/GalleryManager";
import ImageUploader from "../ImageUploader/ImageUploader";
import InlineSpinner from "../../LoadingAnimation/InlineSpinner";
import styles from "./FypProjectForm.module.css";

const emptyProject = {
  title: "",
  summary: "",
  status: "Running",
  categoryType: "running",
  projectType: "Final Year Project",
  nature: "Research & Development",
  programme: "",
  session: "",
  institution: "COMSATS University Islamabad, Lahore Campus",
  students: [],
  supervisor: "Dr. Junaid Akram, PhD",
  coSupervisor: "",
  specializations: [],
  sdgs: [],
  problem: "",
  solution: "",
  objectives: [],
  architecture: [],
  features: [],
  technologies: [],
  contributions: [],
  outcome: "",
  limitations: [],
  futureWork: [],
  isRunning: true,
  isOpportunity: false,
  coverImage: "",
  coverAlt: "",
  gallery: [],
  liveUrl: "",
  repositoryUrl: "",
  published: true,
  featured: false,
  displayOrder: 0,
};

const toLines = (value) => (Array.isArray(value) ? value.join("\n") : "");
const fromLines = (value) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const studentsToLines = (students) =>
  (students || [])
    .map((student) => `${student.name || ""} | ${student.registration || ""}`.trim())
    .join("\n");

const studentsFromLines = (value) =>
  fromLines(value).map((line) => {
    const [name, registration = ""] = line.split("|");
    return { name: name.trim(), registration: registration.trim() };
  });

const architectureToLines = (stages) =>
  (stages || [])
    .map((stage) => `${stage.title || ""} | ${stage.detail || ""}`.trim())
    .join("\n");

const architectureFromLines = (value) =>
  fromLines(value).map((line) => {
    const [title, ...detail] = line.split("|");
    return { title: title.trim(), detail: detail.join("|").trim() };
  });

function Field({ label, hint, children }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function FypProjectForm({
  project,
  onSubmit,
  submitting = false,
}) {
  const [form, setForm] = useState({ ...emptyProject, ...project });

  useEffect(() => {
    setForm({ ...emptyProject, ...project });
  }, [project]);

  const textAreas = useMemo(
    () => ({
      students: studentsToLines(form.students),
      specializations: toLines(form.specializations),
      sdgs: toLines(form.sdgs),
      objectives: toLines(form.objectives),
      architecture: architectureToLines(form.architecture),
      features: toLines(form.features),
      technologies: toLines(form.technologies),
      contributions: toLines(form.contributions),
      limitations: toLines(form.limitations),
      futureWork: toLines(form.futureWork),
    }),
    [form],
  );

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateLines = (field, value) => {
    if (field === "students") return update(field, studentsFromLines(value));
    if (field === "architecture") return update(field, architectureFromLines(value));
    return update(field, fromLines(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Identity</p>
          <h2>Project essentials</h2>
        </div>
        <div className={styles.twoColumns}>
          <Field label="Project title *">
            <input
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </Field>
          <Field label="Category / Directory Tab">
            <select
              value={form.categoryType || (form.isOpportunity ? "future" : form.status === "Completed" ? "completed" : "running")}
              onChange={(event) => {
                const cat = event.target.value;
                update("categoryType", cat);
                if (cat === "future") {
                  update("isOpportunity", true);
                  update("status", "Available for Supervision");
                } else if (cat === "completed") {
                  update("isOpportunity", false);
                  update("status", "Completed");
                } else {
                  update("isOpportunity", false);
                  update("status", "Running");
                }
              }}
            >
              <option value="running">Running Projects</option>
              <option value="completed">Completed Projects</option>
              <option value="future">Future Projects & Opportunities</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Available for Supervision">Available for Supervision</option>
              <option value="In Progress">In Progress</option>
              <option value="Archived">Archived</option>
            </select>
          </Field>
          <Field label="Project type">
            <input
              value={form.projectType}
              onChange={(event) => update("projectType", event.target.value)}
            />
          </Field>
          <Field label="Nature">
            <input
              value={form.nature}
              onChange={(event) => update("nature", event.target.value)}
            />
          </Field>
          <Field label="Programme">
            <input
              value={form.programme}
              onChange={(event) => update("programme", event.target.value)}
            />
          </Field>
          <Field label="Academic session">
            <input
              value={form.session}
              onChange={(event) => update("session", event.target.value)}
            />
          </Field>
        </div>
        <Field label="Summary *" hint="Two or three concise sentences for the public project introduction.">
          <textarea
            required
            rows={4}
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
          />
        </Field>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Supervision</p>
          <h2>Students and academic record</h2>
        </div>
        <div className={styles.twoColumns}>
          <Field label="Institution">
            <input
              value={form.institution}
              onChange={(event) => update("institution", event.target.value)}
            />
          </Field>
          <Field label="Supervisor">
            <input
              value={form.supervisor}
              onChange={(event) => update("supervisor", event.target.value)}
            />
          </Field>
          <Field label="Co-supervisor">
            <input
              value={form.coSupervisor}
              onChange={(event) => update("coSupervisor", event.target.value)}
            />
          </Field>
          <Field
            label="Students"
            hint="One student per line: Name | Registration number"
          >
            <textarea
              rows={4}
              value={textAreas.students}
              onChange={(event) => updateLines("students", event.target.value)}
            />
          </Field>
          <Field label="Specializations" hint="One specialization per line.">
            <textarea
              rows={4}
              value={textAreas.specializations}
              onChange={(event) => updateLines("specializations", event.target.value)}
            />
          </Field>
          <Field label="UN Sustainable Development Goals" hint="One goal per line.">
            <textarea
              rows={4}
              value={textAreas.sdgs}
              onChange={(event) => updateLines("sdgs", event.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Research case study</p>
          <h2>Problem, method, and evidence</h2>
        </div>
        <Field label="Problem">
          <textarea
            rows={5}
            value={form.problem}
            onChange={(event) => update("problem", event.target.value)}
          />
        </Field>
        <Field label="Solution">
          <textarea
            rows={5}
            value={form.solution}
            onChange={(event) => update("solution", event.target.value)}
          />
        </Field>
        <div className={styles.twoColumns}>
          <Field label="Objectives" hint="One objective per line.">
            <textarea
              rows={7}
              value={textAreas.objectives}
              onChange={(event) => updateLines("objectives", event.target.value)}
            />
          </Field>
          <Field
            label="Architecture"
            hint="One stage per line: Stage title | Description"
          >
            <textarea
              rows={7}
              value={textAreas.architecture}
              onChange={(event) => updateLines("architecture", event.target.value)}
            />
          </Field>
          <Field label="Features" hint="One feature per line.">
            <textarea
              rows={7}
              value={textAreas.features}
              onChange={(event) => updateLines("features", event.target.value)}
            />
          </Field>
          <Field label="Technologies" hint="One technology per line.">
            <textarea
              rows={7}
              value={textAreas.technologies}
              onChange={(event) => updateLines("technologies", event.target.value)}
            />
          </Field>
          <Field label="Student contributions" hint="One responsibility statement per line.">
            <textarea
              rows={7}
              value={textAreas.contributions}
              onChange={(event) => updateLines("contributions", event.target.value)}
            />
          </Field>
          <Field label="Outcome">
            <textarea
              rows={7}
              value={form.outcome}
              onChange={(event) => update("outcome", event.target.value)}
            />
          </Field>
          <Field label="Limitations" hint="One limitation per line.">
            <textarea
              rows={7}
              value={textAreas.limitations}
              onChange={(event) => updateLines("limitations", event.target.value)}
            />
          </Field>
          <Field label="Future work" hint="One recommendation per line.">
            <textarea
              rows={7}
              value={textAreas.futureWork}
              onChange={(event) => updateLines("futureWork", event.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Media</p>
          <h2>Poster and product evidence</h2>
        </div>
        <ImageUploader
          initialImageUrl={form.coverImage}
          onUpload={(url) => update("coverImage", url)}
          onAltTextChange={(value) => update("coverAlt", value)}
          contextTitle={form.title}
          imageType="fyp-cover"
        />
        <GalleryManager
          gallery={form.gallery || []}
          onChange={(gallery) => update("gallery", gallery)}
          contextTitle={form.title}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Publishing</p>
          <h2>Links and visibility</h2>
        </div>
        <div className={styles.twoColumns}>
          <Field label="Live project URL">
            <input
              type="url"
              value={form.liveUrl}
              onChange={(event) => update("liveUrl", event.target.value)}
            />
          </Field>
          <Field label="Repository URL">
            <input
              type="url"
              value={form.repositoryUrl}
              onChange={(event) => update("repositoryUrl", event.target.value)}
            />
          </Field>
          <Field label="Display order">
            <input
              type="number"
              value={form.displayOrder}
              onChange={(event) => update("displayOrder", Number(event.target.value))}
            />
          </Field>
          <div className={styles.toggles}>
            <label>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => update("published", event.target.checked)}
              />
              Published
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => update("featured", event.target.checked)}
              />
              Featured case study
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.isOpportunity}
                onChange={(event) => {
                  const val = event.target.checked;
                  update("isOpportunity", val);
                  if (val) update("categoryType", "future");
                }}
              />
              Supervision Opportunity (Future Topic)
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.isRunning}
                onChange={(event) => {
                  const val = event.target.checked;
                  update("isRunning", val);
                  if (val) update("categoryType", "running");
                }}
              />
              Currently Running Project
            </label>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? <InlineSpinner sizePx={16} /> : <Save size={18} />}
          {submitting ? "Saving…" : "Save FYP project"}
        </button>
      </div>
    </form>
  );
}

