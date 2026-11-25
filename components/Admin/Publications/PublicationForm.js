import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { publicationSchema } from '../../../lib/validation/schemas';
import { Save, ArrowLeft, Sparkles, BookOpen, ExternalLink, FileText, Code, Tag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './PublicationForm.module.css';

const PUB_TYPES = {
  journal: 'Journal',
  conference: 'Conference',
  'book chapter': 'Book Chapter',
  book: 'Book Chapter',
  preprint: 'Preprint',
  workshop: 'Workshop',
  patent: 'Patent',
  other: 'Other',
};

function normalizePubType(type) {
  if (!type) return 'Journal';
  const key = String(type).trim().toLowerCase();
  return PUB_TYPES[key] || type;
}

// Simple client-side BibTeX parser helper
function parseBibtexString(bibtex) {
  if (!bibtex || typeof bibtex !== 'string') return {};
  const result = {};

  // Extract type
  const typeMatch = bibtex.match(/@(\w+)\s*\{/i);
  if (typeMatch) {
    const rawType = typeMatch[1].toLowerCase();
    if (rawType.includes('article') || rawType.includes('journal')) result.type = 'Journal';
    else if (rawType.includes('inproceedings') || rawType.includes('conference') || rawType.includes('proceeding')) result.type = 'Conference';
    else if (rawType.includes('book') || rawType.includes('incollection')) result.type = 'Book Chapter';
    else if (rawType.includes('misc') || rawType.includes('techreport')) result.type = 'Preprint';
    else if (rawType.includes('patent')) result.type = 'Patent';
  }

  // Extract fields: field = {value} or field = "value"
  const fieldRegex = /(\w+)\s*=\s*[\{"]([^"\}]+)[\}"]/gi;
  let match;
  while ((match = fieldRegex.exec(bibtex)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2].trim();
    if (key === 'title') result.title = val.replace(/[{}]/g, '');
    if (key === 'author' || key === 'authors') result.authors = val.replace(/\s+and\s+/gi, ', ');
    if (key === 'year') result.year = val;
    if (key === 'journal' || key === 'booktitle') result.venue = val;
    if (key === 'doi') {
      result.href = val.startsWith('http') ? val : `https://doi.org/${val}`;
    }
    if (key === 'url' && !result.href) result.href = val;
    if (key === 'abstract') result.abstract = val;
  }

  return result;
}

export default function PublicationForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const [tagInput, setTagInput] = useState('');

  const buildDefaults = (data = {}) => ({
    title: data.title || '',
    slug: data.slug || '',
    year: data.year ? String(data.year) : new Date().getFullYear().toString(),
    type: normalizePubType(data.type),
    authors: data.authors || '',
    venue: data.venue || '',
    href: data.href || '',
    bibtex: data.bibtex || '',
    abstract: data.abstract || '',
    pdfUrl: data.pdfUrl || '',
    codeUrl: data.codeUrl || '',
    featured: Boolean(data.featured),
    published: data.published !== false,
    displayOrder: Number(data.displayOrder) || 0,
    tags: Array.isArray(data.tags) ? data.tags : [],
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
    resolver: zodResolver(publicationSchema),
    defaultValues: buildDefaults(initialData),
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(buildDefaults(initialData));
    }
  }, [initialData, reset]);

  const currentTags = watch('tags') || [];

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !currentTags.includes(trimmed)) {
      setValue('tags', [...currentTags, trimmed], { shouldValidate: true });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setValue(
      'tags',
      currentTags.filter((t) => t !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const handleAutoFillBibtex = () => {
    const currentBibtex = watch('bibtex');
    if (!currentBibtex) {
      alert('Please enter or paste a BibTeX entry into the BibTeX Citation field first.');
      return;
    }

    const parsed = parseBibtexString(currentBibtex);
    if (parsed.title) setValue('title', parsed.title, { shouldValidate: true });
    if (parsed.authors) setValue('authors', parsed.authors, { shouldValidate: true });
    if (parsed.year) setValue('year', parsed.year, { shouldValidate: true });
    if (parsed.venue) setValue('venue', parsed.venue, { shouldValidate: true });
    if (parsed.type) setValue('type', parsed.type, { shouldValidate: true });
    if (parsed.href) setValue('href', parsed.href, { shouldValidate: true });
    if (parsed.abstract) setValue('abstract', parsed.abstract, { shouldValidate: true });
  };

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      displayOrder: Number(data.displayOrder) || 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
    onSubmit(payload);
  };

  const handleFormError = (formErrors) => {
    const firstErr = Object.values(formErrors)[0];
    toast.error(firstErr?.message || 'Please check the required fields before saving.');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit, handleFormError)} noValidate>
      {/* Top Header Controls */}
      <div className={styles.topBar}>
        <Link href="/admin/publications" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Publications
        </Link>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Update Publication' : 'Create Publication'}
        </button>
      </div>

      {/* Section 1: Core Publication Details */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Metadata</p>
          <h2>Publication Details</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="title">Paper Title *</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Towards AI-Driven Vulnerability Detection in Software Repositories"
            {...register('title')}
            className={errors.title ? styles.inputError : ''}
          />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="type">Publication Type *</label>
            <select id="type" {...register('type')}>
              <option value="Journal">Journal Article</option>
              <option value="Conference">Conference Paper</option>
              <option value="Book Chapter">Book Chapter</option>
              <option value="Preprint">Preprint / Technical Report</option>
              <option value="Workshop">Workshop Paper</option>
              <option value="Patent">Patent</option>
              <option value="Other">Other Research Output</option>
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="year">Publication Year *</label>
            <input
              id="year"
              type="text"
              placeholder="e.g. 2026"
              {...register('year')}
              className={errors.year ? styles.inputError : ''}
            />
            {errors.year && <span className={styles.errorText}>{errors.year.message}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="authors">Authors List *</label>
          <input
            id="authors"
            type="text"
            placeholder="e.g. Junaid Akram, Ghulam Mujtaba, Jane Doe"
            {...register('authors')}
            className={errors.authors ? styles.inputError : ''}
          />
          <small className={styles.hint}>Comma-separated list of author names as they appear in the paper.</small>
          {errors.authors && <span className={styles.errorText}>{errors.authors.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="venue">Venue / Journal / Conference Name *</label>
          <input
            id="venue"
            type="text"
            placeholder="e.g. IEEE Transactions on Software Engineering (TSE)"
            {...register('venue')}
            className={errors.venue ? styles.inputError : ''}
          />
          {errors.venue && <span className={styles.errorText}>{errors.venue.message}</span>}
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="href">Paper DOI / Official Link (URL)</label>
            <input
              id="href"
              type="url"
              placeholder="https://doi.org/10.1109/..."
              {...register('href')}
            />
            {errors.href && <span className={styles.errorText}>{errors.href.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="slug">Custom URL Slug (optional)</label>
            <input
              id="slug"
              type="text"
              placeholder="auto-generated from title if blank"
              {...register('slug')}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Abstract & BibTeX */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Content & Citation</p>
          <h2>Abstract & BibTeX Entry</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="abstract">Paper Abstract</label>
          <textarea
            id="abstract"
            rows={5}
            placeholder="Provide the comprehensive abstract or summary of research findings..."
            {...register('abstract')}
          />
        </div>

        <div className={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label htmlFor="bibtex" style={{ margin: 0 }}>BibTeX Citation</label>
            <button
              type="button"
              onClick={handleAutoFillBibtex}
              className={styles.toolButton}
              title="Parse BibTeX and auto-populate title, authors, year, and venue"
            >
              <Sparkles size={14} /> Parse & Auto-Fill Fields
            </button>
          </div>
          <textarea
            id="bibtex"
            rows={6}
            placeholder={`@article{akram2026towards,\n  title={Towards AI-Driven Vulnerability Detection},\n  author={Akram, Junaid and Mujtaba, Ghulam},\n  journal={IEEE TSE},\n  year={2026}\n}`}
            {...register('bibtex')}
          />
        </div>
      </section>

      {/* Section 3: Links, Tags & Artifacts */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Artifacts & Taxonomy</p>
          <h2>Open Access Links & Tags</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="pdfUrl">PDF Download URL / Asset Path</label>
            <input
              id="pdfUrl"
              type="text"
              placeholder="/papers/sample.pdf or https://..."
              {...register('pdfUrl')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="codeUrl">Source Code / Dataset URL (GitHub/Zenodo)</label>
            <input
              id="codeUrl"
              type="url"
              placeholder="https://github.com/ssalab/..."
              {...register('codeUrl')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Research Tags & Topics</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Add a topic tag (e.g. LLM Security, Static Analysis)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button type="button" onClick={handleAddTag} className={styles.toolButton}>
              Add Tag
            </button>
          </div>

          <div className={styles.tagList}>
            {currentTags.map((tag) => (
              <span key={tag} className={styles.tagBadge}>
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className={styles.tagRemoveBtn}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Publishing & Visibility */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Publishing Settings</p>
          <h2>Visibility & Ordering</h2>
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
            <small className={styles.hint}>Lower number appears higher on public publications list.</small>
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
              ⭐ Highlight / Featured Paper
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
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Publication'}
        </button>
      </div>
    </form>
  );
}
