export interface NgstMenuItem {
  type: 'page' | 'group';
  name: string;
  icon?: string;
  path?: string;
  group: string;
}
