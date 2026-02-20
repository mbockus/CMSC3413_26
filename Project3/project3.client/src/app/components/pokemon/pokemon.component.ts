import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent implements OnInit {

  pokemon: Pokemon | null = null;
  pokemonName: string = 'pikachu';
  isLoading: boolean = true;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['name']) {
        this.pokemonName = params['name'];
        this.loadPokemon();
      }
    });
  }

  loadPokemon(): void {
    this.isLoading = true;
    this.pokemonService.getPokemon(this.pokemonName).subscribe(
      pokemon => {
        this.pokemon = pokemon;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading pokemon:', error);
        this.isLoading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
