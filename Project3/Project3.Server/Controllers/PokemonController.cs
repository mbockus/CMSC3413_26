using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project3.Server.Models;
using Project3.Server.Services;
using Project3.Server.ViewModel;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Project3.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;

        public PokemonController(IPokemonService pokemonService)
        {
            this._pokemonService = pokemonService;
        }

        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // GET: api/<PokemonController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pokemon>>> Get()
        {
            var userId = GetUserId();
            var pokemon = await this._pokemonService.GetAllPokemonAsync(userId);
            return Ok(pokemon);
        }

        // GET api/<PokemonController>/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Pokemon>> Get(int id)
        {
            var userId = GetUserId();
            var pokemon = await this._pokemonService.GetPokemonByIdAsync(id, userId);
            if (pokemon == null)
            {
                return NotFound();
            }
            return Ok(pokemon);
        }

        // POST api/<PokemonController>
        [HttpPost]
        public async Task<ActionResult<Pokemon>> Post([FromBody] PokemonDto pokemon)
        {
            var userId = GetUserId();
            var pokemonEntity = new Pokemon
            {
                Name = pokemon.Name,
                Types = pokemon.Types,
                Level = pokemon.Level,
                HP = pokemon.HP,
                CaughtAt = pokemon.CaughtAt
            };
            var createdPokemon = await this._pokemonService.CreatePokemonAsync(pokemonEntity, userId);
            return Ok(createdPokemon);
        }

        // PUT api/<PokemonController>/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] PokemonDto pokemon)
        {
            var userId = GetUserId();
            pokemon.Id = id;
            var pokemonEntity = new Pokemon
            {
                Id = pokemon.Id,
                Name = pokemon.Name,
                Types = pokemon.Types,
                Level = pokemon.Level,
                HP = pokemon.HP,
                CaughtAt = pokemon.CaughtAt
            };
            var updatedPokemon = await this._pokemonService.UpdatePokemonAsync(pokemonEntity, userId);
            if (updatedPokemon == null)
            {
                return NotFound();
            }
            return Ok(updatedPokemon);
        }

        // DELETE api/<PokemonController>/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var result = await this._pokemonService.DeletePokemonAsync(id, userId);
            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("withAllTypes")]
        public async Task<ActionResult<IEnumerable<Pokemon>>> GetByTypes([FromQuery] List<string> types)
        {
            var userId = GetUserId();
            var pokemon = await this._pokemonService.GetPokemonByTypesAsync(types, userId);
            return Ok(pokemon);
        }
    }
}


