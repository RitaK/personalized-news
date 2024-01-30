export interface NewsResponse {
    status: 'success' | 'error',
    totalResults: number,
    results: Array<articleDate>,
    nextPage: string
}

export type articleDate = {
    article_id: string,
    title: string,
    link: string,
    keywords: Array<string>,
    creator: string,
    video_url: string,
    description: string,
    content: string,
    pubDate: string,
    image_url: string,
    source_id: string,
    source_priority: number,
    country: Array<string>,
    category: Array<string>,
    language: string
}