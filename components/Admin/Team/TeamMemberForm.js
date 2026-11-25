import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '../../../lib/validation/schemas';
import { Save, ArrowLeft, User, Mail, Linkedin, Globe, Github, Award, BookOpen, Building } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '../ImageUploader/ImageUploader';
import styles from './TeamMemberForm.module.css';

const CATEGORY_ALIASES = {
  'junior_collaborator': 'junior-collaborator',
  'junior-collaborator': 'junior-collaborator',
  'junior_researcher': 'junior-collaborator',
  'junior-researcher': 'junior-collaborator',
  'pg_researcher': 'pg-researcher',
  'pg-researcher': 'pg-researcher',
  'co_investigator': 'co-investigator',
  'co-investigator': 'co-investigator',
  'supervised-project': 'supervised-project',
  'supervisor': 'supervised-project',
  'alumnus': 'alumni',
  'alumni': 'alumni',
  'collaborator': 'collaborator',
  'faculty': 'faculty',
  'core-team': 'core-team',
  'other': 'other',
};

function normalizeCategory(cat) {
  if (!cat) return 'pg-researcher';
  const key = String(cat).trim().toLowerCase();
  return CATEGORY_ALIASES[key] || key;
}

export default function TeamMemberForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const buildFormValues = (data = {}) => ({
    name: data.name || '',
    slug: data.slug || '',
    category: normalizeCategory(data.category),
    role: data.role || '',
    memberId: data.memberId || '',
    degree: data.degree || '',
    affiliation: data.affiliation || '',
    institution: data.institution || '',
    specialization: data.specialization || '',
    topic: data.topic || '',
    focus: data.focus || '',
    status: data.status || 'Active',
    bio: data.bio || '',
    badge: data.badge || '',
    image: data.image || '',
    email: data.email || data.socialLinks?.email || '',
    phone: data.phone || '',
    googleScholar: data.googleScholar || data.socialLinks?.scholar || '',
    orcid: data.orcid || '',
    researchGate: data.researchGate || '',
    officialProfile: data.officialProfile || '',
    linkedin: data.linkedin || data.socialLinks?.linkedin || '',
    github: data.github || data.socialLinks?.github || '',
    term: data.term || data.period || '',
    organization: data.organization || data.placement || '',
    projectTitle: data.projectTitle || '',
    details: data.details || '',
    published: data.published !== false,
    featured: Boolean(data.featured),
    displayOrder: Number(data.displayOrder) || 0,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: buildFormValues(initialData),
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(buildFormValues(initialData));
    }
  }, [initialData, reset]);

  const selectedCategory = watch('category');
  const isAlumni = selectedCategory === 'alumni' || selectedCategory === 'alumnus';

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      displayOrder: Number(data.displayOrder) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* Top Controls */}
      <div className={styles.topBar}>
        <Link href="/admin/team" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Team & Alumni
        </Link>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
        </button>
      </div>

      {/* Section 1: Member Identity & Classification */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Personnel</p>
          <h2>Identity & Role</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Muhammad Ahmad"
              {...register('name')}
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Personnel Category *</label>
            <select id="category" {...register('category')}>
              <option value="junior-collaborator">Lecturer, Junior Research Collaborator</option>
              <option value="pg-researcher">Postgraduate Researcher (MS/PhD)</option>
              <option value="co-investigator">Faculty / Co-Investigator</option>
              <option value="supervised-project">Supervised Thesis / Project</option>
              <option value="alumni">Alumni Placement</option>
              <option value="collaborator">International Collaborator</option>
              <option value="faculty">Core Faculty</option>
              <option value="core-team">Core Lab Team</option>
              <option value="other">Other Contributor</option>
            </select>
            {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="role">Role / Academic Title</label>
            <input
              id="role"
              type="text"
              list="role-suggestions"
              placeholder="e.g. Lecturer, Junior Research Collaborator"
              {...register('role')}
            />
            <datalist id="role-suggestions">
              <option value="Lecturer, Junior Research Collaborator" />
              <option value="Lecturer (PhD Scholar)" />
              <option value="Lecturer" />
              <option value="Lab Director & Principal Investigator" />
              <option value="Senior Co-Investigator & International Collaborator" />
              <option value="Co-Investigator & Academic Partner" />
              <option value="Academic Mentor & Research Collaborator" />
              <option value="Postgraduate Researcher" />
              <option value="Supervised Student" />
              <option value="Alumnus" />
            </datalist>
          </div>

          <div className={styles.field}>
            <label htmlFor="status">Current Status</label>
            <select id="status" {...register('status')}>
              <option value="Active">Active</option>
              <option value="Graduated">Graduated</option>
              <option value="Alumni">Alumni</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="degree">Degree & Batch</label>
            <input
              id="degree"
              type="text"
              placeholder="e.g. MS Software Engineering (FA23)"
              {...register('degree')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="memberId">Member ID / Registration Number</label>
            <input
              id="memberId"
              type="text"
              placeholder="e.g. FA23-RSE-001"
              {...register('memberId')}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="affiliation">Affiliation / Institution</label>
            <input
              id="affiliation"
              type="text"
              placeholder="e.g. COMSATS University Islamabad, Lahore Campus"
              {...register('affiliation')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">Profile Slug (optional)</label>
            <input
              id="slug"
              type="text"
              placeholder="auto-generated from name if blank"
              {...register('slug')}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Research Focus & Academic Summary */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Academics</p>
          <h2>Research Focus & Bio</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="topic">Primary Research Topic / Thesis Title</label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Automated Vulnerability Detection and Repair using Deep Learning"
            {...register('topic')}
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="specialization">Specialization / Focus Area</label>
            <input
              id="specialization"
              type="text"
              placeholder="e.g. LLM Security, Static Analysis"
              {...register('specialization')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="badge">Special Badge / Recognition</label>
            <input
              id="badge"
              type="text"
              placeholder="e.g. HEC Scholar / Gold Medalist"
              {...register('badge')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="bio">Biography / Profile Summary</label>
          <textarea
            id="bio"
            rows={4}
            placeholder="Short academic bio, background, and research interests..."
            {...register('bio')}
          />
        </div>
      </section>

      {/* Section 3: Alumni Placement Details (shown if alumni or filled) */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Career & Alumni</p>
          <h2>Placement & Industry Career</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="organization">Placement Company / University</label>
            <input
              id="organization"
              type="text"
              placeholder="e.g. Senior Security Engineer at Redacted Security / PhD Scholar at Tsinghua"
              {...register('organization')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="term">Tenure / Graduation Year / Period</label>
            <input
              id="term"
              type="text"
              placeholder="e.g. Graduated 2025 or 2023 — 2025"
              {...register('term')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="projectTitle">Supervised Thesis / Major Project Title</label>
          <input
            id="projectTitle"
            type="text"
            placeholder="e.g. Empirical Study on Smart Contract Vulnerabilities"
            {...register('projectTitle')}
          />
        </div>
      </section>

      {/* Section 4: Photo & Media Upload */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Media</p>
          <h2>Profile Photo & Avatar</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="image">Profile Photo URL</label>
          <input
            id="image"
            type="text"
            placeholder="/academic/team/sample.webp or uploaded asset URL"
            {...register('image')}
          />
        </div>

        <ImageUploader
          initialImageUrl={watch('image') || ''}
          onUpload={(url) => setValue('image', url, { shouldValidate: true })}
          contextTitle={watch('name') || 'team-member'}
          imageType="team-avatar"
        />
      </section>

      {/* Section 5: Social Profiles & Academic Contact */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Contact</p>
          <h2>Social Profiles & Online Presence</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="researcher@nottingham.edu.cn"
              {...register('email')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              {...register('linkedin')}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="googleScholar">Google Scholar URL</label>
            <input
              id="googleScholar"
              type="url"
              placeholder="https://scholar.google.com/citations?user=..."
              {...register('googleScholar')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="github">GitHub Profile URL</label>
            <input
              id="github"
              type="url"
              placeholder="https://github.com/..."
              {...register('github')}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="researchGate">ResearchGate URL</label>
            <input
              id="researchGate"
              type="url"
              placeholder="https://researchgate.net/profile/..."
              {...register('researchGate')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="orcid">ORCID URL</label>
            <input
              id="orcid"
              type="url"
              placeholder="https://orcid.org/0000-..."
              {...register('orcid')}
            />
          </div>
        </div>
      </section>

      {/* Section 6: Publishing & Order */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Visibility</p>
          <h2>Display & Publishing</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="displayOrder">Display Order (Sorting Priority)</label>
            <input
              id="displayOrder"
              type="number"
              placeholder="0"
              {...register('displayOrder')}
            />
          </div>

          <div className={styles.toggles}>
            <label>
              <Controller
                name="featured"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              ⭐ Featured Researcher
            </label>

            <label>
              <Controller
                name="published"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input
                    type="checkbox"
                    checked={value !== false}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              Published (Visible on Public Website)
            </label>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Team Member'}
        </button>
      </div>
    </form>
  );
}
