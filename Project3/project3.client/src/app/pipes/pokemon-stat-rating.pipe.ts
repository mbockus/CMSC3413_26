import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonStatRating'
})
export class PokemonStatRatingPipe implements PipeTransform {

  transform(value: number): string {
    let stars = 1;
    if (value > 120) {
      stars = 5;
    } else if (value > 100) {
      stars = 4;
    } else if (value > 80) {
      stars = 3;
    } else if (value > 60) {
      stars = 2;
    }
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

}
