using Microsoft.EntityFrameworkCore;

namespace Project3.Server.Models
{
    public class PokemonDbContext : DbContext
    {

        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {
        }

        public DbSet<Pokemon> Pokemons { get; set; }
        public DbSet<PokemonType> PokemonTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Pokemon>().HasData(
                new Pokemon { Id = 1, Name = "Bulbasaur", Level = 5, HP = 45 },
                new Pokemon { Id = 2, Name = "Charmander", Level = 5, HP = 39 },
                new Pokemon { Id = 3, Name = "Squirtle", Level = 5, HP = 44 }
            );

            modelBuilder.Entity<PokemonType>().HasData(
                new PokemonType { Id = 1, Name = "Grass", PokemonId = 1 },
                new PokemonType { Id = 2, Name = "Poison", PokemonId = 1 },
                new PokemonType { Id = 3, Name = "Fire", PokemonId = 2 },
                new PokemonType { Id = 4, Name = "Water", PokemonId = 3 }
            );
        }
    }
}
