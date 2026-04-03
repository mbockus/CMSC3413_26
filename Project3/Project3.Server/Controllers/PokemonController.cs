using Microsoft.AspNetCore.Mvc;
using Project3.Server.Models;
using Project3.Server.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Project3.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;

        public PokemonController(IPokemonService pokemonService)
        {
            this._pokemonService = pokemonService;
        }
        // GET: api/<PokemonController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pokemon>>> Get()
        {
            var pokemon = await this._pokemonService.GetAllPokemonAsync();
            return Ok(pokemon);
        }

        // GET api/<PokemonController>/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Pokemon>> Get(int id)
        {
            var pokemon = await this._pokemonService.GetPokemonByIdAsync(id);
            if (pokemon == null)
            {
                return NotFound();
            }
            return Ok(pokemon);
        }

        // POST api/<PokemonController>
        [HttpPost]
        public async Task<ActionResult<Pokemon>> Post([FromBody] Pokemon pokemon)
        {
            var createdPokemon = await this._pokemonService.CreatePokemonAsync(pokemon);
            return Ok(createdPokemon);
        }

        // PUT api/<PokemonController>/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] Pokemon pokemon)
        {
            pokemon.Id = id;
            var updatedPokemon = await this._pokemonService.UpdatePokemonAsync(pokemon);
            if(updatedPokemon == null)
            {
                return NotFound();
            }
            return Ok(updatedPokemon);
        }

        // DELETE api/<PokemonController>/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await this._pokemonService.DeletePokemonAsync(id);
            if(!result)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}


