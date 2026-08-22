import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import ResearchDomainForm from '../../../components/Admin/ResearchAreas/ResearchDomainForm';

export default function NewResearchDomainPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const toastId = toast.loading('Creating research domain...');
    try {
      const res = await fetch('/api/admin/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to create research domain');
      }

      toast.success('Research domain created successfully!', { id: toastId });
      router.push('/admin/research-areas');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add Research Area">
      <Head>
        <title>Add Research Area | Admin</title>
      </Head>
      <ResearchDomainForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
    </AdminLayout>
  );
}
