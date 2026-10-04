export interface NgStrElementExtraInput {
  name: string;
  type: string;
  description: string;
}

export interface NgStrElementEntry {
  id: string;
  name: string;
  export: string;
  selector: string;
  stripeType: string;
  docsPath: string;
  page: 'custom' | 'contract';
  showInNav: boolean;
  since: string;
  stripeDocs: string;
  optionsType: string;
  needsClientSecret: boolean;
  optionsInit?: string;
  summary: string;
  notes: string;
  examplePath?: string;
  outputs: string[];
  methods: string[];
  extraInputs?: NgStrElementExtraInput[];
  snippetHtml: string;
  snippetTs: string;
}
