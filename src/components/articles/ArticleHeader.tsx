// src/components/ArticleHeader.tsx
import Image from 'next/image';
import { formatDate } from '@/lib/date';
import { Player } from '@/lib/types';

interface Props {
  title: string;
  date: string;
  writer?: Player;
  collaborators?: Player[];
  reviewer?: Player;
  coverImage: string;
  tags: string[];
  readingTime: number;
}

export default function ArticleHeader({
  title,
  date,
  writer,
  collaborators,
  reviewer,
  coverImage,
  tags,
  readingTime,
}: Props) {
  return (
    <header className="bg-white shadow-sm">
      {/* カバー画像 */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* タイトルオーバーレイ */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            
            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <time className="text-sm">
                {formatDate(date)}
              </time>
              <span className="text-sm">
                約 {readingTime} 分で読めます
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細メタ情報 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 著者情報 */}
          <div className="flex flex-wrap items-center gap-6">
            {writer && (
              <div className="flex items-center gap-3">
                <Image
                  src={writer.avatar}
                  alt={writer.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{writer.name}</p>
                  <p className="text-sm text-gray-600">{writer.roleJa}</p>
                </div>
              </div>
            )}

            {collaborators && collaborators.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">コラボレーター:</span>
                <div className="flex -space-x-2">
                  {collaborators.map((collaborator) => (
                    <Image
                      key={collaborator.id}
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                      title={collaborator.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}