using Microsoft.EntityFrameworkCore;
using Project3.Server.Models;

namespace Project3.Server.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly ApplicationDbContext _context;

        public PokemonService(ApplicationDbContext context) {
            this._context = context;
        }

        public async Task<Pokemon> CreatePokemonAsync(Pokemon pokemon, string userId)
        {
            // Set CaughtAt to current UTC time if not provided
            if (pokemon.CaughtAt == default(DateTime))
            {
                pokemon.CaughtAt = DateTime.UtcNow;
            }

            pokemon.UserId = userId;
            this._context.Pokemons.Add(pokemon);
            await this._context.SaveChangesAsync();
            return pokemon;
        }

        public async Task<bool> DeletePokemonAsync(int id, string userId)
        {
            var existingPokemon = await this._context.Pokemons.FirstOrDefaultAsync(p=> p.Id == id && p.UserId == userId);
            if (existingPokemon == null)
            {
                return false;
            }

            this._context.Pokemons.Remove(existingPokemon);
            await this._context.SaveChangesAsync();
            return true;

        }

        public async Task<IEnumerable<Pokemon>> GetAllPokemonAsync(string userId)
        {
            return await this._context.Pokemons
                .Where(p => p.UserId == userId)
                .Include(p => p.Types)
                .ToListAsync();
        }

        public async Task<Pokemon?> GetPokemonByIdAsync(int id, string userId)
        {
            return await this._context.Pokemons
                .Include(p => p.Types)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        }

        public async Task<IEnumerable<Pokemon>> GetPokemonByTypesAsync(List<string> types, string userId)
        {
            return await this._context.Pokemons
                .Where(p => p.UserId == userId)
                .Include(p => p.Types)
                .Where(p => types.All(typeName => p.Types.Any(t=> t.Name == typeName)))
                .ToListAsync();
        }

        public async Task<Pokemon> UpdatePokemonAsync(Pokemon pokemon, string userId)
        {
            var existingPokemon = await this._context.Pokemons
                .Include(p => p.Types)
                .FirstOrDefaultAsync(p => p.Id == pokemon.Id && p.UserId == userId);

            if (existingPokemon == null)
            {
                return null;
            }

            existingPokemon.Name = pokemon.Name;
            existingPokemon.Level = pokemon.Level;
            existingPokemon.HP = pokemon.HP;
            existingPokemon.CaughtAt = pokemon.CaughtAt;

            // Remove existing types
            this._context.PokemonTypes.RemoveRange(existingPokemon.Types);

            // Add new types
            existingPokemon.Types = pokemon.Types;

            await this._context.SaveChangesAsync();
            return existingPokemon;
        }
    }
}
