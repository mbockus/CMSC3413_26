import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Pokemon, PokemonListItem } from '../../models/pokemon.model';
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
    this.isLoading = true;
    const offset = (this.currentPage - 1) * this.pageSize;
    this.pokemonService.getPokemonList(offset, this.pageSize).subscribe(response => {
      this.totalCount = response.count;
      this.pokemonList = [];
      
      // Load full pokemon data for all items in parallel
      const pokemonRequests = response.results.map(item => 
        this.pokemonService.getPokemon(item.name)
      );
      
      if (pokemonRequests.length > 0) {
        forkJoin(pokemonRequests).subscribe(pokemonData => {
          this.pokemonList = pokemonData;
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPokemonList();
    window.scrollTo(0, 0);
  }
}

