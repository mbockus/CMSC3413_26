import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.css'
})
export class PokedexComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  isLoading: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  loadPokemonList(): void {
    this.isLoading = true;
    this.pokemonService.getAllPokemon().subscribe({
      next: (pokemon) => {
        this.pokemonList = pokemon;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.isLoading = false;
      }
    });
  }

  viewPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/pokemon/create']);
  }
}

