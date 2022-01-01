import { Component } from '@angular/core';

import { NgstContentService } from '../../core';

@Component({
  selector: 'ngstr-docs-shell',
  templateUrl: './docs-shell.component.html'
})
export class NgStrDocsShellComponent {
  showMenu = false;

  constructor(public content: NgstContentService) {}
}
