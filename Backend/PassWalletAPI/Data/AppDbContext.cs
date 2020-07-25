using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PassWalletAPI.Model;

namespace PassWalletAPI.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            this.Database.Migrate();
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<PassWalletItems> PassWalletItems { get; set; }
    }
}
