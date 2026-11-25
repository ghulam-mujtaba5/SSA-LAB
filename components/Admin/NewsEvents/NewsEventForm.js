import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventHighlightSchema } from '../../../lib/validation/schemas';
import { Save, ArrowLeft, Calendar, Image as ImageIcon, ExternalLink, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '../ImageUploader/ImageUploader';
import styles from './NewsEventForm.module.css';

const EVENT_CATEGORIES = {
  news: 'News',
  workshop: 'Workshop',
  conference: 'Conference',
  seminar: 'Seminar',
  exhibition: 'Exhibition',
  award: 'Award',
  'poster session': 'Poster Session',
  other: 'Other',
};

function normalizeEventCategory(cat) {
  if (!cat) return 'News';
  const key = String(cat).trim().toLowerCase();
  return EVENT_CATEGORIES[key] || cat;
}

export default function NewsEventForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const buildDefaults = (data = {}) => ({
    title: data.title || '',
    slug: data.slug || '',
    year: data.year || new Date().getFullYear().toString(),
    date: data.date || data.dateDisplay || '',
    badge: data.badge || 'News',
    category: normalizeEventCategory(data.category),
    venue: data.venue || '',
    location: data.location || '',
    summary: data.summary || '',
    content: data.content || data.details || '',
    image: data.image || data.src || '',
    alt: data.alt || '',
    caption: data.caption || data.galleryCaption || '',
    orientation: data.orientation || 'landscape',
    isGalleryItem: Boolean(data.isGalleryItem),
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
    resolver: zodResolver(eventHighlightSchema),
    defaultValues: buildDefaults(initialData),
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(buildDefaults(initialData));
    }
  }, [initialData, reset]);

  const isGallery = watch('isGalleryItem');

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      src: data.image || data.src || '',
      displayOrder: Number(data.displayOrder) || 0,
    };
    onSubmit(payload);
  };

  const handleFormError = (formErrors) => {
    const firstErr = Object.values(formErrors)[0];
    toast.error(firstErr?.message || 'Please check the required fields before saving.');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit, handleFormError)} noValidate>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/admin/news-events" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to News & Events
        </Link>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create News/Event'}
        </button>
      </div>

      {/* Section 1: Event Essentials */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Event Details</p>
          <h2>Headline & Classification</h2>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="title">Event / News Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Keynote at IEEE International Conference"
              {...register('title')}
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select id="category" {...register('category')}>
              <option value="News">News Announcement</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference / Keynote</option>
              <option value="Seminar">Seminar / Guest Lecture</option>
              <option value="Exhibition">Exhibition / Demo</option>
              <option value="Award">Award / Recognition</option>
              <option value="Poster Session">Poster Session</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="date">Event Date / Period</label>
            <input
              id="date"
              type="text"
              placeholder="e.g. October 2025 or Nov 15, 2025"
              {...register('date')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="badge">Badge Label (short tag)</label>
            <input
              id="badge"
              type="text"
              placeholder="e.g. Keynote, Award, Workshop, News"
              {...register('badge')}
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="location">Location / City & Country</label>
            <input
              id="location"
              type="text"
              placeholder="e.g. University of Luxembourg / Lahore, Pakistan"
              {...register('location')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="venue">Venue / Institution</label>
            <input
              id="venue"
              type="text"
              placeholder="e.g. Faculty of Science, Technology and Medicine"
              {...register('venue')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="summary">Summary Description *</label>
          <textarea
            id="summary"
            rows={3}
            placeholder="Brief summary of the announcement or event highlight..."
            {...register('summary')}
            className={errors.summary ? styles.inputError : ''}
          />
          {errors.summary && <span className={styles.errorText}>{errors.summary.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="content">Full Content / Extended Details (optional)</label>
          <textarea
            id="content"
            rows={6}
            placeholder="In-depth details, proceedings summary, speaker biographies, or outcomes..."
            {...register('content')}
          />
        </div>
      </section>

      {/* Section 2: Photo & Gallery Showcase */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Media & Gallery</p>
          <h2>Photo Showcase & Captions</h2>
        </div>

        <div className={styles.toggles} style={{ marginBottom: 12 }}>
          <label>
            <Controller
              name="isGalleryItem"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
            📸 Include in Photo Gallery Showcase
          </label>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="image">Image Asset Path / URL</label>
            <input
              id="image"
              type="text"
              placeholder="/academic/events/keynote-talk.webp or asset URL"
              {...register('image')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="orientation">Photo Orientation</label>
            <select id="orientation" {...register('orientation')}>
              <option value="landscape">Landscape (Wide)</option>
              <option value="portrait">Portrait (Tall)</option>
            </select>
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="caption">Gallery Caption (displayed in lightbox)</label>
            <input
              id="caption"
              type="text"
              placeholder="e.g. Dr. Junaid Akram, PhD delivering keynote address in Luxembourg"
              {...register('caption')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="alt">Accessibility Alt Text</label>
            <input
              id="alt"
              type="text"
              placeholder="e.g. Professor giving presentation at conference podium"
              {...register('alt')}
            />
          </div>
        </div>

        <ImageUploader
          initialImageUrl={watch('image') || ''}
          onUpload={(url) => setValue('image', url, { shouldValidate: true })}
          onAltTextChange={(altVal) => setValue('alt', altVal, { shouldValidate: true })}
          contextTitle={watch('title') || 'event-photo'}
          imageType="event-photo"
        />
      </section>

      {/* Section 3: Visibility & Ordering */}
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p>Publishing</p>
          <h2>Display & Visibility</h2>
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
              ⭐ Featured Highlight
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
          <Save size={18} /> {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
