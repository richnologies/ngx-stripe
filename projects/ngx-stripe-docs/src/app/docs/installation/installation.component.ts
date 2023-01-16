import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-installation',
  templateUrl: './installation.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, DocsElementsModule]
})
export class NgStrInstallationComponent {}
