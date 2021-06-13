import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieDuration'
})
export class MovieDurationPipe implements PipeTransform {

  transform(num: number): any {
    if (num === null || num === undefined || isNaN(num)) { return null; }

    const hours = Math.floor(num / 60);
    const minutes = num % 60;

    const durationPieces = [];

    if (hours > 0) {
      durationPieces.push(`${hours}h`);
    }

    if (minutes > 0) {
      durationPieces.push(`${minutes}m`);
    }

    return durationPieces.join(' ');
  }
}
