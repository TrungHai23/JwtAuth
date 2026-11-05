using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AccountController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
      _userManager = userManager;
      _roleManager = roleManager;
      _configuration = configuration;
    }

    //api/account/register
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<string>> Register(Dtos.RegisterDto registerDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var user = new AppUser
      {
        UserName = registerDto.Email,
        Email = registerDto.Email,
        FullName = registerDto.FullName
      };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded)
      {
        return BadRequest(result.Errors);
      }

      if (registerDto.Roles is null)
      {
        await _userManager.AddToRoleAsync(user, "User");
      }
      else
      {
        foreach (var role in registerDto.Roles)
        {
          await _userManager.AddToRoleAsync(user, role);
        }
      }

      return Ok(new Dtos.AuthResponseDto
      {
        IsSuccess = true,
        Message = "Account registered successfully"
      });
    }

    //api/account/login
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<Dtos.AuthResponseDto>> Login(Dtos.LoginDto loginDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var user = await _userManager.FindByEmailAsync(loginDto.Email);

      if (user is null)
      {
        return Unauthorized(new Dtos.AuthResponseDto
        {
          IsSuccess = false,
          Message = "User not found with this email"
        });
      }

      var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);

      if (!isPasswordValid)
      {
        return Unauthorized(new Dtos.AuthResponseDto
        {
          IsSuccess = false,
          Message = "Invalid password"
        });
      }

      var token = GenerateToken(user);
      return Ok(new Dtos.AuthResponseDto
      {
        IsSuccess = true,
        Message = "Login successful",
        Token = token
      });
    }

    private string GenerateToken(AppUser user)
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_configuration.GetSection("JWTSettings").GetSection("securityKey").Value!);
      var roles = _userManager.GetRolesAsync(user).Result;
      List<Claim> claims =
      [ new (JwtRegisteredClaimNames.Email, user.Email?? ""),
       new (JwtRegisteredClaimNames.Name,user.FullName?? ""),
       new (JwtRegisteredClaimNames.NameId,user.Id?? ""),
       new (JwtRegisteredClaimNames.Aud,
       _configuration.GetSection("JWTSettings").GetSection("ValidAudience").Value!),
       new (JwtRegisteredClaimNames.Iss,
       _configuration.GetSection("JWTSettings").GetSection("ValidIssuer").Value!)
     ];
      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddDays(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    //api/account/detail
    [Authorize]
    [HttpGet("detail")]
    public async Task<ActionResult<Dtos.UserDetailDto>> GetUserDetail()
    {
      var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
      var user = await _userManager.FindByIdAsync(currentUserId!);

      if(user is null)
      {
        return NotFound(new Dtos.AuthResponseDto
        {
          IsSuccess = false,
          Message = "User not found"
        });
      }

      return Ok(new Dtos.UserDetailDto
      {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Roles = (await _userManager.GetRolesAsync(user)).ToArray(),
        PhoneNumber = user.PhoneNumber,
        TwoFactorEnabled = user.TwoFactorEnabled,
        PhoneNumberConfirmed = user.PhoneNumberConfirmed,
        AccessFailedCount = user.AccessFailedCount
      });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Dtos.UserDetailDto>>> GetUsers()
    {
      var users = await _userManager.Users.Select(u => new Dtos.UserDetailDto
      {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        Roles = _userManager.GetRolesAsync(u).Result.ToArray(),
        // PhoneNumber = u.PhoneNumber,
        // TwoFactorEnabled = u.TwoFactorEnabled,
        // PhoneNumberConfirmed = u.PhoneNumberConfirmed,
        // AccessFailedCount = u.AccessFailedCount
      }).ToListAsync();
      return Ok(users);
    }
  }
}