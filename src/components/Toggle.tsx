'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ToggleProps {
  children: ReactNode;
  trigger: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
  openText?: string;
  closeText?: string;
}

export default function Toggle({
  children,
  trigger,
  defaultOpen = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  showIcon = true,
  openText = "詳細を隠す",
  closeText = "詳細を見る"
}: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${triggerClassName}`}
      >
        {trigger}
        {showIcon && (
          isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />
        )}
      </button>

      {isOpen && (
        <div className={contentClassName}>
          {children}
        </div>
      )}
    </div>
  );
}

// テキストベースの簡単なトグル
export function SimpleToggle({
  children,
  label,
  defaultOpen = false,
  className = "",
  openText = "詳細を隠す",
  closeText = "詳細を見る"
}: {
  children: ReactNode;
  label?: string;
  defaultOpen?: boolean;
  className?: string;
  openText?: string;
  closeText?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
      >
        {label || (isOpen ? openText : closeText)}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}