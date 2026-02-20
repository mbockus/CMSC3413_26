import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.css'
})
export class PokedexComponent implements OnInit {

  pokemonList: Pokemon[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalCount: number = 0;
  isLoading: boolean = false;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe(pokemonList => {
      this.totalCount = pokemonList.count;
      this.pokemonList = [];
      pokemonList.results.forEach(pokemon => {
        this.pokemonService.getPokemonByNameOrId(pokemon.name).subscribe(fullPokemon => {
          this.pokemonList.push(fullPokemon);
        });
      });
    });
  }
}

