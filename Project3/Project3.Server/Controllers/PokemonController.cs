using Microsoft.AspNetCore.Mvc;
using Project3.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Project3.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private static readonly List<Pokemon> _pokemon = new() 
        {
            new Pokemon { Id = 1, Name = "Bulbasaur", Type = "Grass/Poison", Level = 5, HP = 45 },
            new Pokemon { Id = 2, Name = "Charmander", Type = "Fire", Level = 5, HP = 39 },
            new Pokemon { Id = 3, Name = "Squirtle", Type = "Water", Level = 5, HP = 44 }
        };
        private static int _nextId = 4;

        // GET: api/<PokemonController>
        [HttpGet]
        public ActionResult<IEnumerable<Pokemon>> Get()
        {
            return Ok(_pokemon);
        }

        // GET api/<PokemonController>/5
        [HttpGet("{id:int}")]
        public ActionResult<Pokemon> Get(int id)
        {
            var pokemon = _pokemon.FirstOrDefault(p => p.Id == id);
            if (pokemon == null)
            {
                return NotFound();
            }
            return Ok(pokemon);
        }

        // POST api/<PokemonController>
        [HttpPost]
        public ActionResult<Pokemon> Post([FromBody] Pokemon pokemon)
        {
            pokemon.Id = _nextId++;
            _pokemon.Add(pokemon);
            return Ok(pokemon);
        }

        // PUT api/<PokemonController>/5
        [HttpPut("{id:int}")]
        public IActionResult Put(int id, [FromBody] Pokemon pokemon)
        {
            var existingPokemon = _pokemon.FirstOrDefault(p => p.Id == id);
            if(existingPokemon == null)
            {
                return NotFound();
            }

            existingPokemon.Name = pokemon.Name;
            existingPokemon.Type = pokemon.Type;
            existingPokemon.Level = pokemon.Level;

            return Ok(existingPokemon);
        }

        // DELETE api/<PokemonController>/5
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var pokemon = _pokemon.FirstOrDefault(p => p.Id == id);
            if(pokemon == null)
            {
                return NotFound();
            }

            _pokemon.Remove(pokemon);
            return Ok();
        }
    }
}
