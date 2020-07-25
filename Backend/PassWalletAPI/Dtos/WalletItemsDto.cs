using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PassWalletAPI.Dtos
{
    public class WalletItemsDto
    {
        [Required]
        public string UserId{ get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Password { get; set; }
        
    }
}
