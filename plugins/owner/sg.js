const fetch = require('node-fetch');
const path = require('path');

// Token GitHub dan informasi repository
const GITHUB_TOKEN = '[TOKEN_REMOVED]';
const REPO_OWNER = 'rizalmhmd';
const REPO_NAME = 'neoxr-bot';

// Fungsi untuk mendapatkan SHA file dari GitHub
async function getFileSha(githubApiUrl) {
   const response = await fetch(githubApiUrl, {
      headers: {
         'Authorization': `token ${GITHUB_TOKEN}`,
      },
   });

   if (response.ok) {
      const data = await response.json();
      return data.sha;
   } else if (response.status === 404) {
      return null;
   } else {
      const error = await response.json();
      throw new Error(`Gagal mendapatkan SHA: ${error.message}`);
   }
}

// Fungsi untuk mengupload atau memperbarui file ke GitHub
async function uploadFileToGitHub(filePath, content) {
   const base64Content = Buffer.from(content).toString('base64');
   const fileName = path.basename(filePath);
   const directoryPath = path.dirname(filePath);
   const TARGET_PATH = `${directoryPath}/${fileName}`;
   const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH}`;

   const sha = await getFileSha(githubApiUrl);

   const body = {
      message: `Update file ${fileName}`,
      content: base64Content,
   };

   if (sha) {
      body.sha = sha;
   }

   const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
         'Authorization': `token ${GITHUB_TOKEN}`,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
   });

   if (response.ok) {
      return `File "${fileName}" berhasil diupload atau diperbarui di GitHub.`;
   } else {
      const error = await response.json();
      throw new Error(`Gagal mengupload file: ${error.message}`);
   }
}

exports.run = {
   usage: ['savegithub'],
   hidden: ['sg'],
   use: 'path',
   category: 'owner',
   async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
      try {
         if (!text) {
            return client.reply(m.chat, Func.texted('bold', `Mau simpan plugin di path apa?`), m);
         }
         if (!m.quoted) {
            return client.reply(m.chat, Func.texted('bold', `Reply teks script yang ingin diupload ke GitHub!`), m);
         }

         const filePath = text.trim();
         const content = m.quoted.text?.trim();

         if (!content) {
            return client.reply(m.chat, Func.texted('bold', `Konten file kosong!`), m);
         }

         const sanitizedContent = content.replace(/ghp_[a-zA-Z0-9]+/, '[TOKEN_REMOVED]');

         const result = await uploadFileToGitHub(filePath, sanitizedContent);
         client.reply(m.chat, Func.texted('bold', result), m);
      } catch (e) {
         console.log(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   owner: true,
   cache: true,
   location: __filename
};