export type AppType = 'saas' | 'e-commerce' | 'dashboard' | 'mobile' | 'api' | 'custom';

export type TechStack = {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'fullstack';
  description: string;
  keywords?: string[];
};

export type DesignTheme = {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    primary: string;
    accent: string;
  };
};

export type DatabasePreset = {
  id: string;
  name: string;
  dialect: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  tables: string[];
};

export interface ProjectConfig {
  projectName: string;
  appType: AppType;
  description: string;
  techStack: string[];
  features: string[];
  dbEngine: string;
  designVibe: string;
  rawPrompt?: string;
}

export interface GeneratedFile {
  filename: string;
  path: string;
  content: string;
  language: 'markdown' | 'sql' | 'json' | 'text';
}

export interface GeneratorResult {
  projectName: string;
  timestamp: string;
  files: GeneratedFile[];
}
