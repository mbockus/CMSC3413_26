import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, CreatePokemonDto, UpdatePokemonDto } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = '/api/pokemon';

  constructor(private http: HttpClient) { }

  // GET all Pokemon
  getAllPokemon(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl);
  }

  // GET Pokemon by ID
  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${id}`);
  }

  // POST create new Pokemon
  createPokemon(pokemon: CreatePokemonDto): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon);
  }

  // PUT update existing Pokemon
  updatePokemon(id: number, pokemon: UpdatePokemonDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pokemon);
  }

  // DELETE Pokemon
  deletePokemon(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
