using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PassWalletAPI.Model;

namespace PassWalletAPI.Data
{
    public class LoginRepository : ILoginRepository
    {
        private readonly AppDbContext _context;

        public LoginRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Users> Login(string email, string password)
        {
            var Users = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (Users == null)
                return null;
            if (!VerifyPassword(password, Users.Password))
                return null;
            return Users;
        }

        private bool VerifyPassword(string password, string passwordHash)
        {
            var key = "E546C8DF278CD5931069B522E695D4F2";
            var content = password;
            var decrypted = DecryptString(passwordHash, key); // Databaseden gelen şifre decrpyt edildi.
            for (int i = 0; i < content.Length; i++)
            {
                if (content[i] != decrypted[i])
                    return false;
            }

            return true;
        }
        public async Task<Users> Register(Users user, string password)
        {
            var encrypted = CreatePasswordHash(password);
            user.Password = encrypted;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExist(string email)
        {
            if (await _context.Users.AnyAsync(x => x.Email == email))
                return true;
            return false;
        }

        private string CreatePasswordHash(string password)
        {
            var content = password;
            var key = "E546C8DF278CD5931069B522E695D4F2";
            var encrypted = EncryptString(content, key);
            return encrypted;

        }

        ///////////////////////////////////////////////////////////////////////////// ENCRYPT  DECRYPT ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
