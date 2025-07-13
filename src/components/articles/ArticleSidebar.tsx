// src/components/ArticleSidebar.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Player } from '@/lib/types';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface Props {
  toc: TocItem[];
  writer?: Player;
  tags: string[];
  relatedProjects?: string[];
}

export default function ArticleSidebar({ toc, writer, tags, relatedProjects }: Props) {
  return (
    <div className="space-y-6">
      {/* 目次 */}
      {toc.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">目次</h3>
          <nav className="space-y-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm hover:text-blue-600 transition-colors ${
                  item.level === 1 ? 'font-medium text-gray-900' :
                  item.level === 2 ? 'text-gray-700 pl-3' :
                  'text-gray-600 pl-6'
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* 著者プロフィール */}
      {writer && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">著者について</h3>
          <div className="flex items-start gap-4">
            <Image
              src={writer.avatar}
              alt={writer.name}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{writer.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{writer.roleJa}</p>
              <p className="text-sm text-gray-700 mb-3">{writer.bio}</p>
              
              {/* スキル */}
              <div className="flex flex-wrap gap-1 mb-3">
                {writer.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* SNSリンク */}
              <div className="flex gap-2">
                {writer.social.github && (
                  <a
                    href={`https://github.com/${writer.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    GitHub
                  </a>
                )}
                {writer.social.twitter && (
                  <a
                    href={`https://twitter.com/${writer.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* タグ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">タグ</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles/tags/${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* 関連プロジェクト */}
      {relatedProjects && relatedProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">関連プロジェクト</h3>
          <div className="space-y-2">
            {relatedProjects.map((project) => (
              <Link
                key={project}
                href={`/projects/${project}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-900">{project}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 記事アクション */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            記事をブックマーク
          </button>
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            フィードバックを送る
          </button>
        </div>
      </div>
    </div>
  );
}