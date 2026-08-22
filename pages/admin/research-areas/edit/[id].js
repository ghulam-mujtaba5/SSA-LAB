import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../components/Admin/AdminLayout/AdminLayout';
import ResearchDomainForm from '../../../../components/Admin/ResearchAreas/ResearchDomainForm';

export default function EditResearchDomainPage() {
  const router = useRouter();
  const { id } = router.query;

  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDomain = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/research-domains/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setDomain(json.data);
        } else if (json.item) {
          setDomain(json.item);
        } else {
          toast.error(json.message || 'Failed to load domain');
        }
      } catch (err) {
        toast.error('Network error loading domain');
      } finally {
        setLoading(false);
      }
    };
    fetchDomain();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!id) return;
    setSubmitting(true);
    const toastId = toast.loading('Updating research domain...');
    try {
      const res = await fetch(`/api/research-domains/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to update research domain');
      }

      toast.success('Research domain updated successfully!', { id: toastId });
      router.push('/admin/research-areas');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Research Area">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#0284c7' }}>
          Loading research domain details...
        </div>
      </AdminLayout>
    );
  }

  if (!domain) {
    return (
      <AdminLayout title="Domain Not Found">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>Research domain not found</h3>
          <button onClick={() => router.push('/admin/research-areas')} style={{ marginTop: 16 }}>
            Back to Research Areas
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${domain.title}`}>
      <Head>
        <title>Edit Research Area | Admin</title>
      </Head>
      <ResearchDomainForm
        initialData={domain}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        isEdit={true}
      />
    </AdminLayout>
  );
}
