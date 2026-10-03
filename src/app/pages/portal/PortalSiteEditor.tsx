import { useMemo, useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { ExternalLink, ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import FilterChips from '../../components/site/FilterChips';
import SiteButton from '../../components/site/SiteButton';
import { IconButton, Switch } from '../../components/portal/Controls';
import { Field, FormError, INPUT } from '../../components/portal/Form';
import Modal, { ConfirmDialog } from '../../components/portal/Modal';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState, Panel, PanelHeader } from '../../components/portal/Panel';
import { mutate } from '../../lib/portal';
import { SITE_COLLECTIONS, SITE_PAGES, type CollectionDef, type FieldDef } from '../../lib/siteContentManifest';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import type { SiteContentSection } from '../../lib/queries';

interface LoaderData {
  content: SiteContentSection[];
  collections: Record<string, any[]>;
}

const LABEL = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft';

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile('site-images', file, 'content');
      onChange(publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className={LABEL}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-hk-line bg-hk-paper">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={20} aria-hidden="true" className="text-hk-ink-soft" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input aria-label={`${label} URL`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" className={INPUT} />
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-hk-red hover:underline">
            <Upload size={14} aria-hidden="true" />
            {uploading ? 'Uploading…' : 'Upload a new image'}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        </div>
      </div>
    </div>
  );
}

function SimpleField({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const placeholder = typeof field.default === 'string' ? field.default : undefined;
  if (field.type === 'image') return <ImageField label={field.label} value={value ?? ''} onChange={onChange} />;
  return (
    <Field label={field.label}>
      {field.type === 'textarea' ? (
        <textarea value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={3} className={INPUT} />
      ) : (
        <input value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={INPUT} />
      )}
    </Field>
  );
}

function ListField({ field, items, onChange }: { field: FieldDef; items: Record<string, string>[]; onChange: (items: Record<string, string>[]) => void }) {
  const itemFields = field.itemFields ?? [];
  const update = (idx: number, key: string, val: string) => onChange(items.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));

  return (
    <fieldset>
      <legend className={LABEL}>{field.label}</legend>
      <ol className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 rounded-xl border-2 border-hk-line p-3">
            <span className="mt-2 w-5 shrink-0 text-center font-display text-sm text-hk-red">{idx + 1}</span>
            <div className={`grid flex-1 gap-2 ${itemFields.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {itemFields.map((f) =>
                f.type === 'textarea' ? (
                  <textarea
                    key={f.key}
                    aria-label={`${f.label} ${idx + 1}`}
                    placeholder={f.label}
                    value={item[f.key] ?? ''}
                    onChange={(e) => update(idx, f.key, e.target.value)}
                    rows={2}
                    className={`${INPUT} sm:col-span-2`}
                  />
                ) : (
                  <input key={f.key} aria-label={`${f.label} ${idx + 1}`} placeholder={f.label} value={item[f.key] ?? ''} onChange={(e) => update(idx, f.key, e.target.value)} className={INPUT} />
                ),
              )}
            </div>
            <IconButton label={`Remove item ${idx + 1}`} danger onClick={() => onChange(items.filter((_, i) => i !== idx))}>
              <Trash2 size={16} />
            </IconButton>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...items, Object.fromEntries(itemFields.map((f) => [f.key, '']))])}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-hk-red hover:underline"
      >
        <Plus size={14} aria-hidden="true" /> Add item
      </button>
    </fieldset>
  );
}

// Empty list fields start from their manifest default, so editors tweak the
// items the public site is already showing instead of an empty list.
function withListDefaults(fields: FieldDef[], initial: Record<string, any>) {
  const values = { ...initial };
  for (const field of fields) {
    if (field.type === 'list' && Array.isArray(field.default) && !values[field.key]?.length) values[field.key] = field.default;
  }
  return values;
}

function SectionEditor({ pageKey, sectionKey, label, fields, initial, onSaved }: {
  pageKey: string;
  sectionKey: string;
  label: string;
  fields: FieldDef[];
  initial: Record<string, any>;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, any>>(() => withListDefaults(fields, initial));
  const [saving, setSaving] = useState(false);
  const setField = (key: string, val: any) => setValues((v) => ({ ...v, [key]: val }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // The whole content object is saved, so values for fields no longer in the manifest are kept.
    const ok = await mutate(
      supabase.from('site_content').upsert({ page_key: pageKey, section_key: sectionKey, content: values }, { onConflict: 'page_key,section_key' }),
      `${label} saved`,
    );
    setSaving(false);
    if (ok) onSaved();
  };

  return (
    <Panel>
      <PanelHeader title={label} />
      <form onSubmit={handleSave} className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type === 'list' ? (
              <ListField field={field} items={values[field.key] ?? []} onChange={(v) => setField(field.key, v)} />
            ) : (
              <SimpleField field={field} value={values[field.key]} onChange={(v) => setField(field.key, v)} />
            )}
          </div>
        ))}
        <SiteButton type="submit" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save section'}
        </SiteButton>
      </form>
    </Panel>
  );
}

function CollectionEditor({ def, items, onChanged }: { def: CollectionDef; items: any[]; onChanged: () => void }) {
  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  const titleKey = def.fields.find((f) => ['name', 'title', 'event_name'].includes(f.key))?.key ?? def.fields[0].key;
  const imageKey = def.fields.find((f) => f.type === 'image')?.key;
  const dateKey = def.fields.find((f) => f.type === 'date')?.key;

  const openAdd = () => {
    setEditing('new');
    setForm(
      Object.fromEntries(
        def.fields.map((f) => {
          if (f.type === 'checkbox') return [f.key, false];
          if (f.type === 'select') return [f.key, f.options?.[0] ?? ''];
          return [f.key, ''];
        }),
      ),
    );
    setError(null);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: Record<string, any> = Object.fromEntries(def.fields.map((f) => [f.key, form[f.key]]));
    for (const f of def.fields) {
      if (f.type === 'number' && payload[f.key] !== '' && payload[f.key] != null) payload[f.key] = Number(payload[f.key]);
      if (payload[f.key] === '') payload[f.key] = null;
    }
    const { error } = editing && editing !== 'new' ? await supabase.from(def.key).update(payload).eq('id', editing.id) : await supabase.from(def.key).insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    toast.success(`${def.label} saved`);
    setEditing(null);
    onChanged();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const ok = await mutate(supabase.from(def.key).delete().eq('id', deleting.id), 'Deleted');
    setBusy(false);
    if (ok) {
      setDeleting(null);
      onChanged();
    }
  };

  return (
    <Panel>
      <PanelHeader
        title={def.label}
        action={
          <SiteButton type="button" variant="outline-ink" size="sm" onClick={openAdd}>
            <Plus size={14} aria-hidden="true" />
            Add
          </SiteButton>
        }
      />
      {items.length === 0 ? (
        <EmptyState>Nothing here yet.</EmptyState>
      ) : (
        <ul className="divide-y divide-hk-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              {imageKey && (
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-hk-paper">{item[imageKey] && <img src={item[imageKey]} alt="" className="h-full w-full object-cover" />}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-hk-ink">{item[titleKey] || '(untitled)'}</span>
                {dateKey && item[dateKey] && <span className="block text-xs text-hk-ink-soft">{item[dateKey]}</span>}
              </span>
              <IconButton label={`Edit ${item[titleKey] || 'item'}`} onClick={() => openEdit(item)}>
                <Pencil size={15} />
              </IconButton>
              <IconButton label={`Delete ${item[titleKey] || 'item'}`} danger onClick={() => setDeleting(item)}>
                <Trash2 size={15} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === 'new' ? `Add to ${def.label}` : `Edit ${def.label}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {def.fields.map((f) => {
            const value = form[f.key];
            const set = (v: any) => setForm((current) => ({ ...current, [f.key]: v }));
            if (f.type === 'image') return <ImageField key={f.key} label={f.label} value={value ?? ''} onChange={set} />;
            if (f.type === 'checkbox') {
              return (
                <label key={f.key} className="flex items-center gap-3 text-sm font-semibold text-hk-ink">
                  <Switch checked={!!value} onChange={set} label={f.label} />
                  {f.label}
                </label>
              );
            }
            return (
              <Field key={f.key} label={f.label}>
                {f.type === 'textarea' ? (
                  <textarea value={value ?? ''} onChange={(e) => set(e.target.value)} rows={3} className={INPUT} />
                ) : f.type === 'select' ? (
                  <select value={value ?? ''} onChange={(e) => set(e.target.value)} className={INPUT}>
                    {(f.options ?? []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'} value={value ?? ''} onChange={(e) => set(e.target.value)} className={INPUT} />
                )}
              </Field>
            );
          })}
          {error && <FormError>{error}</FormError>}
          <SiteButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing === 'new' ? 'Add' : 'Save changes'}
          </SiteButton>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this?"
        body={
          <>
            <span className="font-semibold text-hk-ink">{deleting?.[titleKey] || 'This item'}</span> will be removed from the public site. This can't be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        busy={busy}
      />
    </Panel>
  );
}

export default function PortalSiteEditor() {
  const { content, collections } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const [activeLabel, setActiveLabel] = useState(SITE_PAGES[0].label);

  const contentMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    for (const row of content) map[`${row.page_key}:${row.section_key}`] = row.content;
    return map;
  }, [content]);

  const pageDef = SITE_PAGES.find((p) => p.label === activeLabel) ?? SITE_PAGES[0];
  const pageCollections = SITE_COLLECTIONS.filter((c) => c.pageKey === pageDef.key);

  return (
    <>
      <PageHeader
        zh="網站"
        title="Site editor"
        subtitle="Change the words, photos, and listings on the public site. Empty fields show their default text."
        action={
          <SiteButton href={pageDef.path} variant="outline-ink" size="sm">
            View live page
            <ExternalLink size={14} aria-hidden="true" />
          </SiteButton>
        }
      />

      <div className="mb-6">
        <FilterChips label="Choose a page" options={SITE_PAGES.map((p) => p.label)} value={pageDef.label} onChange={setActiveLabel} />
      </div>

      <div key={pageDef.key} className="grid items-start gap-6 xl:grid-cols-2">
        {pageDef.sections.map((section) => (
          <SectionEditor
            key={section.key}
            pageKey={pageDef.key}
            sectionKey={section.key}
            label={section.label}
            fields={section.fields}
            initial={contentMap[`${pageDef.key}:${section.key}`] ?? {}}
            onSaved={() => revalidator.revalidate()}
          />
        ))}
        {pageCollections.map((c) => (
          <CollectionEditor key={c.key} def={c} items={collections[c.key] ?? []} onChanged={() => revalidator.revalidate()} />
        ))}
      </div>
    </>
  );
}
