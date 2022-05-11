import { Component } from '@angular/core';

import { NgStrContentService } from '../../core';

@Component({
  selector: 'ngstr-docs-shell',
  templateUrl: './docs-shell.component.html'
})
export class NgStrDocsShellComponent {
  showMenu = false;

  constructor(public content: NgStrContentService) {}
}
