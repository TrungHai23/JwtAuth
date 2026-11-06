using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController: ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            if (string.IsNullOrWhiteSpace(createRoleDto.RoleName))
            {
                return BadRequest("Role name is required.");
            }
            var roleExists = await _roleManager.RoleExistsAsync(createRoleDto.RoleName);
            if (roleExists)
            {
                return BadRequest("Role already exists.");
            }
            var roleResult = await _roleManager.CreateAsync(new IdentityRole(createRoleDto.RoleName));
            if (roleResult.Succeeded)
            {
               return Ok(new { Message = $"Role '{createRoleDto.RoleName}' created successfully." });
            }
            return BadRequest("Role creation failed.");
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
        {

         //List of roles with total user count 
         var roles = await _roleManager.Roles.Select( r => new RoleResponseDto
         {
             Id = r.Id,
             Name = r.Name,
             TotalUsers =  _userManager.GetUsersInRoleAsync(r.Name!).Result.Count.ToString()
         }).ToListAsync();  
            return Ok(roles);
        }
        

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {

            //find role by id and delete it

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound("Role not found.");
            }
            var roleResult = await _roleManager.DeleteAsync(role);
            if (roleResult.Succeeded)
            {
                return Ok(new { Message = $"Role '{role.Name}' deleted successfully." });
            }
            return BadRequest("Role deletion failed.");
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromBody] RoleAssignDto roleAssignDto)
        {
            var user = await _userManager.FindByIdAsync(roleAssignDto.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var role = await _roleManager.FindByIdAsync(roleAssignDto.RoleId);
            if (role == null)
            {
                return NotFound("Role not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, role.Name!);
            if (result.Succeeded)
            {
                return Ok(new { Message = $"Role '{role.Name}' assigned to user successfully." });
            }
            var errors = result.Errors.FirstOrDefault()?.Description ?? "Failed to assign role to user.";
            return BadRequest(errors);
        }
    }
}