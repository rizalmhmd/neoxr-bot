const fs = require('fs');
const path = require('path');

exports.run = {
   usage: ['delplugin'],
   hidden: ['dp'],
   use: 'path',
   category: 'owner',
   async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func, plugins }) => {
      try {
         if (!text) {
            return client.reply(
               m.chat,
               Func.texted('bold', `Format salah! Contoh: ${isPrefix}${command} special/ping`),
               m
            );
         }

         const targetPath = path.join(process.cwd(), `${text}`);
         if (!fs.existsSync(targetPath)) {
            return client.reply(
               m.chat,
               `Plugin atau folder '${text}' tidak ditemukan!\n\n` +
               Object.keys(plugins).map((v) => v?.replace('plugins/', '')).join('\n'),
               m
            );
         }

         const stat = fs.statSync(targetPath);

         if (stat.isDirectory()) {
            // Jika target adalah folder, hapus folder beserta isinya
            fs.rmSync(targetPath, { recursive: true, force: true });
            client.reply(m.chat, `Sukses menghapus folder '${text}' beserta isinya.`, m);
         } else {
            // Jika target adalah file, hapus file tersebut
            fs.unlinkSync(targetPath);
            client.reply(m.chat, `Sukses menghapus file '${text}'.`, m);
         }
      } catch (e) {
         console.error(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },

   owner: true,
   
   cache: true,
   location: __filename,
};