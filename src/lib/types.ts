
// src/lib/types.ts
export interface Player {
    id: string;
    name: string;
    nameEn: string;
    role: string;
    roleJa: string;
    bio: string;
    bioEn: string;
    avatar: string;
    social: {
        github?: string;
        twitter?: string;
        linkedin?: string;
    };
    skills: string[];
    joinDate: string;
    active: boolean;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    location?: string;
    participants?: string[];
    tags?: string[];
}

export interface Article {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    writer: string;
    collaborators?: string[];
    reviewer?: string;
    relatedProjects?: string[];
    excerpt: string;
    coverImage: string;
    tags: string[];
    featured: boolean;
    lang: string;
    content: string;
}

export interface ArticleWithReferences extends Article {
    writerData?: Player;
    collaboratorsData?: Player[];
    reviewerData?: Player;
}

export interface CMSData {
    articles: Article[];
    players: Player[];
    events: Event[];
}