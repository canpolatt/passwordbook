using PassWalletAPI.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PassWalletAPI.Data
{
    public class WalletRepository : IWalletRepository
    {
        private readonly AppDbContext _context;
        public WalletRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PassWalletItems> AddWallet(PassWalletItems user)
        {
            var encrypted = CreatePasswordHash(user.Password);
            user.Password = encrypted;

            await _context.PassWalletItems.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<List<PassWalletItems>> GetItem(string UserId)
        {
            var passWalletUsers = await _context.PassWalletItems.Where(x => x.UserId == UserId).ToListAsync();
            if (passWalletUsers == null)
                return null;
            var key = "E546C8DF278CD5931069B522E695D4F2";
            for (int i = 0; i < passWalletUsers.Count; i++)
            {
                var content = passWalletUsers[i].Password;
                var decrypted = DecryptString(content, key);
                passWalletUsers[i].Password = decrypted;
            }
            return passWalletUsers;
        }

        private string CreatePasswordHash(string password)
        {
            var content = password;
            var key = "E546C8DF278CD5931069B522E695D4F2";
            var encrypted = EncryptString(content, key);
            return encrypted;

        }

        public static string EncryptString(string text, string keyString)
        {
            var key = Encoding.UTF8.GetBytes(keyString);

            using (var aesAlg = Aes.Create())
            {
                using (var encryptor = aesAlg.CreateEncryptor(key, aesAlg.IV))
                {
                    using (var msEncrypt = new MemoryStream())
                    {
                        using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(text);
                        }

                        var iv = aesAlg.IV;

                        var decryptedContent = msEncrypt.ToArray();

                        var result = new byte[iv.Length + decryptedContent.Length];

                        Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                        Buffer.BlockCopy(decryptedContent, 0, result, iv.Length, decryptedContent.Length);

                        return Convert.ToBase64String(result);
                    }
                }
            }
        }

        public static string DecryptString(string cipherText, string keyString)
        {
            var fullCipher = Convert.FromBase64String(cipherText);

            var iv = new byte[16];
            var cipher = new byte[16];

            Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, iv.Length);
            var key = Encoding.UTF8.GetBytes(keyString);

            using (var aesAlg = Aes.Create())
            {
                using (var decryptor = aesAlg.CreateDecryptor(key, iv))
                {
                    string result;
                    using (var msDecrypt = new MemoryStream(cipher))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                result = srDecrypt.ReadToEnd();
                            }
                        }
                    }

                    return result;
                }
            }
        }
    }
}
