import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent implements OnInit {

  pokemon: Pokemon | null = null;
  @Input() pokemonName: string = 'pikachu';

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pokemonName = params['nameOrId'];
      this.pokemonService.getPokemonByNameOrId(this.pokemonName).subscribe(pokemon => {
        this.pokemon = pokemon;
      });
    });
  }
}
