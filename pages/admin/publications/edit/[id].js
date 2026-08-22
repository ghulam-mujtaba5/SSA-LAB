import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../components/Admin/AdminLayout/AdminLayout';
import PublicationForm from '../../../../components/Admin/Publications/PublicationForm';

export default function EditPublicationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPub = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/publications/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setPublication(json.data);
        } else if (json.item) {
          setPublication(json.item);
        } else {
          toast.error(json.message || 'Failed to load publication');
        }
      } catch (err) {
        toast.error('Network error loading publication');
      } finally {
        setLoading(false);
      }
    };
    fetchPub();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!id) return;
    setSubmitting(true);
    const toastId = toast.loading('Updating publication...');
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to update publication');
      }

      toast.success('Publication updated successfully!', { id: toastId });
      router.push('/admin/publications');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Publication">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#0284c7' }}>
          Loading publication details...
        </div>
      </AdminLayout>
    );
  }

  if (!publication) {
    return (
      <AdminLayout title="Publication Not Found">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>Publication not found</h3>
          <button onClick={() => router.push('/admin/publications')} style={{ marginTop: 16 }}>
            Back to Publications
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${publication.title}`}>
      <Head>
        <title>Edit Publication | Admin</title>
      </Head>
      <PublicationForm
        initialData={publication}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        isEdit={true}
      />
    </AdminLayout>
  );
}
