using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PassWalletAPI.Model
{
    public class PassWalletItems
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Password { get; set; }
    }
}
