/**
  * Made by MannR
  * ini wm njirr jan didelete
  * https://whatsapp.com/channel/0029VaGqCO6I1rcjc9hisJ3U
**/
const fs = require("fs");
const path = require("path");

exports.run = {
  usage: ['getfile'],
  category: 'owner',
  async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
    try {
      // Validasi input
      if (!text) {
        return client.reply(m.chat, Func.texted('bold', `Contoh penggunaan: ${isPrefix}${command} config.js`), m);
      }

      // Tentukan path file
      const filePath = path.resolve(`./${text}`);

      // Validasi keamanan: hanya izinkan membaca file dalam direktori kerja
      if (!filePath.startsWith(process.cwd())) {
        return client.reply(m.chat, 'Akses ke file di luar direktori kerja tidak diperbolehkan.', m);
      }

      // Cek apakah file ada
      if (!fs.existsSync(filePath)) {
        return client.reply(m.chat, Func.texted('bold', `File "${text}" tidak ditemukan di direktori ./`), m);
      }

      // Baca isi file
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Kirim isi file ke chat
        if (fileContent.length > 4096) {
          return client.reply(m.chat, Func.texted('bold', `Isi file terlalu besar untuk dikirim langsung. Silakan periksa file secara manual.`), m);
        }

        client.reply(m.chat, `${fileContent}`, m);
      } catch (err) {
        console.error(err);
        client.reply(m.chat, Func.texted('bold', `Gagal membaca file "${text}".`), m);
      }
    } catch (e) {
      console.error(e);
      client.reply(m.chat, Func.texted('bold', `Terjadi kesalahan: ${e.message}`), m);
    }
  },
  owner: true, // Hanya bisa digunakan oleh owner
  limit: false, // Tidak ada batasan penggunaan
  cache: true, // Cache aktif
  location: __filename // Lokasi file
};