// PokemonType model to match the C# PokemonType model
export interface PokemonTypeModel {
  id: number;
  name: string;
  pokemonId: number;
}

// Model to match the C# Pokemon model from the API
export interface Pokemon {
  id: number;
  name: string;
  types: PokemonTypeModel[];
  level: number;
  hp: number;
  caughtAt: string; // ISO 8601 date string from API
}

// DTO for creating a new Pokemon (id will be auto-assigned by server)
export interface CreatePokemonDto {
  name: string;
  types: PokemonTypeModel[];
  level: number;
  hp: number;
}

// DTO for updating a Pokemon
export interface UpdatePokemonDto {
  name: string;
  types: PokemonTypeModel[];
  level: number;
  hp: number;
  caughtAt?: string;
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    stat: {
        name: string;
        url: string;
    };
    base_stat: number;
    effort: number;
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}
