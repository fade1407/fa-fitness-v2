"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal__header"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="إغلاق"><X size={20} /></button></div>{children}</section></div>;
}
