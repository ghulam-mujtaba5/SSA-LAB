import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { researchDomainSchema } from '../../../lib/validation/schemas';
import { Save, ArrowLeft, Plus, Trash2, Cpu, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '../ImageUploader/ImageUploader';
import styles from './ResearchDomainForm.module.css';

const GRAPHIC_KEYS = [
  'cyber-security',
  'software-engineering',
  'ai-security',
  'vulnerability-analysis',
  'cloud-systems',
  'empirical-se',
  'code-intelligence',
  'blockchain-security',
];

export default function ResearchDomainForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const [keyProblemsText, setKeyProblemsText] = useState('');
  const [currentDirectionsText, setCurrentDirectionsText] = useState('');
  const [projectIdeasText, setProjectIdeasText] = useState('');
  const [coreTopicsText, setCoreTopicsText] = useState('');
  const [toolsList, setToolsList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(researchDomainSchema),
    defaultValues: {
      title: initialData.title || '',
      domainId: initialData.domainId || initialData.slug || '',
      slug: initialData.slug || '',
      number: initialData.number || '01',
      graphicKey: initialData.graphicKey || 'cyber-security',
      image: initialData.image || '',
      description: initialData.description || '',
      overview: initialData.overview || '',
      published: initialData.published !== false,
      displayOrder: Number(initialData.displayOrder) || 0,
      toolsAndDatasets: initialData.toolsAndDatasets || { items: [], summary: '' },
      keyProblems: Array.isArray(initialData.keyProblems) ? initialData.keyProblems : [],
      currentDirections: Array.isArray(initialData.currentDirections) ? initialData.currentDirections : [],
      projectIdeas: Array.isArray(initialData.projectIdeas) ? initialData.projectIdeas : [],
      coreTopics: Array.isArray(initialData.coreTopics) ? initialData.coreTopics : [],
    },
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        title: initialData.title || '',
        domainId: initialData.domainId || initialData.slug || '',
        slug: initialData.slug || '',
        number: initialData.number || '01',
        graphicKey: initialData.graphicKey || 'cyber-security',
        image: initialData.image || '',
        description: initialData.description || '',
        overview: initialData.overview || '',
        published: initialData.published !== false,
        displayOrder: Number(initialData.displayOrder) || 0,
        toolsAndDatasets: initialData.toolsAndDatasets || { items: [], summary: '' },
        keyProblems: Array.isArray(initialData.keyProblems) ? initialData.keyProblems : [],
        currentDirections: Array.isArray(initialData.currentDirections) ? initialData.currentDirections : [],
        projectIdeas: Array.isArray(initialData.projectIdeas) ? initialData.projectIdeas : [],
        coreTopics: Array.isArray(initialData.coreTopics) ? initialData.coreTopics : [],
      });

      setKeyProblemsText(
        Array.isArray(initialData.keyProblems) ? initialData.keyProblems.join('\n') : ''
      );
      setCurrentDirectionsText(
        Array.isArray(initialData.currentDirections) ? initialData.currentDirections.join('\n') : ''
      );
      setProjectIdeasText(
        Array.isArray(initialData.projectIdeas) ? initialData.projectIdeas.join('\n') : ''
      );
      setCoreTopicsText(
        Array.isArray(initialData.coreTopics) ? initialData.coreTopics.join(', ') : ''
      );
      setToolsList(
        initialData.toolsAndDatasets && Array.isArray(initialData.toolsAndDatasets.items)
          ? initialData.toolsAndDatasets.items
          : []
      );
    }
  }, [initialData, reset]);

  const addToolItem = () => {
    setToolsList([...toolsList, { name: '', url: '' }]);
  };

  const updateToolItem = (idx, field, val) => {
    const next = [...toolsList];
    next[idx][field] = val;
    setToolsList(next);
  };

  const removeToolItem = (idx) => {
    const next = [...toolsList];
    next.splice(idx, 1);
    setToolsList(next);
  };

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      domainId: data.domainId || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      keyProblems: keyProblemsText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      currentDirections: currentDirectionsText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      projectIdeas: projectIdeasText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      coreTopics: coreTopicsText
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      toolsAndDatasets: {
        summary: data.toolsAndDatasets?.summary || '',
        items: toolsList.filter((t) => t.name.trim() !== ''),
      },
      displayOrder: Number(data.displayOrder) || 0,
    };

    onSubmit(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/admin/research-areas" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Research Areas
        </Link>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Update Domain' : 'Create Domain'}
        </button>
      </div>

      {/* Section 1: Domain Essentials */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Research Focus</p>
          <h2>Domain Essentials</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="title">Domain Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Cyber Security & Vulnerability Analysis"
              {...register('title')}
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="number">Domain Number / Code</label>
            <input
              id="number"
              type="text"
              placeholder="01"
              {...register('number')}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="graphicKey">Graphic / Illustration Key</label>
            <select id="graphicKey" {...register('graphicKey')}>
              {GRAPHIC_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="domainId">Domain ID / URL Identifier (slug)</label>
            <input
              id="domainId"
              type="text"
              placeholder="e.g. cyber-security"
              {...register('domainId')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Short Description *</label>
          <textarea
            id="description"
            rows={3}
            placeholder="Brief summary of this research domain..."
            {...register('description')}
            className={errors.description ? styles.inputError : ''}
          />
          {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="overview">Comprehensive Academic Overview</label>
          <textarea
            id="overview"
            rows={5}
            placeholder="Deep academic overview of the domain, theoretical underpinnings, and systemic impacts..."
            {...register('overview')}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="coreTopics">Core Topics (comma-separated)</label>
          <input
            id="coreTopics"
            type="text"
            placeholder="e.g. Vulnerability Detection, Automated Repair, LLM Security, Threat Modeling"
            value={coreTopicsText}
            onChange={(e) => setCoreTopicsText(e.target.value)}
          />
        </div>
      </section>

      {/* Section 2: Problems & Current Directions */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Agenda</p>
          <h2>Key Problems & Research Directions</h2>
        </div>

        <div className={styles.field}>
          <label>Key Problems Addressed (one per line)</label>
          <textarea
            rows={5}
            placeholder="Security weaknesses introduced during architectural design&#10;Incomplete SBOM validation in CI/CD pipelines&#10;False positive fatigue in static analyzers"
            value={keyProblemsText}
            onChange={(e) => setKeyProblemsText(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Current Research Directions (one per line)</label>
          <textarea
            rows={5}
            placeholder="AI-assisted automated vulnerability repair&#10;Fine-tuned LLM security auditing agents&#10;Supply chain integrity verification"
            value={currentDirectionsText}
            onChange={(e) => setCurrentDirectionsText(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Prospective Project Ideas / Thesis Directions (one per line)</label>
          <textarea
            rows={4}
            placeholder="LLM-Guided Fuzzing for Open-Source Cryptographic Libraries&#10;Zero-Day Exploit Detection with Graph Neural Networks"
            value={projectIdeasText}
            onChange={(e) => setProjectIdeasText(e.target.value)}
          />
        </div>
      </section>

      {/* Section 3: Tools & Datasets */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Artifacts</p>
          <h2>Tools, Frameworks & Benchmarks</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="toolsSummary">Tools & Datasets Summary</label>
          <input
            id="toolsSummary"
            type="text"
            placeholder="e.g. Open-source benchmark datasets and diagnostic toolchains developed by SSA Lab"
            {...register('toolsAndDatasets.summary')}
          />
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 650, color: '#334155' }}>
              Tool & Dataset Items
            </label>
            <button type="button" onClick={addToolItem} className={styles.toolButton}>
              <Plus size={14} /> Add Tool / Dataset
            </button>
          </div>

          {toolsList.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Name (e.g. VulnRepairBench)"
                value={item.name || ''}
                onChange={(e) => updateToolItem(idx, 'name', e.target.value)}
              />
              <input
                type="url"
                className={styles.formInput}
                placeholder="URL (https://github.com/...)"
                value={item.url || ''}
                onChange={(e) => updateToolItem(idx, 'url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeToolItem(idx)}
                className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Illustration Image */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Visuals</p>
          <h2>Domain Illustration & Icon Image</h2>
        </div>

        <div className={styles.field}>
          <label htmlFor="image">Illustration Image URL</label>
          <input
            id="image"
            type="text"
            placeholder="/academic/illustrations/cyber-security.webp or asset URL"
            {...register('image')}
          />
        </div>

        <ImageUploader
          initialImageUrl={watch('image') || ''}
          onUpload={(url) => setValue('image', url, { shouldValidate: true })}
          contextTitle={watch('title') || 'research-domain'}
          imageType="domain-illustration"
        />
      </section>

      {/* Section 5: Visibility & Ordering */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Publishing</p>
          <h2>Display & Visibility</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="displayOrder">Display Order</label>
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
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Research Domain'}
        </button>
      </div>
    </form>
  );
}
