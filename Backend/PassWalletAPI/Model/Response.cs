using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PassWalletAPI.Model
{
    public class Response
    {
        public Guid Id { get; set; }

        public string message { get; set; }
        public string userName { get; set; }
    }
}
