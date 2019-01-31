import { Component, Input, OnInit } from '@angular/core';
import { ColorsService } from '../../core/colors/colores.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @Input()
  maxWidth = 500;
  @Input()
  padding = 20;
  @Input()
  offsetTop = 30;
  @Input()
  backgroundColor;

  styles;
  backgroundStyles;

  constructor(private colors: ColorsService) {}

  ngOnInit() {
    const styles = {
      'max-width.px': this.maxWidth,
      'padding-top.px': this.padding + this.offsetTop,
      'padding-left.px': this.padding,
      'padding-right.px': this.padding,
      'padding-bottom.px': this.padding
    };

    this.styles = styles;
    this.backgroundStyles = this.backgroundColor
      ? {
          background: this.adaptBackgroundColor(this.backgroundColor)
        }
      : {};
  }

  private adaptBackgroundColor(color: string) {
    const colors = color.split(',').map(c => this.colors.hexToRgba(c));

    return colors.length === 2
      ? `linear-gradient(to bottom, ${colors[0]} 30%, ${colors[1]} 30%, ${
          colors[1]
        })`
      : colors[0];
  }
}
