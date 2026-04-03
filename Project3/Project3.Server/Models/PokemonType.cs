using System.Text.Json.Serialization;

namespace Project3.Server.Models
{
    public class PokemonType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PokemonId { get; set; }

    }
}
