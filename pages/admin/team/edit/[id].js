import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../components/Admin/AdminLayout/AdminLayout';
import TeamMemberForm from '../../../../components/Admin/Team/TeamMemberForm';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/team-members/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setMember(json.data);
        } else if (json.item) {
          setMember(json.item);
        } else {
          toast.error(json.message || 'Failed to load team member');
        }
      } catch (err) {
        toast.error('Network error loading member');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!id) return;
    setSubmitting(true);
    const toastId = toast.loading('Updating team member...');
    try {
      const res = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || (json.errors && json.errors[0]?.message) || 'Failed to update team member');
      }

      toast.success('Team member updated successfully!', { id: toastId });
      router.push('/admin/team');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Team Member">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#0284c7' }}>
          Loading member details...
        </div>
      </AdminLayout>
    );
  }

  if (!member) {
    return (
      <AdminLayout title="Member Not Found">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h3>Team member not found</h3>
          <button onClick={() => router.push('/admin/team')} style={{ marginTop: 16 }}>
            Back to Team List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${member.name}`}>
      <Head>
        <title>Edit Team Member | Admin</title>
      </Head>
      <TeamMemberForm
        initialData={member}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        isEdit={true}
      />
    </AdminLayout>
  );
}
