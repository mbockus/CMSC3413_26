export interface Pokemon {
    id: number;
    name: string;
    type: string;
    level: number;
    hp: number;
}

export interface CreatePokemonDto {
    name: string;
    type: string;
    level: number;
    hp: number;
}

export interface UpdatePokemonDto {
    name: string;
    type: string;
    level: number;
    hp: number;
}


