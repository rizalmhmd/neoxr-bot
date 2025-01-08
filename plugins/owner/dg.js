exports.run = {
   usage: ['dg'],
   use: 'path',
   category: 'owner',
   async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
      // Token GitHub dan informasi repository
      const GITHUB_TOKEN = '[TOKEN_REMOVED]'; // Ganti dengan token GitHub Anda
      const REPO_OWNER = 'rizalmhmd';
      const REPO_NAME = 'neoxr-bot';

      // Fungsi untuk mendapatkan SHA dari file yang akan dihapus
      const getFileSha = async (filePath) => {
         const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
         const response = await fetch(githubApiUrl, {
            method: 'GET',
            headers: {
               'Authorization': `token ${GITHUB_TOKEN}`,
               'Content-Type': 'application/json',
            },
         });

         if (response.ok) {
            const data = await response.json();
            return data.sha;
         } else if (response.status === 404) {
            throw new Error(`File tidak ditemukan: ${filePath}`);
         } else {
            const error = await response.json();
            throw new Error(`Gagal mendapatkan SHA: ${error.message}`);
         }
      };

      // Fungsi untuk menghapus file dari GitHub
      const deleteFileFromGitHub = async (filePath) => {
         try {
            const fileSha = await getFileSha(filePath);
            const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

            const response = await fetch(githubApiUrl, {
               method: 'DELETE',
               headers: {
                  'Authorization': `token ${GITHUB_TOKEN}`,
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  message: 'Menghapus file via API',
                  sha: fileSha,
               }),
            });

            if (response.ok) {
               return `File ${filePath} berhasil dihapus dari GitHub`;
            } else {
               const error = await response.json();
               throw new Error(`Gagal menghapus file: ${error.message}`);
            }
         } catch (error) {
            throw new Error(`Gagal menghapus file: ${error.message}`);
         }
      };

      // Eksekusi
      try {
         if (!text) return client.reply(m.chat, 'Mau hapus plugin di path apa?', m);

         const filePath = text.trim();
         const result = await deleteFileFromGitHub(filePath);
         client.reply(m.chat, result, m);
      } catch (e) {
         console.log(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   owner: true,
   cache: true,
   location: __filename,
};