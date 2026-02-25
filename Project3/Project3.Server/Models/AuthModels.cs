namespace Project3.Server.Models
{
    public class TokenRequest
    {
        public string code { get; set; } = string.Empty;
        public string client_id { get; set; } = string.Empty;
        public string client_secret { get; set; } = string.Empty;
    }

    public class TokenResponse
    {
        public string access_token { get; set; } = string.Empty;
        public string token_type { get; set; } = string.Empty;
        public string scope { get; set; } = string.Empty;
    }

    public class GitHubUser
    {
        public string login { get; set; } = string.Empty;
        public int id { get; set; }
        public string avatar_url { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
    }
}

