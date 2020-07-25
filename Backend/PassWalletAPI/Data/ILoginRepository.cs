using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PassWalletAPI.Model;

namespace PassWalletAPI.Data
{
    public interface ILoginRepository
    {
        Task<Users> Login(string email, string password);
        Task<Users> Register(Users user, string password);
        Task<bool> UserExist(string email);
    }
}
