// app/sitemap.ts

import { MetadataRoute } from 'next';
import { getArticles, getNews } from 'lib/api';

const BASE_URL = 'https://tsg-community.asiba.or.jp';

const STATIC_PATHS = [
    '',
    '/about',
    '/articles',
    '/news',
    '/open-talks',
    '/projects-fair',
    '/archive/2nd',
    '/archive/3rd',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [articles, news] = await Promise.all([getArticles(), getNews()]);

    const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
        url: `${BASE_URL}${path}`,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${BASE_URL}/articles/${article.slug}`,
        lastModified: article.date,
    }));

    const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
        url: `${BASE_URL}/news/${item.slug}`,
        lastModified: item.date,
    }));

    return [...staticRoutes, ...articleRoutes, ...newsRoutes];
}
