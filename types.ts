
export enum ViewMode {
  CALENDAR = 'CALENDAR',
  TIMELINE = 'TIMELINE',
  CHAT = 'CHAT',
  MEDIA = 'MEDIA',
  SETTINGS = 'SETTINGS',
  LIVE = 'LIVE',
  PROFILE = 'PROFILE',
  GAMIFICATION = 'GAMIFICATION',
  DEV_TOOLS = 'DEV_TOOLS',
  CREATOR = 'CREATOR',
  COMMUNITY = 'COMMUNITY',
  AI_LAB = 'AI_LAB'
}

export enum CalendarSubView {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
  AGENDA = 'AGENDA'
}

export enum EventCategory {
  // Releases
  RELEASE = 'RELEASE',
  OTT_RELEASE = 'OTT_RELEASE',
  RE_RELEASE = 'RE_RELEASE',
  
  // Promotions
  AUDIO_LAUNCH = 'AUDIO_LAUNCH',
  PRE_RELEASE = 'PRE_RELEASE',
  SUCCESS_MEET = 'SUCCESS_MEET',
  TEASER = 'TEASER',
  TRAILER = 'TRAILER',
  TITLE_REVEAL = 'TITLE_REVEAL',
  FIRST_LOOK = 'FIRST_LOOK',
  
  // Production
  MOVIE_ANNOUNCEMENT = 'MOVIE_ANNOUNCEMENT',
  SHOOTING_UPDATE = 'SHOOTING_UPDATE',
  WRAP_UP = 'WRAP_UP',
  CENSOR = 'CENSOR',
  
  // Industry & Stars
  BIRTHDAY = 'BIRTHDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  DEATH_ANNIVERSARY = 'DEATH_ANNIVERSARY',
  RUMOR = 'RUMOR',
  AWARD = 'AWARD',
  MEETUP = 'MEETUP',
  FESTIVAL = 'FESTIVAL',
  BOX_OFFICE = 'BOX_OFFICE',
  OTHER = 'OTHER'
}

export type OTTProvider = 'NETFLIX' | 'PRIME' | 'AHA' | 'HOTSTAR' | 'ZEE5' | 'SONYLIV' | 'ETV_WIN';
export type ReminderType = '1_DAY' | '1_HOUR' | 'ON_START' | 'NONE';

export interface CastMember {
  name: string;
  role: string; // Actor, Director, Music
  imageUrl?: string;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  avatarColor?: string;
}

export interface TFIEvent {
  id: string;
  title: string;
  date: Date; // ISO string format preferred in transport, Date object in UI
  category: EventCategory;
  description?: string;
  link?: string; // YouTube, BookMyShow, etc.
  hero?: string; // e.g., "Mahesh Babu", "Prabhas"
  imageUrl?: string;
  isOfficial?: boolean;
  tags?: string[]; // e.g. ["Prabhas", "Action", "Classic"]
  timelineId?: string; // "user" or creator id like "official-tfi", "prabhas-core"
  rating?: number; // 1-5 stars for Fan Diary
  location?: string; // Venue details
  ottProvider?: OTTProvider; // For OTT Releases
  reminderType?: ReminderType;
  
  // Enhanced Fields
  cast?: CastMember[];
  runtime?: string;
  production?: string;
  media?: string[]; // URLs to thumbnails
  comments?: Comment[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AIPrediction {
  title: string;
  type: 'BOX_OFFICE' | 'REVIEW' | 'OTT';
  prediction: string;
  confidence: number; // 0-100
  reasoning: string;
}

export interface TrendFactor {
    name: string;
    val: number;
    color: string;
}

export interface BoxOfficeAnalysis {
    movieName: string;
    predictedReleaseDate: string;
    openingDayEstimate: string;
    lifetimeEstimate: string;
    confidence: number;
    trendFactors: TrendFactor[];
    reasoning: string;
    graphData?: number[]; // Array of values 0-100 for the graph
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  timestamp: Date;
  suggestedEvents?: TFIEvent[]; // If the AI suggests adding an event
  image?: string; // For user uploads
  trivia?: QuizQuestion; // Interactive Quiz
  prediction?: AIPrediction; // AI Prediction Card
}

export interface CreatorTimeline {
  id: string;
  name: string;
  handle: string; // @handle
  avatar?: string;
  description: string;
  tags: string[]; // ["Mahesh Babu", "Core"]
  events: TFIEvent[];
  followers: number;
  color?: string; // Brand color for the timeline
  isOfficial?: boolean; // To distinguish Official Channels (Mythri, Gemini TV) from Fan Pages
}

export interface UserPreferences {
  favoriteHeroes: string[];
  interests: string[]; // e.g., "Direction", "Music", "Box Office"
  hasCompletedOnboarding: boolean;
  language?: 'EN' | 'TE';
}

export interface MediaItem {
    id: string;
    title: string;
    type: 'TRAILER' | 'SONG' | 'INTERVIEW' | 'FAN_EDIT';
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    views: string;
    hero?: string;
}

// --- Gamification Types ---
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xp: number;
    isUnlocked: boolean;
    progress?: number;
    total?: number;
}

export interface Reward {
    id: string;
    title: string;
    cost: number; // XP or Coins
    type: 'VOUCHER' | 'BADGE' | 'FEATURE';
    icon: string;
}

// --- Community Types ---
export interface ForumThread {
    id: string;
    title: string;
    author: string;
    replies: number;
    views: number;
    lastActive: string;
    tags: string[];
    isTrending?: boolean;
}

// --- Developer Types ---
export interface ApiKey {
    key: string;
    name: string;
    created: Date;
    lastUsed?: Date;
    status: 'ACTIVE' | 'REVOKED';
}

// --- Project Management Types ---
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface ProjectTask {
    id: string;
    title: string;
    status: TaskStatus;
}

export interface RoadmapPhase {
    id: string;
    title: string;
    timeline: string; // e.g. "Weeks 1-4"
    progress: number; // 0-100
    tasks: ProjectTask[];
}

// --- Notification Types ---
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'ALERT' | 'REMINDER' | 'SOCIAL' | 'SYSTEM';
    timestamp: Date;
    isRead: boolean;
    actionLink?: string;
}