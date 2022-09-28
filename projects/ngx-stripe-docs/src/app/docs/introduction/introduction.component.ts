import { Component } from '@angular/core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-introduction',
  templateUrl: './introduction.component.html',
  standalone: true,
  imports: [DocsElementsModule]
})
export class NgStrIntroductionComponent {}
