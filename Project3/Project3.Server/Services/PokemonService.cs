using Microsoft.EntityFrameworkCore;
using Project3.Server.Models;

namespace Project3.Server.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly PokemonDbContext _context;
        
        public PokemonService(PokemonDbContext context) {
            this._context = context;
        }

        public async Task<Pokemon> CreatePokemonAsync(Pokemon pokemon)
        {
            this._context.Pokemons.Add(pokemon);
            await this._context.SaveChangesAsync();
            return pokemon;
        }

        public async Task<bool> DeletePokemonAsync(int id)
        {
            var existingPokemon = await this._context.Pokemons.FindAsync(id);
            if (existingPokemon == null)
            {
                return false;
            }

            this._context.Pokemons.Remove(existingPokemon);
            await this._context.SaveChangesAsync();
            return true;

        }

        public async Task<IEnumerable<Pokemon>> GetAllPokemonAsync()
        {
            return await this._context.Pokemons
                .Include(p => p.Types)
                .ToListAsync();
        }

        public async Task<Pokemon?> GetPokemonByIdAsync(int id)
        {
            return await this._context.Pokemons
                .Include(p => p.Types)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Pokemon> UpdatePokemonAsync(Pokemon pokemon)
        {
            var existingPokemon = await this._context.Pokemons
                .Include(p => p.Types)
                .FirstOrDefaultAsync(p => p.Id == pokemon.Id);

            if (existingPokemon == null)
            {
                return null;
            }

            existingPokemon.Name = pokemon.Name;
            existingPokemon.Level = pokemon.Level;
            existingPokemon.HP = pokemon.HP;

            // Remove existing types
            this._context.PokemonTypes.RemoveRange(existingPokemon.Types);

            // Add new types
            existingPokemon.Types = pokemon.Types;

            await this._context.SaveChangesAsync();
            return existingPokemon;
        }
    }
}
