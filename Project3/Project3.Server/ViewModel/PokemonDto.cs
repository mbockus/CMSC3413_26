using Project3.Server.Models;

namespace Project3.Server.ViewModel
{
    public class PokemonDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<PokemonType> Types { get; set; } = new List<PokemonType>();
        public int Level { get; set; }
        public int HP { get; set; }
        public DateTime CaughtAt { get; set; }
    }
}
