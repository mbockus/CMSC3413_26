using Microsoft.AspNetCore.Mvc;
using Project3.Server.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Project3.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<LoginController> _logger;

        public LoginController(
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            ILogger<LoginController> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<TokenResponse>> PostForTokenAsync([FromBody] TokenRequest request)
        {
            request.client_id = _configuration["ClientId"] ?? string.Empty;
            request.client_secret = _configuration["ClientSecret"] ?? string.Empty;

            if (string.IsNullOrEmpty(request.client_id) || string.IsNullOrEmpty(request.client_secret))
            {
                _logger.LogError("GitHub ClientId or ClientSecret not configured");
                return StatusCode(500, "Server configuration error");
            }

            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
                
                var response = await httpClient.PostAsJsonAsync("https://github.com/login/oauth/access_token", request);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to exchange token: {response.StatusCode}");
                    return StatusCode(500, "Failed to exchange authorization code");
                }

                var tokenResponse = await JsonSerializer.DeserializeAsync<TokenResponse>(
                    await response.Content.ReadAsStreamAsync());
                
                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.access_token))
                {
                    _logger.LogError("No access token in response");
                    return StatusCode(500, "No access token received");
                }

                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exchanging token");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("user")]
        public async Task<ActionResult<GitHubUser>> GetUser()
        {
            var authHeader = Request.Headers.Authorization.FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized();
            }

            var token = authHeader.Substring("Bearer ".Length);

            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                httpClient.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("Project3", "1.0"));

                var response = await httpClient.GetAsync("https://api.github.com/user");
                
                if (!response.IsSuccessStatusCode)
                {
                    return Unauthorized();
                }

                var content = await response.Content.ReadAsStringAsync();
                var userData = JsonSerializer.Deserialize<GitHubUser>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (userData == null)
                {
                    return Unauthorized();
                }

                return Ok(userData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching GitHub user");
                return StatusCode(500, "Failed to fetch user information");
            }
        }
    }
}

