namespace Project3.Server.Models
{
    public class Pokemon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<PokemonType> Types { get; set; } = new List<PokemonType>();
        public int Level { get; set; }
        public int HP { get; set; }

    }
}
