const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\a0188f75-9ed4-4054-8a58-b469e16408a5\\.system_generated\\logs\\transcript.jsonl';
const targetDir = 'C:\\Users\\Asus\\Desktop\\AbtalQuest-website\\public';

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.media && Array.isArray(obj.media)) {
      console.log(`Found ${obj.media.length} media items.`);
      obj.media.forEach((m, idx) => {
        console.log(`[Page ${idx + 1}] uri:`, m.uri);
        // Let's copy page images to public with clear names:
        // page 16 is hero portal
        // page 17 is hero running
        // page 18 is stories triptych
        // page 21 is mother and child crafting rocket
        // page 22 is boy at desk with tablet and stars
        // page 23 is boy in garden with magnifying glass and bug notebook
        // page 24 is mother and son with cardboard bridge
        const filePath = m.uri ? m.uri.replace('file:///', '') : null;
        if (filePath && fs.existsSync(filePath)) {
          const ext = path.extname(filePath) || '.jpg';
          const destName = `page-${idx + 1}${ext}`;
          fs.copyFileSync(filePath, path.join(targetDir, destName));
          console.log(`Copied ${filePath} -> ${destName}`);
        }
      });
      break;
    }
  } catch (e) {
    // ignore
  }
}
