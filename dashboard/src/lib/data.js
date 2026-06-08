export const NAV_ITEMS = [
  { id: 'overview', icon: 'dashboard', labelKey: 'nav.overview' },
  { id: 'status', icon: 'analytics', labelKey: 'nav.status' },
  { id: 'outline', icon: 'format_list_bulleted', labelKey: 'nav.outline' },
  { id: 'drafts', icon: 'edit_note', labelKey: 'nav.drafts' },
  { id: 'edits', icon: 'history_edu', labelKey: 'nav.edits' },
  { id: 'publish', icon: 'publish', labelKey: 'nav.publish' },
  { id: 'settings', icon: 'settings', labelKey: 'nav.settings' },
  { id: 'help', icon: 'help', labelKey: 'nav.help' },
];

export const VALID_VIEWS = new Set(NAV_ITEMS.map((n) => n.id));

export const PIPELINE_COMMANDS = [
  { cmd: '/book-init', icon: 'rocket_launch', phase: 0 },
  { cmd: '/book-ideation', icon: 'lightbulb', phase: 1 },
  { cmd: '/book-outline', icon: 'format_list_bulleted', phase: 2 },
  { cmd: '/book-draft', icon: 'edit_note', phase: 3 },
  { cmd: '/book-edit', icon: 'history_edu', phase: 4 },
  { cmd: '/book-publish', icon: 'publish', phase: 5 },
  { cmd: '/book-status', icon: 'analytics', phase: -1 },
  { cmd: '/book-genre-creator', icon: 'category', phase: -1 },
];

export const QUICK_COMMANDS = PIPELINE_COMMANDS.filter((c) => c.phase >= 0 && c.phase <= 5);

// Must stay in sync with FICTION_ONLY / FICTION_GENRES in scan-project.js
export const FICTION_GENRES = new Set(['fiction', 'romance', 'thriller', 'mystery', 'fantasy', 'sci-fi', 'literary-fiction']);

export const AGENT_DEFS = [
  { id: 'book-architect', icon: 'architecture', genre: 'all' },
  { id: 'chapter-writer', icon: 'edit_note', genre: 'all' },
  { id: 'scene-generator', icon: 'theaters', genre: 'fiction' },
  { id: 'continuity-editor', icon: 'compare_arrows', genre: 'all' },
  { id: 'style-doctor', icon: 'medical_services', genre: 'all' },
  { id: 'cover-designer', icon: 'palette', genre: 'all' },
  { id: 'marketing-expert', icon: 'campaign', genre: 'all' },
];

export const EDIT_STAGES = [
  { id: 'assessment', label: 'Assessment', icon: 'search' },
  { id: 'developmental', label: 'Developmental', icon: 'account_tree' },
  { id: 'line-edit', label: 'Line Edit', icon: 'format_paint' },
  { id: 'copy-edit', label: 'Copy Edit', icon: 'spellcheck' },
  { id: 'proofread', label: 'Proofread', icon: 'verified' },
];

export const PUBLISH_FORMATS = {
  'book.epub': { icon: 'menu_book', descKey: 'publish.fmt.epub' },
  'book.pdf': { icon: 'picture_as_pdf', descKey: 'publish.fmt.pdf' },
  'book.mobi': { icon: 'devices', descKey: 'publish.fmt.mobi' },
  'book.txt': { icon: 'article', descKey: 'publish.fmt.txt' },
  'book.md': { icon: 'code', descKey: 'publish.fmt.md' },
};

export const GENRE_ICONS = {
  fiction: 'auto_stories',
  'non-fiction': 'psychology',
  technical: 'terminal',
  screenplay: 'movie',
  poetry: 'lyrics',
  game: 'sports_esports',
  academic: 'school',
};

export const GENRE_WORKFLOWS = [
  { id: 'fiction',     nameKey: 'genre.fiction.name',     structureKey: 'genre.fiction.structure',     highlightKeys: ['genre.fiction.h1','genre.fiction.h2','genre.fiction.h3'],     tipKey: 'genre.fiction.tip' },
  { id: 'non-fiction', nameKey: 'genre.nonfiction.name',  structureKey: 'genre.nonfiction.structure',  highlightKeys: ['genre.nonfiction.h1','genre.nonfiction.h2','genre.nonfiction.h3'], tipKey: 'genre.nonfiction.tip' },
  { id: 'technical',   nameKey: 'genre.technical.name',   structureKey: 'genre.technical.structure',   highlightKeys: ['genre.technical.h1','genre.technical.h2','genre.technical.h3'],   tipKey: 'genre.technical.tip' },
  { id: 'screenplay',  nameKey: 'genre.screenplay.name',  structureKey: 'genre.screenplay.structure',  highlightKeys: ['genre.screenplay.h1','genre.screenplay.h2','genre.screenplay.h3'],  tipKey: 'genre.screenplay.tip' },
  { id: 'poetry',      nameKey: 'genre.poetry.name',      structureKey: 'genre.poetry.structure',      highlightKeys: ['genre.poetry.h1','genre.poetry.h2','genre.poetry.h3'],      tipKey: 'genre.poetry.tip' },
  { id: 'game',        nameKey: 'genre.game.name',        structureKey: 'genre.game.structure',        highlightKeys: ['genre.game.h1','genre.game.h2','genre.game.h3'],        tipKey: 'genre.game.tip' },
  { id: 'academic',    nameKey: 'genre.academic.name',    structureKey: 'genre.academic.structure',    highlightKeys: ['genre.academic.h1','genre.academic.h2','genre.academic.h3'],    tipKey: 'genre.academic.tip' },
];

export const SAMPLE_DATA = {
  generated_at: '2026-05-16T12:00:00Z',
  agents: [
    { id: 'book-architect', name: 'Book Architect', icon: 'architecture', role: 'Structural design & outline planning', status: 'complete', last_run: '2026-05-16T10:00:00Z', task: null },
    { id: 'chapter-writer', name: 'Chapter Writer', icon: 'edit_note', role: 'Draft generation for chapters', status: 'running', last_run: '2026-05-16T11:30:00Z', task: 'ch07-core-concepts.md draft in progress' },
    { id: 'continuity-editor', name: 'Continuity Editor', icon: 'compare_arrows', role: 'Cross-chapter consistency checks', status: 'idle', last_run: '2026-05-15T22:00:00Z', task: null },
    { id: 'cover-designer', name: 'Cover Designer', icon: 'palette', role: 'Visual cover design & brand identity', status: 'idle', last_run: null, task: null },
    { id: 'marketing-expert', name: 'Marketing Expert', icon: 'campaign', role: 'Book description & marketing copy', status: 'idle', last_run: null, task: null },
    { id: 'scene-generator', name: 'Scene Generator', icon: 'theaters', role: 'Scene creation & expansion (fiction only)', status: 'complete', last_run: '2026-05-16T09:00:00Z', task: null },
    { id: 'style-doctor', name: 'Style Doctor', icon: 'medical_services', role: 'Style consistency & AI-slop detection', status: 'complete', last_run: '2026-05-16T08:30:00Z', task: null },
  ],
  projects: [
    {
      name: 'My First Great Work',
      path: '/Users/user/projects/my-book',
      genre: 'non-fiction',
      language: 'en',
      current_phase: 3,
      total_chapters: 10,
      completed_chapters: 6,
      total_words: 42000,
      target_words: 80000,
      last_updated: '2026-05-16T11:30:00Z',
      phase_status: [
        { phase: 0, name: 'Onboarding', percent: 100, status: 'complete' },
        { phase: 1, name: 'Ideation', percent: 100, status: 'complete' },
        { phase: 2, name: 'Outlining', percent: 100, status: 'complete' },
        { phase: 3, name: 'Drafting', percent: 60, status: 'in_progress' },
        { phase: 4, name: 'Editing', percent: 0, status: 'pending' },
        { phase: 5, name: 'Publishing', percent: 0, status: 'pending' },
      ],
      chapter_details: [
        { filename: 'ch01-introduction.md', title: 'Introduction', lines: 320, words: 2800, status: 'edit', edit_stage: 'style' },
        { filename: 'ch02-getting-started.md', title: 'Getting Started', lines: 480, words: 4200, status: 'edit', edit_stage: 'continuity' },
        { filename: 'ch03-core-concepts.md', title: 'Core Concepts', lines: 390, words: 3600, status: 'draft', edit_stage: null },
        { filename: 'ch04-advanced.md', title: 'Advanced Techniques', lines: 510, words: 4800, status: 'draft', edit_stage: null },
        { filename: 'ch05-case-studies.md', title: 'Case Studies', lines: 440, words: 4100, status: 'draft', edit_stage: null },
        { filename: 'ch06-patterns.md', title: 'Common Patterns', lines: 360, words: 3200, status: 'draft', edit_stage: null },
        { filename: 'ch07-deep-dive.md', title: 'Deep Dive', lines: 0, words: 0, status: 'wait', edit_stage: null },
        { filename: 'ch08-integration.md', title: 'Integration', lines: 0, words: 0, status: 'wait', edit_stage: null },
        { filename: 'ch09-deployment.md', title: 'Deployment', lines: 0, words: 0, status: 'wait', edit_stage: null },
        { filename: 'ch10-conclusion.md', title: 'Conclusion', lines: 0, words: 0, status: 'wait', edit_stage: null },
      ],
      output_files: [
        { name: 'book.epub', exists: false, size_bytes: 0 },
        { name: 'book.pdf', exists: false, size_bytes: 0 },
        { name: 'book.mobi', exists: false, size_bytes: 0 },
        { name: 'book.txt', exists: false, size_bytes: 0 },
        { name: 'book.md', exists: false, size_bytes: 0 },
      ],
    },
  ],
};
