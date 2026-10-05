export * from './global';
export * from './editorial';
export * from './copy';
export * from './seo';

export type WritingStyleKey = 'global' | 'editorial' | 'copy' | 'seo';

export interface WritingStylesConfig {
  global: string;
  editorial: string;
  copy: string;
  seo: string;
}
