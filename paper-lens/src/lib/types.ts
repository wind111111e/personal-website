export type PaperType = 'method' | 'survey' | 'empirical' | 'theory' | 'medical';
export type Domain = 'NLP' | 'CV' | 'Medicine' | 'HCI' | 'Systems' | 'Economics';
export type FormulaDensity = 'low' | 'medium' | 'high';
export type Tone = 'technical' | 'popular_science';
export type Confidence = 'low' | 'medium' | 'high';

export interface PaperProfile {
  type: PaperType;
  domain: Domain[];
  has_experiments: boolean;
  has_dataset: boolean;
  has_ablation: boolean;
  figure_count: number;
  table_count: number;
  formula_density: FormulaDensity;
  tone: Tone;
  confidence: Confidence;
}

export type ThemeStyle = 'minimal_white' | 'dark_tech' | 'editorial_magazine' | 'clinical_clean';
export type AccentColor = 'blue' | 'cyan' | 'purple' | 'green' | 'orange';
export type HeroVariant = 'standard' | 'split' | 'cover_image';
export type IllustrationPolicy = 'none' | 'subtle' | 'rich';

export interface ImagePrompt {
  enabled: boolean;
  prompt: string;
  negative_prompt: string;
  aspect_ratio: string;
  style_tags: string[];
}

export interface Theme {
  style: ThemeStyle;
  accent: AccentColor;
  hero_variant: HeroVariant;
  illustration_policy: IllustrationPolicy;
  image_prompt: ImagePrompt;
}

export interface CoreInfo {
  title: string;
  authors: string;
  year: string;
  venue: string;
  one_sentence_summary: string;
  tldr: string[];
  key_contributions: string[];
  keywords: string[];
}

export interface MethodSection {
  overview: string;
  steps: string[];
  components: string[];
}

export interface ExperimentsSection {
  setup: string;
  datasets: string[];
  metrics: string[];
  baselines: string[];
  results: string[];
}

export interface FigureExplanation {
  figure: string;
  explanation: string;
}

export interface GlossaryItem {
  term: string;
  meaning: string;
}

export interface Sections {
  problem: string;
  background: string;
  method: MethodSection;
  experiments: ExperimentsSection;
  limitations: string[];
  figures_explained: FigureExplanation[];
  glossary: GlossaryItem[];
}

export interface LayoutBlock {
  block: string;
  count?: number;
}

export interface PaperAnalysis {
  paper_profile: PaperProfile;
  theme: Theme;
  core: CoreInfo;
  sections: Sections;
  layout: LayoutBlock[];
}
