import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemonByNameOrId(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
}