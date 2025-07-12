import { ArrowRight, ArrowLeft, Download, ExternalLink, Plus } from 'lucide-react';
import { ReactNode } from 'react';

// シンプルなアイコンマップ
const iconMap = {
  right: ArrowRight,
  left: ArrowLeft,
  download: Download,
  external: ExternalLink,
  plus: Plus,
} as const;

type IconName = keyof typeof iconMap;
type Language = 'en' | 'ja';

interface SimpleButtonProps {
  children: ReactNode;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'minimal';
  lang?: Language;  // 新規追加
}

export function SimpleButton({ 
  children, 
  icon, 
  iconPosition = 'right',
  href,
  onClick,
  className = "",
  variant = 'default',
  lang = 'en'  // デフォルトは英語
}: SimpleButtonProps) {
  
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    padding: '2px 2px',
    fontSize: '16px',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
  };

  const variants = {
    default: {
      backgroundColor: 'transparent',
      color: 'black',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#333333',
      border: '2px solid #333333',
    },
    minimal: {
      backgroundColor: 'transparent',
      color: '#333333',
      padding: '8px 0',
    }
  };

  const combinedStyle = {
    ...baseStyles,
    ...variants[variant],
  };

  // 言語に応じたクラス名を生成
  const langClasses = lang === 'en' ? 'font-en' : 'text-ja-tight';
  const combinedClassName = `${langClasses} ${className}`.trim();

  // アイコンコンポーネントを安全に取得
  const IconComponent = icon ? iconMap[icon] : null;

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && <IconComponent size={20} strokeWidth={2.5}  />}
      {children}
      {IconComponent && iconPosition === 'right' && <IconComponent size={20} strokeWidth={2.5}  />}
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        style={combinedStyle}
        className={combinedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      style={combinedStyle}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}