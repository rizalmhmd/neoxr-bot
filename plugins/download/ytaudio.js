const yts = require('yt-search');
const fetch = require('node-fetch');

exports.run = {
   usage: ['ytaudio'],
   hidden: ['yta', 'ytmp3'],
   use: 'link youtube',
   category: 'downloader',
   async: async (m, { client, args, text, isPrefix, command, Func }) => {
      try {
         // Validasi input
         if (!text) {
            return client.reply(
               m.chat,
               Func.texted('bold', `Contoh penggunaan: ${isPrefix}${command} https://youtu.be/1fOBgosDo7s`),
               m
            );
         }

         if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(text)) {
            return client.reply(m.chat, `URL tidak valid!`, m);
         }

         client.sendReact(m.chat, '🕒', m.key);

         // Pencarian video YouTube
         let search = await yts(text);
         if (!search.all || search.all.length === 0) {
            return client.reply(m.chat, `Tidak ada hasil ditemukan.`, m);
         }

         let data = search.all.filter((v) => v.type === 'video');
         if (data.length === 0) {
            return client.reply(m.chat, `Tidak ada hasil yang sesuai.`, m);
         }

         let res = data[0] || data[1];
         if (!res) {
            return client.reply(m.chat, `Gagal mengambil detail video.`, m);
         }

         let txt = `◦ *Judul* : ${res.title}\n`;
         txt += `◦ *Durasi* : ${res.timestamp}\n`;
         txt += `◦ *Views* : ${res.views}\n`;
         txt += `◦ *Channel* : ${res.author.name}\n`;
         txt += `◦ *URL Video* : ${res.url}\n\n`;
         txt += `Audio sedang diproses, harap tunggu...`;

         // Unduh thumbnail sebagai buffer
         let thumbnailBuffer = await Func.fetchBuffer(res.thumbnail);

         client.sendMessageModifyV2(
            m.chat,
            txt,
            '© neoxr-bot',
            {
               title: '乂  *Y O U T U B E  A U D I O*',
               largeThumb: true,
               ads: false,
               thumbnail: thumbnailBuffer,
               link: 'https://chat.whatsapp.com/HYknAquOTrECm9KPJJQO1V',
            }
         );

         // Unduh audio dari API eksternal
         let music = await Func.fetchJson(`https://endpoint.web.id/downloader/yt-audio?key=SRA-XYMUFK&url=${res.url}&format=mp3`);
         if (!music.result?.downloadUrl) {
            return client.reply(m.chat, `Gagal mengambil file audio.`, m);
         }

         await client.sendMessage(
            m.chat,
            {
               audio: { url: music.result.downloadUrl },
               mimetype: 'audio/mpeg',
            },
            { quoted: m }
         );

         client.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
      } catch (e) {
         console.error(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   limit: true,
   cache: true,
   location: __filename,
};