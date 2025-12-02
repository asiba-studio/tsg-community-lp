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
  external?: boolean; 
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'minimal';
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number; // 新規追加：アイコンの太さ
}

export function SimpleButton({ 
  children, 
  icon, 
  iconPosition = 'right',
  href,
  external = false, 
  onClick,
  className = "",
  variant = 'default',
  lang = 'en',
  size = 'md',
  strokeWidth = 2.5 // デフォルト値
}: SimpleButtonProps) {
  
  // Tailwindクラスベースの設計（パディング削除）
  const baseClasses = [
    'inline-flex items-center gap-1 font-semibold no-underline transition-all duration-200 cursor-pointer border-0 py-1'
  ];

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-2', 
    lg: 'text-lg gap-2'
  };

  const responsiveSizeClasses = {
    sm: 'text-xs md:text-sm lg:text-base',
    md: 'text-sm md:text-base lg:text-lg',
    lg: 'text-base md:text-lg lg:text-xl'
  };

  const variantClasses = {
    default: 'bg-transparent text-bold hover:opacity-80',
    outline: 'bg-transparent text-text-primary border-2 border-text-primary hover:bg-text-primary hover:text-white',
    minimal: 'bg-transparent text-text-primary hover:opacity-80'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5',
    md: 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6', 
    lg: 'w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7'
  };

  const langClasses = lang === 'en' ? 'font-en' : 'font-sans text-ja-tight';
  
  const combinedClassName = [
    ...baseClasses,
    sizeClasses[size],
    responsiveSizeClasses[size],
    variantClasses[variant],
    langClasses,
    className
  ].join(' ');

  const IconComponent = icon ? iconMap[icon] : null;

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && (
        <IconComponent className={iconSizeClasses[size]} strokeWidth={strokeWidth} />
      )}
      {children}
      {IconComponent && iconPosition === 'right' && (
        <IconComponent className={iconSizeClasses[size]} strokeWidth={strokeWidth} />
      )}
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        target={external ? '_blank' : '_self'}
        rel={external ? 'noopener noreferrer' : undefined}
        className={combinedClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={combinedClassName}
    >
      {content}
    </button>
  );
}