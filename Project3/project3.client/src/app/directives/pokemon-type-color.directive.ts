import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPokemonTypeColor]'
})
export class PokemonTypeColorDirective implements OnInit {

  @Input('appPokemonTypeColor') type: string = '';

  private typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    const type = this.type.toLowerCase();
    const color = this.typeColors[type] || '#777777'; // Default gray if type not found

    // Apply background color
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);

    // Apply white text for better contrast
    this.renderer.setStyle(this.el.nativeElement, 'color', '#ffffff');
  }

}
