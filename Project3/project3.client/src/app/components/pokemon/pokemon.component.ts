import { Component } from '@angular/core';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent {

  name: string = 'Pikachu';
  type: string = 'Electric'
  level: number = 5;
  health: number = 100;
  damageAmount: number = 10;

  hurtPokemon() {
    this.health -= this.damageAmount;
  }
}
