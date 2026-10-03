import { toast } from 'sonner';
import { todayISO } from './site';

interface MutationResult {
  error: { message: string } | null;
}

// Runs a Supabase write and reports the outcome as a toast, so failed updates
// (for example ones blocked by row-level security) are never silent.
export async function mutate(operation: PromiseLike<MutationResult>, success?: string): Promise<boolean> {
  const { error } = await operation;
  if (error) {
    toast.error(error.message);
    return false;
  }
  if (success) toast.success(success);
  return true;
}

export function money(amount: number | string | null | undefined) {
  return Number(amount ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysBetween(fromISO: string, toISO: string) {
  return Math.round((Date.parse(`${toISO}T00:00:00`) - Date.parse(`${fromISO}T00:00:00`)) / 86_400_000);
}

export type Urgency = 'overdue' | 'soon' | 'later';

// How a due date reads relative to today, e.g. "Due tomorrow" or "2 days overdue".
export function dueInfo(dueISO: string, today = todayISO()): { text: string; urgency: Urgency } {
  const days = daysBetween(today, dueISO);
  if (days < 0) return { text: `${-days} day${days === -1 ? '' : 's'} overdue`, urgency: 'overdue' };
  if (days === 0) return { text: 'Due today', urgency: 'soon' };
  if (days === 1) return { text: 'Due tomorrow', urgency: 'soon' };
  return { text: `Due in ${days} days`, urgency: days <= 3 ? 'soon' : 'later' };
}

export const URGENCY_DOT: Record<Urgency, string> = {
  overdue: 'bg-hk-red',
  soon: 'bg-amber-500',
  later: 'bg-emerald-600',
};

// Spreadsheet apps execute cells that start with = + - @ (or tab/CR) as
// formulas. Entries come from anonymous visitors, so neutralise them.
function csvCell(value: unknown) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, rows: unknown[][]) {
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
