using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PassWalletAPI.Data;
using PassWalletAPI.Dtos;
using PassWalletAPI.Model;

namespace PassWalletAPI.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ILoginRepository _loginRepository;



        public UsersController(ILoginRepository loginRepository)
        {
            _loginRepository = loginRepository;

        }

        [HttpPost]
      
        public async Task<IActionResult> Register([FromBody] RegisterUserDto userForRegisterUserDto)
        {
            userForRegisterUserDto.Email = userForRegisterUserDto.Email.ToLower(CultureInfo.CurrentCulture);//Emailleri lower case saklayacak.
            if (await _loginRepository.UserExist(userForRegisterUserDto.Email)) //Sistemde böyle bir e-mail var mı yok mu 
                return BadRequest("Zaten kayıtlı bir e-mail..");
            var userToCreate = new Users
            {
                Email = userForRegisterUserDto.Email,
                Name = userForRegisterUserDto.Name
            };
            var userCreate = await _loginRepository.Register(userToCreate, userForRegisterUserDto.Password);
            return StatusCode(200);

        }

        [HttpGet("{email}/{password}")]
        public Task<Users> Login(string email, string password) //Kullanıcı girişi
        {
            var userFromDb = _loginRepository.Login(email, password);
            if (userFromDb == null)
                return null;
            return userFromDb;
        }

        //public  Response userLogin(Users user)
        //{
        //    var userFromDb =  _loginRepository.Login(user.Email,user.Password);

        //    if (userFromDb== null)
        //    {
        //        return new Response {  message = "Invalid User." };
        //    }
        //    else
        //    {


        //        return new Response
        //        {
        //            message = "Valid User.",
        //            Id = userFromDb.Id


        //        };
        //    }

        //}

        //    [HttpGet("{email}/{password}")]
        //    public async Task<IActionResult> Login(string email, string password) //Kullanıcı girişi
        //    {
        //        var userFromDb = await _loginRepository.Login(email, password);
        //        if (userFromDb == null)
        //        {

        //            return new Response { message = "Invalid User." };
        //        }
        //        else
        //        {
        //            return new Response
        //            {
        //                Id = userFromDb.Id,
        //                message = "Succesful",
        //                userName = userFromDb.Name
        //            }
        //        }
        //        //    return StatusCode(401);
        //        //return StatusCode(200);
        //    }


        //}
    }
}


//// GET: api/Users
//[HttpGet]
//public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
//{
//    return await _context.Users.ToListAsync();
//}

//// GET: api/Users/5
//[HttpGet("{id}")]
//public async Task<ActionResult<Users>> GetUsers(Guid id)
//{
//    var users = await _context.Users.FindAsync(id);

//    if (users == null)
//    {
//        return NotFound();
//    }

//    return users;
//}

//// PUT: api/Users/5
//// To protect from overposting attacks, enable the specific properties you want to bind to, for
//// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
//[HttpPut("{id}")]
//public async Task<IActionResult> PutUsers(Guid id, Users users)
//{
//    if (id != users.Id)
//    {
//        return BadRequest();
//    }

//    _context.Entry(users).State = EntityState.Modified;

//    try
//    {
//        await _context.SaveChangesAsync();
//    }
//    catch (DbUpdateConcurrencyException)
//    {
//        if (!UsersExists(id))
//        {
//            return NotFound();
//        }
//        else
//        {
//            throw;
//        }
//    }

//    return NoContent();
//}

//// POST: api/Users
//// To protect from overposting attacks, enable the specific properties you want to bind to, for
//// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
//[HttpPost]
//public async Task<ActionResult<Users>> PostUsers(Users users)
//{
//    _context.Users.Add(users);
//    await _context.SaveChangesAsync();

//    return CreatedAtAction("GetUsers", new { id = users.Id }, users);
//}

//// DELETE: api/Users/5
//[HttpDelete("{id}")]
//public async Task<ActionResult<Users>> DeleteUsers(Guid id)
//{
//    var users = await _context.Users.FindAsync(id);
//    if (users == null)
//    {
//        return NotFound();
//    }

//    _context.Users.Remove(users);
//    await _context.SaveChangesAsync();

//    return users;
//}

//private bool UsersExists(Guid id)
//{
//    return _context.Users.Any(e => e.Id == id);
//}