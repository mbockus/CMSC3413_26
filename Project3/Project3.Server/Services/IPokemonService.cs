using Project3.Server.Models;

namespace Project3.Server.Services
{
    public interface IPokemonService
    {
        Task<IEnumerable<Pokemon>> GetAllPokemonAsync();
        Task<Pokemon?> GetPokemonByIdAsync(int id);
        Task<Pokemon> CreatePokemonAsync(Pokemon pokemon);
        Task<Pokemon> UpdatePokemonAsync(Pokemon pokemon);
        Task<bool> DeletePokemonAsync(int id);
    }
}
