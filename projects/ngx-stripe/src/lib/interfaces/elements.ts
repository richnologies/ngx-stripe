import { Element, ElementOptions, ElementType } from './element';

export interface Elements {
  create(type: ElementType, options: ElementOptions): Element;
}

export interface ElementsOptions {
  fonts?: FontElement[];
  locale?:
    | 'auto'
    | 'da'
    | 'de'
    | 'en'
    | 'es'
    | 'fi'
    | 'fr'
    | 'it'
    | 'ja'
    | 'no'
    | 'nl'
    | 'sv'
    | 'zh';
}

export type FontElement = FontCSSElement | FontConfigElement;

export interface FontCSSElement {
  cssSrc: string;
}

export interface FontConfigElement {
  family?: string;
  src?: string;
  style?: 'normal' | 'italic' | 'oblique';
  unicodeRange?: string;
  weight?:
    | 'normal'
    | 'bold'
    | 'lighter'
    | 'bolder'
    | 'inherit'
    | 'initial'
    | 'unset'
    | number;
}
