const { cmd } = require("../command");
const axios = require('axios');
const cheerio = require("cheerio");
const fs = require('fs');
const path = require("path");
const AdmZip = require('adm-zip');
const { URL } = require("url");

module.exports = {
  pattern: 'getsource',
  alias: ["web"],
  react: ['🌐'],
  desc: "Get HTML + CSS + JS from a website",
  category: "tools",
  filename: __filename,
};

cmd({
  pattern: 'getsource',
  alias: ["web"],
  react: ['🌐'],
  desc: "Get HTML + CSS + JS from a website",
  category: "tools",
  filename: __filename,
}, async (m, sock, match, { reply }) => {
  try {
    const inputUrl = match?.trim()?.split(" ")[1];
    if (!inputUrl) {
      return reply("❌ Please provide a website URL.\n\nExample: `.getsource https://example.com`");
    }

    const targetUrl = inputUrl.startsWith('http') ? inputUrl : 'https://' + inputUrl;
    const isValidUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(targetUrl);
    if (!isValidUrl) {
      return reply("❌ Invalid URL format.");
    }

    await reply("⏳ Fetching HTML, CSS, and JS...");

    // Fetch website HTML
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      timeout: 30000,
    });
    const htmlContent = response.data;

    // Create temporary directory
    const tempDir = path.join(__dirname, `website_source_${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    const htmlPath = path.join(tempDir, "index.html");
    fs.writeFileSync(htmlPath, htmlContent);

    // Parse HTML for assets
    const $ = cheerio.load(htmlContent);
    const baseUrl = new URL(targetUrl);
    const downloadQueue = [];

    const downloadAsset = async (assetUrl, fileName) => {
      try {
        const absoluteUrl = new URL(assetUrl, baseUrl).href;
        const assetResponse = await axios.get(absoluteUrl, {
          responseType: 'arraybuffer',
          timeout: 15000,
        });
        
        const safeFileName = fileName.replace(/[^a-z0-9_.]/gi, '_').substring(0, 100);
        const filePath = path.join(tempDir, safeFileName);
        fs.writeFileSync(filePath, assetResponse.data);
      } catch (error) {
        console.warn(`❌ Failed to download asset: ${assetUrl}`, error.message);
      }
    };

    // Find and download CSS
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fileName = path.basename(href.split('?')[0]) || `style_${i}.css`;
        downloadQueue.push(downloadAsset(href, fileName));
      }
    });

    // Find and download JS
    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const fileName = path.basename(src.split('?')[0]) || `script_${i}.js`;
        downloadQueue.push(downloadAsset(src, fileName));
      }
    });

    // Process all downloads
    await Promise.all(downloadQueue);

    // Create ZIP archive
    const zip = new AdmZip();
    zip.addLocalFolder(tempDir);
    const zipPath = path.join(__dirname, `website_${Date.now()}.zip`);
    zip.writeZip(zipPath);

    // Send result
    await sock.sendMessage(m.chat, {
      document: fs.readFileSync(zipPath),
      fileName: "website-source.zip",
      mimetype: "application/zip",
      caption: `📁 Source code from: ${targetUrl}\n\n> 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃`
    }, { quoted: m });

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(zipPath);

  } catch (error) {
    console.error("Error in getsource command:", error);
    reply("❌ Failed to fetch website source. Please check the URL and try again.");
  }
});