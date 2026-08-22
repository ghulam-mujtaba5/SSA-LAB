import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import PublicationForm from '../../../components/Admin/Publications/PublicationForm';

export default function NewPublicationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const toastId = toast.loading('Creating publication...');
    try {
      const res = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to create publication');
      }

      toast.success('Publication created successfully!', { id: toastId });
      router.push('/admin/publications');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add Publication">
      <Head>
        <title>Add Publication | Admin</title>
      </Head>
      <PublicationForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
    </AdminLayout>
  );
}
