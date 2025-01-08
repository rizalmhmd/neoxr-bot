const yts = require('yt-search');

exports.run = {
   usage: ['ytsearch'],
   hidden: ['yts'],
   use: 'judul lagu',
   category: 'downloader',
   async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
      try {
         if (!text) return client.reply(m.chat, Func.texted('bold', `Contoh penggunaan: ${isPrefix}${command} legends never die`), m);

         let wait = await client.reply(m.chat, `Tunggu sebentar...`, m);

         let search = await yts(text);
         if (!search.all || search.all.length === 0) {
            return client.reply(m.chat, `Tidak ada hasil ditemukan`, m);
         }

         let results = search.all.slice(0, 15); // Batasi hasil maksimal 15
         let txt = `*Y O U T U B E - S E A R C H*\n\nResult From : ${text}\n\nSelect the list button below.`;

        

         // Membuat tombol list untuk memilih antara audio (.yta) dan video (.ytv)
         const listButtons = results.map((video, index) => ({
            title: video.title,
            rows: [
               {
                  title: 'Audio', 
                  description: `Durasi: ${video.timestamp}`,
                  id: `${isPrefix}yta ${video.url}` // ID untuk tombol audio
               },
               {
                  title: 'Video', 
                  description: `Durasi: ${video.timestamp}`,
                  id: `${isPrefix}ytv ${video.url}` // ID untuk tombol video
               }
            ]
         }));

         // Membuat tombol list untuk dikirim
         const buttonPayload = {
            title: 'Click Here ⎙',
            sections: listButtons
         };

         // Mengirim pesan dengan tombol list
         client.sendIAMessage(m.chat, [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify(buttonPayload)
         }], m, {
            header: 'Pilih Video atau Audio',
            content: txt,
            footer: global.footer,
            media: global.db.setting.cover
         });

      } catch (e) {
         console.log(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },

   limit: true,
   cache: true,
   location: __filename
};