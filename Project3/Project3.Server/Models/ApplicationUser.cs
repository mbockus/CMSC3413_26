using Microsoft.AspNetCore.Identity;

namespace Project3.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }
}
