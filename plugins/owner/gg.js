exports.run = {
   usage: ['gg'],
   use: 'path',
   category: 'owner',
   async: async (m, { client, args, text, isPrefix, command, env, Scraper, Func }) => {
      // Token GitHub dan informasi repository
      const GITHUB_TOKEN = '[TOKEN_REMOVED]'; // Ganti dengan token GitHub Anda
      const REPO_OWNER = 'rizalmhmd';
      const REPO_NAME = 'neoxr-bot';

      // Fungsi untuk mengambil konten file dari GitHub
      const getFileFromGitHub = async (filePath) => {
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
            return Buffer.from(data.content, 'base64').toString('utf-8');
         } else if (response.status === 404) {
            throw new Error(`File tidak ditemukan: ${filePath}`);
         } else {
            const error = await response.json();
            throw new Error(`Gagal mengambil file: ${error.message}`);
         }
      };

      // Fungsi untuk mendapatkan branch default dari repository
      const getDefaultBranch = async () => {
         const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
         const response = await fetch(githubApiUrl, {
            method: 'GET',
            headers: {
               'Authorization': `token ${GITHUB_TOKEN}`,
               'Content-Type': 'application/json',
            },
         });

         if (response.ok) {
            const data = await response.json();
            return data.default_branch;
         } else {
            const error = await response.json();
            throw new Error(`Gagal mengambil branch default: ${error.message}`);
         }
      };

      // Fungsi untuk mendapatkan semua file path di dalam repository
      const getAllFilePaths = async () => {
         const defaultBranch = await getDefaultBranch();
         const githubApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${defaultBranch}?recursive=1`;

         const response = await fetch(githubApiUrl, {
            method: 'GET',
            headers: {
               'Authorization': `token ${GITHUB_TOKEN}`,
               'Content-Type': 'application/json',
            },
         });

         if (response.ok) {
            const data = await response.json();
            return data.tree
               .filter(item => item.type === 'blob') // Filter hanya file
               .map(item => item.path);
         } else {
            const error = await response.json();
            throw new Error(`Gagal mengambil daftar file: ${error.message}`);
         }
      };

      // Eksekusi
      try {
         const filePath = text.trim();
         if (filePath) {
            // Jika path diberikan, ambil konten file tersebut
            const content = await getFileFromGitHub(filePath);
            client.reply(m.chat, content, m);
         } else {
            // Jika tidak ada path, tampilkan daftar file
            const allFilePaths = await getAllFilePaths();
            client.reply(m.chat, `Ini daftar semua file di dalam repository:\n\n${allFilePaths.join('\n')}`, m);
         }
      } catch (e) {
         console.log(e);
         client.reply(m.chat, Func.jsonFormat(e), m);
      }
   },
   owner: true,
   cache: true,
   location: __filename,
};