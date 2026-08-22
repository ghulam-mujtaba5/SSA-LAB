import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/Admin/AdminLayout/AdminLayout';
import TeamMemberForm from '../../../components/Admin/Team/TeamMemberForm';

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const toastId = toast.loading('Adding team member...');
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to add team member');
      }

      toast.success('Team member added successfully!', { id: toastId });
      router.push('/admin/team');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Add Team Member">
      <Head>
        <title>Add Team Member | Admin</title>
      </Head>
      <TeamMemberForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
    </AdminLayout>
  );
}
