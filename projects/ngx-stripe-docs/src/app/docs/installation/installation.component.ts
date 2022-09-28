import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-installation',
  templateUrl: './installation.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgxStripeModule, DocsElementsModule]
})
export class NgStrInstallationComponent {}
