import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  isValidHexColor(color: string) {
    return /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color);
  }

  preppendColorPound(color: string) {
    if (this.isValidHexColor(color)) {
      return color[0] !== '#' ? `#${color}` : color;
    } else {
      return null;
    }
  }

  hexToRgba(hex: string, a?: number | string) {
    const hashlessHex = this.removeHash(hex);
    const hexObject = this.parseHex(hashlessHex);
    const decimalObject = this.hexesToDecimals(hexObject);

    return this.formatRgb(decimalObject, a);
  }

  private removeHash(hex: string): string {
    return hex.charAt(0) === '#' ? hex.slice(1) : hex;
  }

  private parseHex(nakedHex: string) {
    const isShort = 3 === nakedHex.length || 4 === nakedHex.length;

    const twoDigitHexR = isShort
      ? `${nakedHex.slice(0, 1)}${nakedHex.slice(0, 1)}`
      : nakedHex.slice(0, 2);
    const twoDigitHexG = isShort
      ? `${nakedHex.slice(1, 2)}${nakedHex.slice(1, 2)}`
      : nakedHex.slice(2, 4);
    const twoDigitHexB = isShort
      ? `${nakedHex.slice(2, 3)}${nakedHex.slice(2, 3)}`
      : nakedHex.slice(4, 6);
    const twoDigitHexA =
      (isShort
        ? `${nakedHex.slice(3, 4)}${nakedHex.slice(3, 4)}`
        : nakedHex.slice(6, 8)) || 'ff';

    return {
      r: twoDigitHexR,
      g: twoDigitHexG,
      b: twoDigitHexB,
      a: twoDigitHexA
    };
  }

  private hexesToDecimals({ r, g, b, a }) {
    return {
      r: this.hexToDecimal(r),
      g: this.hexToDecimal(g),
      b: this.hexToDecimal(b),
      a: +(this.hexToDecimal(a) / 255).toFixed(2)
    };
  }

  private hexToDecimal(hex: string): number {
    return parseInt(hex, 16);
  }

  private formatRgb(decimalObject, parameterA) {
    const { r, g, b, a: parsedA } = decimalObject;
    const a = this.isNumeric(parameterA) ? parameterA : parsedA;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  private isNumeric(n: number): boolean {
    return !isNaN(parseFloat(String(n))) && isFinite(n);
  }
}
