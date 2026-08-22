import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import NewsEventForm from '../../../components/Admin/NewsEvents/NewsEventForm';

export default function NewNewsEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const toastId = toast.loading('Creating news/event highlight...');
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to create event highlight');
      }

      toast.success('News/Event highlight created successfully!', { id: toastId });
      router.push('/admin/news-events');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add News / Event">
      <Head>
        <title>Add News / Event | Admin</title>
      </Head>
      <NewsEventForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
    </AdminLayout>
  );
}
