import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import SiteButton from '../site/SiteButton';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const WIDTHS = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

// A placard-framed dialog, matching the cards on the public site.
export default function Modal({ open, onOpenChange, title, description, children, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#120d0c]/60 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        {/* Radix links Dialog.Description itself; without one, opt out of its missing-description warning. */}
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={`fixed left-1/2 top-1/2 z-[81] max-h-[90vh] w-[calc(100vw-2rem)] ${WIDTHS[size]} -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] bg-hk-card p-2 font-['Poppins'] text-hk-ink shadow-2xl ring-1 ring-hk-line focus:outline-none data-[state=open]:animate-pop-in`}
        >
          <div className="rounded-[18px] border-2 border-hk-red p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="font-display text-xl font-normal uppercase leading-tight text-hk-ink">{title}</Dialog.Title>
                {description && <Dialog.Description className="mt-2 text-sm leading-relaxed text-hk-ink-soft">{description}</Dialog.Description>}
              </div>
              <Dialog.Close aria-label="Close" className="-mr-2 -mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-hk-ink-soft hover:bg-hk-blush hover:text-hk-red focus-visible:outline-3 focus-visible:outline-hk-red">
                <X size={18} />
              </Dialog.Close>
            </div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  busy?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, title, body, confirmLabel, onConfirm, busy }: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="sm">
      <div className="text-sm leading-relaxed text-hk-ink-soft">{body}</div>
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <SiteButton type="button" variant="outline-ink" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </SiteButton>
        <SiteButton type="button" size="sm" disabled={busy} onClick={onConfirm}>
          {busy ? 'Working…' : confirmLabel}
        </SiteButton>
      </div>
    </Modal>
  );
}
