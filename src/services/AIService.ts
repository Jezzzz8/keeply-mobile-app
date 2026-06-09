// src/services/AIService.ts

// Predefined categories and tag mappings
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Technology': ['code', 'developer', 'github', 'api', 'software', 'tech', 'programming', 'javascript', 'react'],
  'Learning': ['learn', 'tutorial', 'guide', 'course', 'education', 'study', 'how to'],
  'Productivity': ['productivity', 'todo', 'task', 'organize', 'workflow', 'focus', 'habit'],
  'Work': ['work', 'career', 'business', 'meeting', 'team', 'project', 'deadline'],
  'Personal': ['personal', 'journal', 'diary', 'thought', 'reflection', 'life'],
  'Important': ['urgent', 'critical', 'important', 'priority', 'deadline'],
  'Read Later': ['read', 'article', 'blog', 'news', 'watch', 'listen']
};

const TAG_SUGGESTIONS: string[] = [
  'inspiration', 'design', 'ui', 'development', 'research', 'reference',
  'idea', 'draft', 'archive', 'favorite', 'archive', 'tutorial', 'example'
];

export class AIService {
  private static modelLoaded = false;

  static async init(): Promise<void> {
    this.modelLoaded = false;
  }

  static async analyzeContent(content: string, type: string): Promise<{
    tags: string[];
    category: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    const text = content.toLowerCase();
    
    // Determine category
    let category = 'Personal';
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        category = cat;
        break;
      }
    }

    // Determine priority
    let priority: 'low' | 'medium' | 'high' = 'medium';
    const priorityKeywords = {
      high: ['urgent', 'asap', 'critical', 'important', 'deadline', 'must'],
      medium: ['later', 'review', 'consider', 'maybe'],
      low: ['someday', 'optional', 'could', 'might']
    };
    
    if (priorityKeywords.high.some(kw => text.includes(kw))) priority = 'high';
    else if (priorityKeywords.low.some(kw => text.includes(kw))) priority = 'low';

    // Generate tags
    const tags: string[] = [];
    
    // Add type-based tag
    if (type === 'link') tags.push('link');
    if (type === 'idea') tags.push('idea');
    if (type === 'clipboard') tags.push('copied');
    
    // Add category-based tag
    tags.push(category.toLowerCase());
    
    // Add keyword-based tags
    for (const suggestion of TAG_SUGGESTIONS) {
      if (text.includes(suggestion) && !tags.includes(suggestion)) {
        tags.push(suggestion);
      }
    }
    
    // Add priority tag
    tags.push(priority);
    
    // Limit to 5 tags
    const uniqueTags = [...new Set(tags)].slice(0, 5);
    
    return { tags: uniqueTags, category, priority };
  }

  static async extractLinkMetadata(url: string): Promise<{
    title: string;
    description: string;
    domain: string;
  }> {
    const domain = new URL(url).hostname.replace('www.', '');
    return {
      title: 'Link saved from ' + domain,
      description: 'Click to view this saved link',
      domain
    };
  }

  static async suggestRelatedNotes(noteId: string, allNotes: any[]): Promise<any[]> {
    // Find similar notes based on tag overlap
    const currentNote = allNotes.find(n => n.id === noteId);
    if (!currentNote) return [];
    
    return allNotes
      .filter(n => n.id !== noteId)
      .map(note => ({
        ...note,
        similarity: note.tags.filter((tag: string) => currentNote.tags.includes(tag)).length
      }))
      .filter(n => n.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }
}