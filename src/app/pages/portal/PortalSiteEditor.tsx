import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import PortalLayout from '../../components/PortalLayout';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { ExternalLink, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import { SITE_PAGES, SITE_COLLECTIONS, type FieldDef, type CollectionDef } from '../../lib/siteContentManifest';
import type { SiteContentSection } from '../../lib/queries';

interface LoaderData {
  content: SiteContentSection[];
  collections: Record<string, any[]>;
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile('site-images', file, 'content');
      onChange(publicUrl);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="" className="w-14 h-14 object-cover rounded-lg border border-border" />}
      <div className="flex-1 space-y-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
        <label className="inline-flex items-center gap-2 text-xs text-[#fa4e5b] cursor-pointer">
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload new image'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}

function SimpleField({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.type === 'textarea') {
    return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />;
  }
  if (field.type === 'image') {
    return <ImageField value={value ?? ''} onChange={onChange} />;
  }
  return <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />;
}

function ListField({ field, items, onChange }: { field: FieldDef; items: any[]; onChange: (items: any[]) => void }) {
  const itemFields = field.itemFields ?? [];
  const update = (idx: number, key: string, val: string) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, Object.fromEntries(itemFields.map((f) => [f.key, '']))]);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
          <button type="button" onClick={() => remove(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
            <Trash2 size={14} />
          </button>
          {itemFields.map((f) => (
            <div key={f.key}>
              <label className="block mb-1 text-xs text-[#555555] dark:text-gray-400">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={item[f.key] ?? ''} onChange={(e) => update(idx, f.key, e.target.value)} rows={2} className="w-full px-2 py-1.5 border border-border rounded-md text-sm" />
              ) : (
                <input value={item[f.key] ?? ''} onChange={(e) => update(idx, f.key, e.target.value)} className="w-full px-2 py-1.5 border border-border rounded-md text-sm" />
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-[#fa4e5b] hover:underline">+ Add item</button>
    </div>
  );
}

function SectionEditor({ pageKey, sectionKey, label, fields, initial, onSaved }: {
  pageKey: string; sectionKey: string; label: string; fields: FieldDef[]; initial: Record<string, any>; onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const setField = (key: string, val: any) => setValues((v) => ({ ...v, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_content')
      .upsert({ page_key: pageKey, section_key: sectionKey, content: values }, { onConflict: 'page_key,section_key' });
    setSaving(false);
    if (!error) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
      onSaved();
    }
  };

  return (
    <div className="border border-gray-100 dark:border-white/10 rounded-xl p-5">
      <h3 className="text-lg mb-4">{label}</h3>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block mb-1 text-sm">{field.label}</label>
            {field.type === 'list'
              ? <ListField field={field} items={values[field.key] ?? []} onChange={(v) => setField(field.key, v)} />
              : <SimpleField field={field} value={values[field.key]} onChange={(v) => setField(field.key, v)} />}
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className="mt-4 bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-5 py-2 rounded-lg text-sm disabled:opacity-60">
        {saving ? 'Saving…' : savedFlash ? 'Saved ✓' : 'Save Section'}
      </button>
    </div>
  );
}

function CollectionEditor({ def, items, onChanged }: { def: CollectionDef; items: any[]; onChanged: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(Object.fromEntries(def.fields.map((f) => {
      if (f.type === 'checkbox') return [f.key, false];
      if (f.type === 'select') return [f.key, f.options?.[0] ?? ''];
      return [f.key, ''];
    })));
    setError(null);
    setModalOpen(true);
  };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form };
    delete payload.id;
    for (const f of def.fields) {
      if (f.type === 'number' && payload[f.key] !== '' && payload[f.key] != null) payload[f.key] = Number(payload[f.key]);
      if (payload[f.key] === '') payload[f.key] = null;
    }
    const { error } = editing
      ? await supabase.from(def.key).update(payload).eq('id', editing.id)
      : await supabase.from(def.key).insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setModalOpen(false);
    onChanged();
  };

  const handleDelete = async (id: string) => {
    await supabase.from(def.key).delete().eq('id', id);
    onChanged();
  };

  const titleFieldKey = def.fields.find((f) => f.key === 'name' || f.key === 'title' || f.key === 'event_name')?.key ?? def.fields[0].key;

  return (
    <div className="border border-gray-100 dark:border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">{def.label}</h3>
        <button onClick={openAdd} className="flex items-center gap-1 text-sm text-[#fa4e5b] hover:underline"><Plus size={16} /> Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-[#FFF8F6] dark:bg-white/5 rounded-lg">
            <span className="text-sm truncate">{item[titleFieldKey] || '(untitled)'}</span>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-[#fa4e5b]"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[#555555] dark:text-gray-400">Nothing here yet.</p>}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing ? `Edit ${def.label}` : `Add ${def.label}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {def.fields.map((f) => (
            <div key={f.key}>
              <label className="block mb-1 text-sm">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
              ) : f.type === 'image' ? (
                <ImageField value={form[f.key] ?? ''} onChange={(v) => setForm({ ...form, [f.key]: v })} />
              ) : f.type === 'select' ? (
                <select value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                  {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'checkbox' ? (
                <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
              ) : f.type === 'date' ? (
                <input type="date" value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
              ) : f.type === 'number' ? (
                <input type="number" value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
              ) : (
                <input value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg disabled:opacity-60">
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default function PortalSiteEditor() {
  const { content, collections } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const [activePage, setActivePage] = useState(SITE_PAGES[0].key);

  const contentMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    for (const row of content) map[`${row.page_key}:${row.section_key}`] = row.content;
    return map;
  }, [content]);

  const pageDef = SITE_PAGES.find((p) => p.key === activePage)!;
  const pageCollections = SITE_COLLECTIONS.filter((c) => c.pageKey === activePage);

  return (
    <PortalLayout>
      <div>
        <PageHeader title="Site Editor" subtitle="Edit the text, images, and content shown on the public site" />

        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/10 mb-6">
          <div className="flex flex-wrap gap-2">
            {SITE_PAGES.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePage(p.key)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activePage === p.key
                    ? 'bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">{pageDef.label}</h2>
            <a href={pageDef.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[#fa4e5b] hover:underline">
              View live page <ExternalLink size={14} />
            </a>
          </div>

          <div className="space-y-6">
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
        </Reveal>
      </div>
    </PortalLayout>
  );
}
