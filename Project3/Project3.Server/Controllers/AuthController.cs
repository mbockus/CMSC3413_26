using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project3.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Project3.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            // Validate password requirements
            var passwordErrors = ValidatePassword(request.Password);
            if (passwordErrors.Any())
            {
                return BadRequest(new ErrorResponse
                {
                    Message = "Password does not meet requirements",
                    Errors = passwordErrors
                });
            }

            // Check if username already exists
            var existingUser = await _userManager.FindByNameAsync(request.Username);
            if (existingUser != null)
            {
                return BadRequest(new ErrorResponse
                {
                    Message = "Username is already taken",
                    Errors = new List<string> { "The username provided is not unique" }
                });
            }

            // Check if email already exists
            var existingEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingEmail != null)
            {
                return BadRequest(new ErrorResponse
                {
                    Message = "Email is already registered",
                    Errors = new List<string> { "This email is already in use" }
                });
            }

            // Create new user
            var user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                RegisteredAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ErrorResponse
                {
                    Message = "Failed to create user",
                    Errors = result.Errors.Select(e => e.Description).ToList()
                });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.UserName!,
                Email = user.Email!,
                Expiration = DateTime.UtcNow.AddHours(24)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
            {
                return Unauthorized(new ErrorResponse
                {
                    Message = "Invalid username or password"
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new ErrorResponse
                {
                    Message = "Invalid username or password"
                });
            }

            var token = GenerateJwtToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.UserName!,
                Email = user.Email!,
                Expiration = DateTime.UtcNow.AddHours(24)
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                Username = user.UserName,
                Email = user.Email,
                CreatedAt = user.RegisteredAt
            });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private List<string> ValidatePassword(string password)
        {
            var errors = new List<string>();

            if (password.Length < 8)
            {
                errors.Add("Password must be at least 8 characters long");
            }

            if (!Regex.IsMatch(password, @"[A-Z]"))
            {
                errors.Add("Password must contain at least one uppercase letter");
            }

            if (!Regex.IsMatch(password, @"[a-z]"))
            {
                errors.Add("Password must contain at least one lowercase letter");
            }

            if (!Regex.IsMatch(password, @"\d"))
            {
                errors.Add("Password must contain at least one number");
            }

            return errors;
        }
    }
}


