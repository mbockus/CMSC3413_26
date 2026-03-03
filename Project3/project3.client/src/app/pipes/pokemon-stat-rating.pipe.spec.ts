import { PokemonStatRatingPipe } from './pokemon-stat-rating.pipe';

describe('PokemonStatRatingPipe', () => {
  it('create an instance', () => {
    const pipe = new PokemonStatRatingPipe();
    expect(pipe).toBeTruthy();
  });
});
