const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/ai chatgpt');
const destDir = path.join(__dirname, '../public/ai-chatgpt');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

const mappings = {
  'ChatGPT Image Jul 30, 2026, 09_29_00 PM (1).png': 'security-suite-3d.png',
  'ChatGPT Image Jul 30, 2026, 09_29_01 PM (2).png': 'laptop-code-v1.png',
  'ChatGPT Image Jul 30, 2026, 09_29_01 PM (3).png': 'security-shield-v1.png',
  'ChatGPT Image Jul 30, 2026, 09_29_02 PM (4).png': 'server-stack-v1.png',
  'ChatGPT Image Jul 30, 2026, 09_29_03 PM (5).png': 'bug-magnifier-v1.png',
  'ChatGPT Image Jul 30, 2026, 09_29_03 PM (6).png': 'ai-brain-v1.png',
  'ChatGPT Image Jul 30, 2026, 09_29_04 PM (7).png': 'ai-robot-mascot.png',
  'ChatGPT Image Jul 30, 2026, 09_45_26 PM (1).png': 'hero-composite.png',
  'ChatGPT Image Jul 30, 2026, 09_45_27 PM (2).png': 'hero-composite-alt.png',
  'ChatGPT Image Jul 30, 2026, 09_45_28 PM (3).png': 'cyber-security-shield.png',
  'ChatGPT Image Jul 30, 2026, 09_45_29 PM (4).png': 'laptop-code.png',
  'ChatGPT Image Jul 30, 2026, 09_45_30 PM (5).png': 'vulnerability-chip.png',
  'ChatGPT Image Jul 30, 2026, 09_45_31 PM (6).png': 'software-testing-checklist.png',
  'ChatGPT Image Jul 30, 2026, 09_45_31 PM (7).png': 'server-stack.png',
  'ChatGPT Image Jul 30, 2026, 09_45_32 PM (8).png': 'malware-ai-brain.png',
  'ChatGPT Image Jul 30, 2026, 09_45_33 PM (9).png': 'code-clone-sync.png'
};

for (const [oldName, newName] of Object.entries(mappings)) {
  const oldPath = path.join(srcDir, oldName);
  const newPath = path.join(destDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.copyFileSync(oldPath, newPath);
    console.log(`Copied ${oldName} to ${newName}`);
  }
}
