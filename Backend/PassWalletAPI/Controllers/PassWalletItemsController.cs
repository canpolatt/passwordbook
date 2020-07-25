using System;
using System.Collections.Generic;
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
    public class PassWalletItemsController : ControllerBase
    {
        private readonly IWalletRepository _walletRepository;
        public PassWalletItemsController(IWalletRepository walletRepository)
        {
            _walletRepository = walletRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] WalletItemsDto userForWalletItemsDto)
        {
            var userToCreate = new PassWalletItems
            {
                UserId = userForWalletItemsDto.UserId,
                Name = userForWalletItemsDto.Name,
                Description = userForWalletItemsDto.Description,
                Password = userForWalletItemsDto.Password

            };
            var userCreate = await _walletRepository.AddWallet(userToCreate);
            return StatusCode(200);
        }

        [HttpGet("{UserId}")]
        public async Task<List<PassWalletItems>> GetItem(string UserId) //Kullanıcı getirme
        {
            var userFromDb = await _walletRepository.GetItem(UserId);

            return userFromDb;
        }

    }
}
//private readonly AppDbContext _context;

//public PassWalletItemsController(AppDbContext context)
//{
//    _context = context;
//}

//// GET: api/PassWalletItems
//[HttpGet]
//public async Task<ActionResult<IEnumerable<PassWalletItems>>> GetPassWalletItems()
//{
//    return await _context.PassWalletItems.ToListAsync();
//}

//// GET: api/PassWalletItems/5
//[HttpGet("{id}")]
//public async Task<ActionResult<PassWalletItems>> GetPassWalletItems(Guid id)
//{
//    var passWalletItems = await _context.PassWalletItems.FindAsync(id);

//    if (passWalletItems == null)
//    {
//        return NotFound();
//    }

//    return passWalletItems;
//}

//// PUT: api/PassWalletItems/5
//// To protect from overposting attacks, enable the specific properties you want to bind to, for
//// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
//[HttpPut("{id}")]
//public async Task<IActionResult> PutPassWalletItems(Guid id, PassWalletItems passWalletItems)
//{
//    if (id != passWalletItems.Id)
//    {
//        return BadRequest();
//    }

//    _context.Entry(passWalletItems).State = EntityState.Modified;

//    try
//    {
//        await _context.SaveChangesAsync();
//    }
//    catch (DbUpdateConcurrencyException)
//    {
//        if (!PassWalletItemsExists(id))
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

//// POST: api/PassWalletItems
//// To protect from overposting attacks, enable the specific properties you want to bind to, for
//// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
//[HttpPost]
//public async Task<ActionResult<PassWalletItems>> PostPassWalletItems(PassWalletItems passWalletItems)
//{
//    _context.PassWalletItems.Add(passWalletItems);
//    await _context.SaveChangesAsync();

//    return CreatedAtAction("GetPassWalletItems", new { id = passWalletItems.Id }, passWalletItems);
//}

//// DELETE: api/PassWalletItems/5
//[HttpDelete("{id}")]
//public async Task<ActionResult<PassWalletItems>> DeletePassWalletItems(Guid id)
//{
//    var passWalletItems = await _context.PassWalletItems.FindAsync(id);
//    if (passWalletItems == null)
//    {
//        return NotFound();
//    }

//    _context.PassWalletItems.Remove(passWalletItems);
//    await _context.SaveChangesAsync();

//    return passWalletItems;
//}

//private bool PassWalletItemsExists(Guid id)
//{
//    return _context.PassWalletItems.Any(e => e.Id == id);
//}