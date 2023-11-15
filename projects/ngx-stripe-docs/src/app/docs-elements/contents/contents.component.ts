import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-contents',
  templateUrl: './contents.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class NgStrContentsComponent {
  @Input() contents: Array<{ name: string; href: string; id: string }> = [];
  @Input() active: string = 'create-subscription';
}
