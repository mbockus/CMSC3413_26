import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
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

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  loadPokemonList(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList().subscribe(response => {
      this.pokemonList = response;
      this.isLoading = false;

    });
  }


}

