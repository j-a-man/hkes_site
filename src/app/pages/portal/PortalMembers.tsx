import { useMemo, useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Check, Copy, Mail, Pencil, Phone, Plus, Search, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import SiteButton from '../../components/site/SiteButton';
import { IconButton } from '../../components/portal/Controls';
import { Field, FormError, FormSuccess, INPUT } from '../../components/portal/Form';
import Modal, { ConfirmDialog } from '../../components/portal/Modal';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState } from '../../components/portal/Panel';
import StatTile from '../../components/portal/StatTile';
import { useAuth, type Profile } from '../../lib/auth';
import { formatTimestamp } from '../../lib/portal';
import { formatDate, initials } from '../../lib/site';
import { supabase } from '../../lib/supabase';

interface LoaderData {
  members: Profile[];
}

type Role = 'member' | 'executive';
const ADD_FORM_EMPTY = { full_name: '', email: '', title: 'Member', role: 'member' as Role };

// Edge-function errors arrive either as `data.error` or as a thrown error.
async function manageMember(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('admin-manage-member', { body });
  return { data, error: (data?.error as string | undefined) ?? error?.message ?? null };
}

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <code className="truncate rounded-md bg-hk-paper px-2 py-1 text-sm">{value}</code>
        <IconButton
          label={`Copy ${label.toLowerCase()}`}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </IconButton>
      </span>
    </div>
  );
}

export default function PortalMembers() {
  const { members } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive, refreshProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [titleFilter, setTitleFilter] = useState('All');
  const titles = useMemo(() => Array.from(new Set(members.map((m) => m.title))).sort(), [members]);

  const query = search.trim().toLowerCase();
  const shown = members.filter(
    (m) => (titleFilter === 'All' || m.title === titleFilter) && (!query || m.full_name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query)),
  );

  // Add member
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(ADD_FORM_EMPTY);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ email: string; temp_password: string } | null>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    const { data, error } = await manageMember({ action: 'create', ...addForm });
    setAdding(false);
    if (error) {
      setAddError(error);
      return;
    }
    setCreated({ email: data.email, temp_password: data.temp_password });
    setAddForm(ADD_FORM_EMPTY);
    revalidator.revalidate();
  };

  const closeAdd = () => {
    setShowAdd(false);
    setCreated(null);
    setAddError(null);
  };

  // Edit member
  const [editing, setEditing] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', title: '', role: 'member' as Role, phone: '' });
  const [newPassword, setNewPassword] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [removing, setRemoving] = useState(false);

  const isOwn = (m: Profile | null) => m?.id === profile?.id;

  const openEdit = (m: Profile) => {
    setEditing(m);
    setEditForm({ full_name: m.full_name, title: m.title, role: m.role, phone: m.phone ?? '' });
    setNewPassword('');
    setPasswordChanged(false);
    setEditError(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (newPassword && newPassword.length < 8) {
      setEditError('New password must be at least 8 characters.');
      return;
    }
    setEditSaving(true);
    setEditError(null);
    const payload: Partial<Profile> = { full_name: editForm.full_name, phone: editForm.phone || null };
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
    if (isOwn(editing)) await refreshProfile();
    if (isOwn(editing) && newPassword) {
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
    toast.success('Profile saved');
    revalidator.revalidate();
  };

  const handleRemove = async () => {
    if (!editing) return;
    setEditSaving(true);
    const { error } = await manageMember({ action: 'remove', id: editing.id });
    setEditSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(`${editing.full_name} was removed`);
    setRemoving(false);
    setEditing(null);
    revalidator.revalidate();
  };

  const executives = members.filter((m) => m.role === 'executive').length;

  return (
    <>
      <PageHeader
        zh="會員"
        title="Members"
        subtitle="Everyone with a portal account, from the E-Board to general members."
        action={
          isExecutive ? (
            <SiteButton type="button" size="sm" onClick={() => setShowAdd(true)}>
              <Plus size={16} aria-hidden="true" />
              Add member
            </SiteButton>
          ) : undefined
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile value={members.length} label="Accounts" />
        <StatTile value={executives} label="E-Board" />
        <StatTile value={members.length - executives} label="General members" />
        <StatTile value={titles.length} label="Roles" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search members</span>
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-hk-ink-soft" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className={`${INPUT} pl-10`} />
        </label>
        <label className="sm:w-60">
          <span className="sr-only">Filter by role</span>
          <select value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} className={INPUT}>
            <option value="All">All roles</option>
            {titles.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      {shown.length === 0 ? (
        <EmptyState>No members match that search.</EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((member) => (
            <li key={member.id} className="flex flex-col overflow-hidden rounded-[22px] border border-hk-line bg-hk-card shadow-[0_18px_34px_-28px_rgba(30,23,20,0.5)]">
              <div className={`flex items-center justify-between px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white ${member.role === 'executive' ? 'bg-hk-red' : 'bg-hk-red-deep'}`}>
                <span>
                  HKES · {member.role === 'executive' ? 'E-Board' : 'Member'}
                  {isOwn(member) ? ' · You' : ''}
                </span>
                {(isExecutive || isOwn(member)) && (
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    aria-label={`Edit ${member.full_name}`}
                    className="-mr-2 grid h-7 w-7 place-items-center rounded-full hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>
              <div className="flex flex-1 items-start gap-4 p-5">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-dashed border-hk-red/50 font-display text-xl text-hk-red">
                    {initials(member.full_name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold leading-tight text-hk-ink">{member.full_name}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-hk-red">{member.title}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm">
                    <Mail size={14} aria-hidden="true" className="shrink-0 text-hk-ink-soft" />
                    <a href={`mailto:${member.email}`} className="truncate text-hk-ink hover:text-hk-red hover:underline">
                      {member.email}
                    </a>
                  </p>
                  {member.phone && (
                    <p className="mt-1 flex items-center gap-2 text-sm">
                      <Phone size={14} aria-hidden="true" className="shrink-0 text-hk-ink-soft" />
                      <a href={`tel:${member.phone}`} className="truncate text-hk-ink hover:text-hk-red hover:underline">
                        {member.phone}
                      </a>
                    </p>
                  )}
                  <p className="mt-3 text-xs text-hk-ink-soft">Joined {member.joined_date ? formatDate(member.joined_date.slice(0, 10)) : formatTimestamp(member.created_at)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={showAdd}
        onOpenChange={(open) => !open && closeAdd()}
        title={created ? 'Account created' : 'Add member'}
        description={created ? "Share these with the new member. The password won't be shown again." : 'They will get a temporary password to sign in with.'}
      >
        {created ? (
          <div className="space-y-6">
            <div className="divide-y divide-hk-line rounded-xl border-2 border-hk-line px-4">
              <CopyValue label="Email" value={created.email} />
              <CopyValue label="Temp password" value={created.temp_password} />
            </div>
            <SiteButton type="button" onClick={closeAdd} className="w-full">
              Done
            </SiteButton>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4">
            <Field label="Full name">
              <input required value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Email">
              <input required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className={INPUT} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title or position">
                <input required value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} className={INPUT} placeholder="e.g. Publicity Chair" />
              </Field>
              <Field label="Account type">
                <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as Role })} className={INPUT}>
                  <option value="member">Member</option>
                  <option value="executive">Executive</option>
                </select>
              </Field>
            </div>
            {addError && <FormError>{addError}</FormError>}
            <SiteButton type="submit" disabled={adding} className="w-full">
              {adding ? 'Creating…' : 'Create account'}
            </SiteButton>
          </form>
        )}
      </Modal>

      <Modal open={editing !== null && !removing} onOpenChange={(open) => !open && setEditing(null)} title={isOwn(editing) ? 'Edit my profile' : `Edit ${editing?.full_name ?? ''}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Field label="Full name">
            <input required value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className={INPUT} />
          </Field>
          <Field label="Phone" hint="Optional">
            <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={INPUT} />
          </Field>
          {isExecutive && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title or position">
                <input required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Account type">
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })} className={INPUT}>
                  <option value="member">Member</option>
                  <option value="executive">Executive</option>
                </select>
              </Field>
            </div>
          )}
          {isOwn(editing) && (
            <Field label="New password" hint="Leave blank to keep your current password.">
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordChanged(false);
                }}
                className={INPUT}
                placeholder="At least 8 characters"
              />
            </Field>
          )}
          {passwordChanged && <FormSuccess>Password updated.</FormSuccess>}
          {editError && <FormError>{editError}</FormError>}
          <SiteButton type="submit" disabled={editSaving} className="w-full">
            {editSaving ? 'Saving…' : 'Save changes'}
          </SiteButton>
          {isExecutive && editing && !isOwn(editing) && (
            <button
              type="button"
              onClick={() => setRemoving(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-hk-red/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-hk-red transition-colors hover:bg-hk-red/10"
            >
              <UserMinus size={16} aria-hidden="true" />
              Remove member
            </button>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={removing}
        onOpenChange={(open) => !open && setRemoving(false)}
        title="Remove member?"
        body={
          <>
            <span className="font-semibold text-hk-ink">{editing?.full_name}</span> will lose access to the portal and their account will be deleted. This can't be undone.
          </>
        }
        confirmLabel="Remove"
        onConfirm={handleRemove}
        busy={editSaving}
      />
    </>
  );
}
