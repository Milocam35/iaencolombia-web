"use client";

import { useRef, useState } from "react";

export function PublicationCitation({ citation }: { citation: string }) {
  const reference = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setMessage("Referencia copiada.");
    } catch {
      reference.current?.focus();
      reference.current?.select();
      setMessage("Referencia seleccionada. Puedes copiarla con tu teclado.");
    }
  };

  return <div className="mt-8 border-t border-border pt-6">
    <label className="block text-sm font-bold text-primary">
      Referencia bibliográfica
      <textarea ref={reference} readOnly value={citation} rows={5} className="mt-3 block w-full resize-y rounded-lg border border-border bg-surface p-4 text-sm font-normal leading-6 text-foreground" />
    </label>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => void copy()} className="rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary">Copiar referencia</button>
      <span role="status" className="text-sm text-muted-foreground">{message}</span>
    </div>
  </div>;
}
