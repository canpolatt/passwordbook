using PassWalletAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PassWalletAPI.Data
{
    public interface IWalletRepository
    {
        Task<PassWalletItems> AddWallet(PassWalletItems user);
        Task<List<PassWalletItems>> GetItem(string UserId);
    }
}
