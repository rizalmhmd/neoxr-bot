const fs = require('fs');
const path = require('path');

exports.run = {
    usage: ['saveplugin'],
    hidden: ['sp'],
    use: 'path + reply code',
    category: 'owner',
    async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
        try {
            // Validasi input path
            if (!text) return client.reply(m.chat, 'Mau simpan plugin di path apa?', m);
            if (!m.quoted) return client.reply(m.chat, 'Mau simpan plugin dengan command apa? Reply teks script-nya!', m);

            // Unduh data dari pesan yang di-reply
            let data;
            if (m.quoted.mimetype === 'application/javascript') {
                data = await m.quoted.download(); // Jika file adalah JavaScript
            } else if (m.quoted.text) {
                data = m.quoted.text; // Jika hanya teks
            } else {
                return client.reply(m.chat, 'Format file tidak didukung! Hanya mendukung teks atau file .js.', m);
            }

            // Validasi nama file agar tidak berbahaya
            if (!/^[a-zA-Z0-9_\-\/]+\.js$/.test(text)) {
                return client.reply(m.chat, 'Nama file tidak valid! Gunakan hanya huruf, angka, garis bawah, atau tanda hubung, dengan ekstensi .js.', m);
            }

            // Tentukan path file
            const filePath = path.join(process.cwd(), text);

            // Simpan file
            try {
                fs.writeFileSync(filePath, data);

                // Hapus cache require untuk memuat ulang plugin
                delete require.cache[require.resolve(filePath)];
                require(filePath);

                client.reply(m.chat, `Plugin berhasil disimpan dan dimuat dari ${filePath}`, m);
            } catch (e) {
                const errorMessage = `Gagal menyimpan plugin di '${filePath}':\n${e.message}`;
                console.error(errorMessage);
                return client.reply(m.chat, errorMessage, m);
            }
        } catch (e) {
            console.error(e);
            client.reply(m.chat, `Terjadi kesalahan: ${e.message}`, m);
        }
    },
  owner: true, // Hanya bisa digunakan oleh owner
  limit: false, // Tidak ada batasan penggunaan
  cache: true, // Cache aktif
  location: __filename // Lokasi file
};