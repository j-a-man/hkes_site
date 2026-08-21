import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Search, Plus, Pencil, Copy } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth, type Profile } from '../../lib/auth';
import { staggerContainer, fadeUp } from '../../lib/motion';
import { getRoleBadgeColor, getAvatarColor, initials } from '../../lib/roleColors';

interface LoaderData {
  members: Profile[];
}

const ADD_FORM_EMPTY = { full_name: '', email: '', title: 'Member', role: 'member' as 'member' | 'executive' };

export default function PortalMembers() {
  const { members } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const shouldReduceMotion = useReducedMotion();

  const titles = useMemo(() => ['All', ...Array.from(new Set(members.map((m) => m.title)))], [members]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.title === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Add member
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(ADD_FORM_EMPTY);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; temp_password: string } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    const { data, error } = await supabase.functions.invoke('admin-manage-member', {
      body: { action: 'create', ...addForm },
    });
    setAdding(false);
    if (error || data?.error) {
      setAddError(data?.error ?? error?.message ?? 'Something went wrong.');
      return;
    }
    setCreatedCreds({ email: data.email, temp_password: data.temp_password });
    setAddForm(ADD_FORM_EMPTY);
    revalidator.revalidate();
  };

  const closeAdd = () => {
    setShowAdd(false);
    setCreatedCreds(null);
    setAddError(null);
  };

  // Edit member
  const [editing, setEditing] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', title: '', role: 'member' as 'member' | 'executive', phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const openEdit = (m: Profile) => {
    setEditing(m);
    setEditForm({ full_name: m.full_name, title: m.title, role: m.role, phone: m.phone ?? '' });
    setNewPassword('');
    setPasswordChanged(false);
    setEditError(null);
  };

  const isOwnCard = (m: Profile) => m.id === profile?.id;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (newPassword && newPassword.length < 8) {
      setEditError('New password must be at least 8 characters.');
      return;
    }
    setEditSaving(true);
    setEditError(null);
    const payload: Record<string, any> = { full_name: editForm.full_name, phone: editForm.phone || null };
    if (isExecutive) {
      payload.title = editForm.title;
      payload.role = editForm.role;
    }
    const { error } = await supabase.from('profiles').update(payload).eq('id', editing.id);
    if (error) {
      setEditSaving(false);
      setEditError(error.message);
      return;
    }
    if (isOwnCard(editing) && newPassword) {
      const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
      setEditSaving(false);
      if (pwError) {
        setEditError(pwError.message);
        return;
      }
      setNewPassword('');
      setPasswordChanged(true);
      revalidator.revalidate();
      return;
    }
    setEditSaving(false);
    setEditing(null);
    revalidator.revalidate();
  };

  const handleRemove = async () => {
    if (!editing) return;
    setEditSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-member', {
      body: { action: 'remove', id: editing.id },
    });
    setEditSaving(false);
    if (error || data?.error) {
      setEditError(data?.error ?? error?.message ?? 'Could not remove member.');
      return;
    }
    setEditing(null);
    revalidator.revalidate();
  };

  return (
    <>
      <div>
        <PageHeader
          title="Members Directory"
          subtitle="View and connect with all HKES members"
          action={isExecutive ? (
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAdd(true)}
              className="bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus size={20} /> Add Member
            </motion.button>
          ) : undefined}
        />

        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa4e5b]"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa4e5b]">
              {titles.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          variants={staggerContainer}
        >
          {filteredMembers.map((member) => (
            <motion.div key={member.id} variants={fadeUp} transition={{ duration: 0.4, ease: 'easeOut' }} whileHover={{ y: -4 }}
              className="relative bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-white/10">
              {(isExecutive || isOwnCard(member)) && (
                <button onClick={() => openEdit(member)} className="absolute top-4 right-4 text-gray-400 hover:text-[#fa4e5b]">
                  <Pencil size={16} />
                </button>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${getAvatarColor(member.title)} rounded-full flex items-center justify-center text-white text-2xl mb-4 shadow-md`}>
                  {initials(member.full_name)}
                </div>
                <h3 className="text-xl mb-2">{member.full_name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs mb-3 ${getRoleBadgeColor(member.title)}`}>{member.title}</span>
                <p className="text-sm text-[#555555] dark:text-gray-400 mb-1">{member.email}</p>
                <p className="text-xs text-[#555555] dark:text-gray-400">Joined {member.joined_date}</p>
                <div className="flex gap-2 mt-4 w-full">
                  <a href={`mailto:${member.email}`} className="flex-1 bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow text-sm text-center">
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredMembers.length === 0 && (
          <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-white/10 text-center">
            <p className="text-[#555555] dark:text-gray-400">No members found matching your search.</p>
          </div>
        )}

        <Reveal className="mt-8 bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><p className="text-3xl mb-1">{members.length}</p><p className="text-white/90 text-sm">Total Members</p></div>
            <div><p className="text-3xl mb-1">{members.filter((m) => m.role === 'executive').length}</p><p className="text-white/90 text-sm">E-Board Members</p></div>
            <div><p className="text-3xl mb-1">{new Set(members.map((m) => m.title)).size}</p><p className="text-white/90 text-sm">Distinct Roles</p></div>
            <div><p className="text-3xl mb-1">{members.filter((m) => m.role === 'member').length}</p><p className="text-white/90 text-sm">General Members</p></div>
          </div>
        </Reveal>
      </div>

      <Modal open={showAdd} onOpenChange={closeAdd} title="Add Member">
        {createdCreds ? (
          <div className="space-y-4">
            <p className="text-sm text-[#555555] dark:text-gray-400">Account created. Share these credentials with the new member — this password won't be shown again.</p>
            <div className="bg-[#FFF8F6] dark:bg-white/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center gap-2"><span className="text-sm">Email</span><code className="text-sm">{createdCreds.email}</code></div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm">Temp Password</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm">{createdCreds.temp_password}</code>
                  <button type="button" onClick={() => navigator.clipboard.writeText(createdCreds.temp_password)} className="text-[#fa4e5b]"><Copy size={14} /></button>
                </div>
              </div>
            </div>
            <button onClick={closeAdd} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg">Done</button>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Full Name</label>
              <input required value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Title / Position</label>
              <input required value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" placeholder="e.g. Publicity Chair" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Account Type</label>
              <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as 'member' | 'executive' })} className="w-full px-3 py-2 border border-border rounded-lg">
                <option value="member">Member</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            {addError && <p className="text-sm text-red-600">{addError}</p>}
            <button type="submit" disabled={adding} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg disabled:opacity-60">
              {adding ? 'Creating…' : 'Create Account'}
            </button>
          </form>
        )}
      </Modal>

      <Modal open={!!editing} onOpenChange={(o) => !o && setEditing(null)} title={isOwnCard(editing ?? ({} as Profile)) ? 'Edit My Profile' : `Edit ${editing?.full_name ?? ''}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input required value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Phone</label>
            <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          {isExecutive && (
            <>
              <div>
                <label className="block mb-1 text-sm">Title / Position</label>
                <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Account Type</label>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'member' | 'executive' })} className="w-full px-3 py-2 border border-border rounded-lg">
                  <option value="member">Member</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </>
          )}
          {editing && isOwnCard(editing) && (
            <div>
              <label className="block mb-1 text-sm">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordChanged(false); }}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="At least 8 characters"
              />
              {passwordChanged && <p className="text-sm text-green-600 mt-1">Password updated ✓</p>}
            </div>
          )}
          {editError && <p className="text-sm text-red-600">{editError}</p>}
          <button type="submit" disabled={editSaving} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg disabled:opacity-60">
            {editSaving ? 'Saving…' : 'Save Changes'}
          </button>
          {isExecutive && editing && !isOwnCard(editing) && (
            <button type="button" onClick={handleRemove} disabled={editSaving} className="w-full border border-red-300 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
              Remove Member
            </button>
          )}
        </form>
      </Modal>
    </>
  );
}
