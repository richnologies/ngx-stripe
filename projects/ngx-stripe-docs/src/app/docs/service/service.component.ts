import { Component } from '@angular/core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-service',
  templateUrl: './service.component.html',
  standalone: true,
  imports: [DocsElementsModule]
})
export class NgStrServiceComponent {}
