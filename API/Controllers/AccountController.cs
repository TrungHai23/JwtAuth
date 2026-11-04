using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController: ControllerBase
    {
        [HttpGet("hi")]
        public string Hi()
        {
            return "Hi from AccountController";
        }
    }
}