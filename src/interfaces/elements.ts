import { ElementType, ElementOptions, Element } from './element';

export interface Elements {
  create(type: ElementType, options: ElementOptions): Element;
}

export interface ElementsOptions {
  fonts?: FontElement[];
  locale?: string;
}

export interface FontElement {
  family?: string;
  src?: string;
  style?: 'normal' | 'italic' | 'oblique';
  unicodeRange?: string;
  weight?: 'normal' | 'bold' | 'lighter' | 'bolder' | 'inherit' | 'initial' | 'unset' | number;
}
