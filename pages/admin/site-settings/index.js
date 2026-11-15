import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import {
  Save,
  Plus,
  Trash2,
  Building,
  User,
  Award,
  Shield,
  Milestone,
  BarChart,
  Globe,
  Mail,
  Linkedin,
  BookOpen,
  Image as ImageIcon,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import ImageUploader from '../../../components/Admin/ImageUploader/ImageUploader';
import styles from '../../../styles/academic-admin.module.css';

const defaultProfile = {
  key: 'default',
  name: '',
  shortName: '',
  role: '',
  institution: '',
  lab: '',
  labShort: '',
  office: '',
  emails: [],
  labEmail: '',
  googleScholar: '',
  linkedin: '',
  researchGate: '',
  orcid: '',
  officialProfile: '',
  officialFypIdeas: '',
  sourceSite: '',
  credentials: [],
  experience: [],
  education: [],
  pillars: [],
  milestones: [],
  impactStats: [],
  partnerLogos: [],
};

const PILLAR_ICONS = [
  'ShieldCheck',
  'Cpu',
  'Code2',
  'Lock',
  'Terminal',
  'Database',
  'Server',
  'Layers',
  'Activity',
  'Compass',
  'Key',
  'Zap',
];

export default function SiteSettingsAdminPage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/site-settings');
      const json = await res.json();
      if (json.success && json.data) {
        setProfile({
          ...defaultProfile,
          ...json.data,
          emails: Array.isArray(json.data.emails) ? json.data.emails : [],
          credentials: Array.isArray(json.data.credentials) ? json.data.credentials : [],
          experience: Array.isArray(json.data.experience) ? json.data.experience : [],
          education: Array.isArray(json.data.education) ? json.data.education : [],
          pillars: Array.isArray(json.data.pillars) ? json.data.pillars : [],
          milestones: Array.isArray(json.data.milestones) ? json.data.milestones : [],
          impactStats: Array.isArray(json.data.impactStats) ? json.data.impactStats : [],
          partnerLogos: Array.isArray(json.data.partnerLogos) ? json.data.partnerLogos : [],
        });
      } else {
        toast.error(json.message || 'Failed to load site settings');
      }
    } catch (err) {
      toast.error('Network error loading settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!profile.name) {
      toast.error('PI Name is required');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving site profile and settings...');
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to save');

      toast.success('Site settings saved successfully', { id: toastId });
      if (json.data) {
        setProfile((prev) => ({
          ...prev,
          ...json.data,
        }));
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Helper Mutators
  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { role: '', organization: '', period: '' }],
    }));
  };

  const removeExperience = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.experience || [])];
      next.splice(idx, 1);
      return { ...prev, experience: next };
    });
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...(prev.education || []), { qualification: '', institution: '', period: '' }],
    }));
  };

  const removeEducation = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.education || [])];
      next.splice(idx, 1);
      return { ...prev, education: next };
    });
  };

  const addPillar = () => {
    setProfile((prev) => ({
      ...prev,
      pillars: [
        ...(prev.pillars || []),
        { id: `pillar-${Date.now()}`, title: '', iconName: 'ShieldCheck', desc: '' },
      ],
    }));
  };

  const removePillar = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.pillars || [])];
      next.splice(idx, 1);
      return { ...prev, pillars: next };
    });
  };

  const addMilestone = () => {
    setProfile((prev) => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        {
          year: new Date().getFullYear().toString(),
          era: 'Recent Research & Impact',
          title: '',
          summary: '',
          location: '',
          tag: 'Research',
          badge: '',
          achievements: [],
        },
      ],
    }));
  };

  const removeMilestone = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.milestones || [])];
      next.splice(idx, 1);
      return { ...prev, milestones: next };
    });
  };

  const addImpactStat = () => {
    setProfile((prev) => ({
      ...prev,
      impactStats: [...(prev.impactStats || []), { label: '', value: '', note: '' }],
    }));
  };

  const removeImpactStat = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.impactStats || [])];
      next.splice(idx, 1);
      return { ...prev, impactStats: next };
    });
  };

  const addPartnerLogo = () => {
    setProfile((prev) => ({
      ...prev,
      partnerLogos: [
        ...(prev.partnerLogos || []),
        { name: '', image: '', imageDark: '', imageLight: '', href: '', role: 'Research Partner' },
      ],
    }));
  };

  const removePartnerLogo = (idx) => {
    setProfile((prev) => {
      const next = [...(prev.partnerLogos || [])];
      next.splice(idx, 1);
      return { ...prev, partnerLogos: next };
    });
  };

  if (loading && !profile.name) {
    return (
      <AdminLayout title="Site Settings">
        <div className={styles.loadingSpinner}>Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Lab Profile & Site Settings">
      <Head>
        <title>Lab Profile & Site Settings | Admin</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p>Academic CMS</p>
            <h1>Lab Profile & Site Settings</h1>
            <span>
              Manage PI profile, academic credentials, research pillars, career timeline, impact
              metrics, and partner affiliations.
            </span>
          </div>
          <button onClick={handleSave} disabled={saving} className={styles.actionButton}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className={styles.filterTabs}>
          {[
            { id: 'profile', label: 'PI Profile & Contact', icon: User },
            { id: 'academic', label: 'Credentials & Experience', icon: Award },
            { id: 'pillars', label: 'Lab Pillars & Stats', icon: Layers },
            { id: 'milestones', label: 'Career Milestones', icon: Milestone },
            { id: 'partners', label: 'Partner Logos', icon: Building },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className={styles.formGrid}>
          {/* TAB 1: PI Profile & Contact */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>
                  Principal Investigator Profile
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name & Title *</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Dr. Junaid Akram, PhD"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Short Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.shortName || ''}
                      onChange={(e) => setProfile({ ...profile, shortName: e.target.value })}
                      placeholder="e.g. J. Akram"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Academic Role</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.role || ''}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="e.g. Assistant Professor & Head of Lab"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Institution / University</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.institution || ''}
                      onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                      placeholder="e.g. University of Nottingham Ningbo China"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>Lab Details & Office</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Lab Full Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.lab || ''}
                      onChange={(e) => setProfile({ ...profile, lab: e.target.value })}
                      placeholder="e.g. Software Systems & Security Analysis Lab"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Lab Short Name / Acronym</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.labShort || ''}
                      onChange={(e) => setProfile({ ...profile, labShort: e.target.value })}
                      placeholder="e.g. SSA Lab"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Office Location</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={profile.office || ''}
                      onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                      placeholder="e.g. Room C-12, CS Department"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Lab Public Email</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={profile.labEmail || ''}
                      onChange={(e) => setProfile({ ...profile, labEmail: e.target.value })}
                      placeholder="e.g. contact@ssa-lab.tech"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>PI Official Emails (comma-separated)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={
                      Array.isArray(profile.emails)
                        ? profile.emails.join(', ')
                        : profile.emails || ''
                    }
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        emails: e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g. Junaid.Akram@nottingham.edu.cn, junaid.tsinghua@yahoo.com"
                  />
                </div>
              </div>

              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>
                  Academic Social Profiles & External Links
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Google Scholar URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.googleScholar || ''}
                      onChange={(e) => setProfile({ ...profile, googleScholar: e.target.value })}
                      placeholder="https://scholar.google.com/citations?user=..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.linkedin || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ResearchGate URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.researchGate || ''}
                      onChange={(e) => setProfile({ ...profile, researchGate: e.target.value })}
                      placeholder="https://www.researchgate.net/profile/..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>ORCID URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.orcid || ''}
                      onChange={(e) => setProfile({ ...profile, orcid: e.target.value })}
                      placeholder="https://orcid.org/0000-..."
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Official Institutional Profile URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.officialProfile || ''}
                      onChange={(e) => setProfile({ ...profile, officialProfile: e.target.value })}
                      placeholder="https://www.nottingham.edu.cn/..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Official FYP Ideas Sheet URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      value={profile.officialFypIdeas || ''}
                      onChange={(e) => setProfile({ ...profile, officialFypIdeas: e.target.value })}
                      placeholder="https://docs.google.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Credentials, Experience & Education */}
          {activeTab === 'academic' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>
                  Credentials & Accreditations (one per line)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px' }}>
                  Professional memberships, certifications, reviewer recognitions, and awards.
                </p>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 120 }}
                  value={
                    Array.isArray(profile.credentials) ? profile.credentials.join('\n') : ''
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      credentials: e.target.value
                        .split('\n')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="PhD in Software Engineering&#10;Senior Member IEEE&#10;HEC Approved PhD Supervisor&#10;Associate Editor, Journal of Systems and Software"
                />
              </div>

              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Academic & Industry Experience</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Previous faculty appointments, research fellowships, and industry roles.
                    </span>
                  </div>
                  <button type="button" onClick={addExperience} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Experience
                  </button>
                </div>

                {(profile.experience || []).length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No experience records added.
                  </p>
                ) : (
                  profile.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Role / Title"
                        value={exp.role || ''}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx].role = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Institution / Organization"
                        value={exp.organization || ''}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx].organization = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Period (e.g. 2020 — Present)"
                        value={exp.period || ''}
                        onChange={(e) => {
                          const next = [...profile.experience];
                          next[idx].period = e.target.value;
                          setProfile({ ...profile, experience: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Education & Qualifications</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Degrees earned, graduation universities, and academic periods.
                    </span>
                  </div>
                  <button type="button" onClick={addEducation} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Education
                  </button>
                </div>

                {(profile.education || []).length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No education records added.
                  </p>
                ) : (
                  profile.education.map((edu, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Degree / Qualification"
                        value={edu.qualification || ''}
                        onChange={(e) => {
                          const next = [...profile.education];
                          next[idx].qualification = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="University / Institution"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const next = [...profile.education];
                          next[idx].institution = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Period (e.g. 2016 — 2020)"
                        value={edu.period || ''}
                        onChange={(e) => {
                          const next = [...profile.education];
                          next[idx].period = e.target.value;
                          setProfile({ ...profile, education: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Lab Pillars & Stats */}
          {activeTab === 'pillars' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Core Lab Pillars</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Foundational values and focus areas that drive the SSA Research Group.
                    </span>
                  </div>
                  <button type="button" onClick={addPillar} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Pillar
                  </button>
                </div>

                {(profile.pillars || []).map((pil, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gap: 10,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      marginBottom: 12,
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        style={{ flex: 2 }}
                        placeholder="Pillar Title (e.g. Scientific Rigor)"
                        aria-label={`Pillar ${idx + 1} Title`}
                        value={pil.title || ''}
                        onChange={(e) => {
                          const next = [...profile.pillars];
                          next[idx].title = e.target.value;
                          setProfile({ ...profile, pillars: next });
                        }}
                      />
                      <select
                        className={styles.formSelect}
                        style={{ flex: 1 }}
                        aria-label={`Pillar ${idx + 1} Icon`}
                        value={pil.iconName || 'ShieldCheck'}
                        onChange={(e) => {
                          const next = [...profile.pillars];
                          next[idx].iconName = e.target.value;
                          setProfile({ ...profile, pillars: next });
                        }}
                      >
                        {PILLAR_ICONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removePillar(idx)}
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        title="Remove Pillar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea
                      className={styles.formTextarea}
                      style={{ minHeight: 70 }}
                      placeholder="Detailed description of this pillar's mission..."
                      value={pil.desc || ''}
                      onChange={(e) => {
                        const next = [...profile.pillars];
                        next[idx].desc = e.target.value;
                        setProfile({ ...profile, pillars: next });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Lab Impact Statistics</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      High-impact quantitative figures displayed on the public landing page.
                    </span>
                  </div>
                  <button type="button" onClick={addImpactStat} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Impact Stat
                  </button>
                </div>

                {(profile.impactStats || []).map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 2fr auto',
                      gap: 12,
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Label (e.g. Publications)"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const next = [...profile.impactStats];
                        next[idx].label = e.target.value;
                        setProfile({ ...profile, impactStats: next });
                      }}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Value (e.g. 35+)"
                      value={stat.value || ''}
                      onChange={(e) => {
                        const next = [...profile.impactStats];
                        next[idx].value = e.target.value;
                        setProfile({ ...profile, impactStats: next });
                      }}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Note / Description"
                      value={stat.note || ''}
                      onChange={(e) => {
                        const next = [...profile.impactStats];
                        next[idx].note = e.target.value;
                        setProfile({ ...profile, impactStats: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImpactStat(idx)}
                      className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                      title="Remove Stat"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Career Milestones */}
          {activeTab === 'milestones' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Lab Milestones & Career Timeline</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Historical achievements, awards, lab founding dates, and major grants.
                    </span>
                  </div>
                  <button type="button" onClick={addMilestone} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Milestone
                  </button>
                </div>

                {(profile.milestones || []).map((ms, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gap: 10,
                      padding: 16,
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      marginBottom: 14,
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1.5fr 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Year"
                        value={ms.year || ''}
                        onChange={(e) => {
                          const next = [...profile.milestones];
                          next[idx].year = e.target.value;
                          setProfile({ ...profile, milestones: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Title"
                        value={ms.title || ''}
                        onChange={(e) => {
                          const next = [...profile.milestones];
                          next[idx].title = e.target.value;
                          setProfile({ ...profile, milestones: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Era / Period"
                        value={ms.era || ''}
                        onChange={(e) => {
                          const next = [...profile.milestones];
                          next[idx].era = e.target.value;
                          setProfile({ ...profile, milestones: next });
                        }}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Location"
                        value={ms.location || ''}
                        onChange={(e) => {
                          const next = [...profile.milestones];
                          next[idx].location = e.target.value;
                          setProfile({ ...profile, milestones: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(idx)}
                        className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                        title="Remove Milestone"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea
                      className={styles.formTextarea}
                      style={{ minHeight: 70 }}
                      placeholder="Summary description of milestone..."
                      value={ms.summary || ''}
                      onChange={(e) => {
                        const next = [...profile.milestones];
                        next[idx].summary = e.target.value;
                        setProfile({ ...profile, milestones: next });
                      }}
                    />

                    <div className={styles.formGroup}>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Key Achievements (one per line)
                      </label>
                      <textarea
                        className={styles.formTextarea}
                        style={{ minHeight: 60 }}
                        placeholder="Achievement 1&#10;Achievement 2"
                        value={
                          Array.isArray(ms.achievements) ? ms.achievements.join('\n') : ''
                        }
                        onChange={(e) => {
                          const next = [...profile.milestones];
                          next[idx].achievements = e.target.value
                            .split('\n')
                            .map((x) => x.trim())
                            .filter(Boolean);
                          setProfile({ ...profile, milestones: next });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Partner Logos */}
          {activeTab === 'partners' && (
            <div style={{ display: 'grid', gap: 20 }}>
              <div className={styles.card} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Partner & Collaborating Logos</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Partner universities, international labs, funding agencies, and corporate sponsors.
                    </span>
                  </div>
                  <button type="button" onClick={addPartnerLogo} className={styles.secondaryButton}>
                    <Plus size={16} /> Add Partner Logo
                  </button>
                </div>

                {(profile.partnerLogos || []).length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No partner logos configured yet.
                  </p>
                ) : (
                  profile.partnerLogos.map((partner, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gap: 12,
                        padding: 16,
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        marginBottom: 14,
                        background: '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.5fr 1.5fr 1fr auto',
                          gap: 12,
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="Partner / Institution Name"
                          value={partner.name || ''}
                          onChange={(e) => {
                            const next = [...profile.partnerLogos];
                            next[idx].name = e.target.value;
                            setProfile({ ...profile, partnerLogos: next });
                          }}
                        />
                        <input
                          type="url"
                          className={styles.formInput}
                          placeholder="Partner Website URL (https://...)"
                          value={partner.href || ''}
                          onChange={(e) => {
                            const next = [...profile.partnerLogos];
                            next[idx].href = e.target.value;
                            setProfile({ ...profile, partnerLogos: next });
                          }}
                        />
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="Role (e.g. Research Partner)"
                          value={partner.role || ''}
                          onChange={(e) => {
                            const next = [...profile.partnerLogos];
                            next[idx].role = e.target.value;
                            setProfile({ ...profile, partnerLogos: next });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removePartnerLogo(idx)}
                          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                          title="Remove Partner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gap: 8 }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                          Partner Logo Image (Default)
                        </label>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="/academic/partners/logo.png or uploaded asset URL"
                            value={partner.image || ''}
                            onChange={(e) => {
                              const next = [...profile.partnerLogos];
                              next[idx].image = e.target.value;
                              setProfile({ ...profile, partnerLogos: next });
                            }}
                          />
                        </div>
                        <ImageUploader
                          initialImageUrl={partner.image || ''}
                          onUpload={(url) => {
                            const next = [...profile.partnerLogos];
                            next[idx].image = url;
                            setProfile({ ...profile, partnerLogos: next });
                          }}
                          contextTitle={partner.name || 'partner-logo'}
                          imageType="partner-logo"
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                              Dark Mode Logo (Optional)
                            </label>
                            <input
                              type="text"
                              className={styles.formInput}
                              placeholder="e.g. /academic/nottingham-university-logo-dark.svg"
                              value={partner.imageDark || ''}
                              onChange={(e) => {
                                const next = [...profile.partnerLogos];
                                next[idx].imageDark = e.target.value;
                                setProfile({ ...profile, partnerLogos: next });
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                              Light Mode Logo (Optional)
                            </label>
                            <input
                              type="text"
                              className={styles.formInput}
                              placeholder="e.g. /academic/nottingham-university-logo-light.svg"
                              value={partner.imageLight || ''}
                              onChange={(e) => {
                                const next = [...profile.partnerLogos];
                                next[idx].imageLight = e.target.value;
                                setProfile({ ...profile, partnerLogos: next });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <button type="submit" disabled={saving} className={styles.actionButton}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
