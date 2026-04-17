using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Project3.Server.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Pokemon> Pokemons { get; set; }
        public DbSet<PokemonType> PokemonTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Pokemon>().
                HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure DateTime to always be treated as UTC
            var dateTimeConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                }
            }

            var testUserId = "mbockus";
            var hasher = new PasswordHasher<ApplicationUser>();

            var testUser = new ApplicationUser
            {
                Id = testUserId,
                UserName = "mbockus",
                NormalizedUserName = "MBOCKUS",
                Email = "mbockus@uco.edu",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            testUser.PasswordHash = hasher.HashPassword(testUser, "P@ssw0rd");

            modelBuilder.Entity<ApplicationUser>().HasData(testUser);


            modelBuilder.Entity<Pokemon>().HasData(
                new Pokemon { Id = 1, Name = "Bulbasaur", Level = 5, HP = 45, CaughtAt = new DateTime(2024, 1, 15, 10, 30, 0, DateTimeKind.Utc), UserId = testUserId },
                new Pokemon { Id = 2, Name = "Charmander", Level = 5, HP = 39, CaughtAt = new DateTime(2024, 2, 20, 14, 45, 30, DateTimeKind.Utc), UserId = testUserId },
                new Pokemon { Id = 3, Name = "Squirtle", Level = 5, HP = 44, CaughtAt = new DateTime(2024, 3, 10, 8, 15, 45, DateTimeKind.Utc), UserId = testUserId }
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
