import Image from "next/image";
import './KpiChatSignature.css';

export function KpiChatSignature() {
  return <div className="kpichat-signature" aria-label="By KpiChat.ai">
    <span>By</span>
    <a href="https://www.kpichat.ai" target="_blank" rel="noopener noreferrer" aria-label="KpiChat.ai (abre una pestaña nueva)">
      <Image src="/brand/kpichat-blue.png" alt="KpiChat.ai" width={1024} height={182} sizes="90px" className="kpichat-signature-logo" />
    </a>
  </div>;
}
