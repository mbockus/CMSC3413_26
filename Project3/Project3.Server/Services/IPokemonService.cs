using Project3.Server.Models;

namespace Project3.Server.Services
{
    public interface IPokemonService
    {
        Task<IEnumerable<Pokemon>> GetAllPokemonAsync(string userId);
        Task<Pokemon?> GetPokemonByIdAsync(int id, string userId);
        Task<Pokemon> CreatePokemonAsync(Pokemon pokemon, string userId);
        Task<Pokemon> UpdatePokemonAsync(Pokemon pokemon, string userId);
        Task<bool> DeletePokemonAsync(int id, string userId);
        Task<IEnumerable<Pokemon>> GetPokemonByTypesAsync(List<string> names, string userId);
    }
}
