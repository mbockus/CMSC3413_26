export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: PokemonSprites;
    types: PokemonType[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
}

export interface PokemonSprites {
    front_default: string;
    front_shiny: string;
    front_female: string | null;
    front_shiny_female: string | null;
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
