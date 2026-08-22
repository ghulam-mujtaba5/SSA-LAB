import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../components/Admin/AdminLayout/AdminLayout';
import NewsEventForm from '../../../../components/Admin/NewsEvents/NewsEventForm';

export default function EditNewsEventPage() {
  const router = useRouter();
  const { id } = router.query;

  const [eventItem, setEventItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news-events/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setEventItem(json.data);
        } else if (json.item) {
          setEventItem(json.item);
        } else {
          toast.error(json.message || 'Failed to load event details');
        }
      } catch (err) {
        toast.error('Network error loading event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!id) return;
    setSubmitting(true);
    const toastId = toast.loading('Updating news/event...');
    try {
      const res = await fetch(`/api/news-events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to update news/event');
      }

      toast.success('News/Event updated successfully!', { id: toastId });
      router.push('/admin/news-events');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit News / Event">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#0284c7' }}>
          Loading event details...
        </div>
      </AdminLayout>
    );
  }

  if (!eventItem) {
    return (
      <AdminLayout title="Event Not Found">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>Event record not found</h3>
          <button onClick={() => router.push('/admin/news-events')} style={{ marginTop: 16 }}>
            Back to News & Events
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${eventItem.title}`}>
      <Head>
        <title>Edit News / Event | Admin</title>
      </Head>
      <NewsEventForm
        initialData={eventItem}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        isEdit={true}
      />
    </AdminLayout>
  );
}
