// Model to match the C# Pokemon model from the API
export interface Pokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  hp: number;
}

// DTO for creating a new Pokemon (id will be auto-assigned by server)
export interface CreatePokemonDto {
  name: string;
  type: string;
  level: number;
  hp: number;
}

// DTO for updating a Pokemon
export interface UpdatePokemonDto {
  name: string;
  type: string;
  level: number;
  hp: number;
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
