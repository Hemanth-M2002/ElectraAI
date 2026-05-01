/**
 * MyNeta TN 2026 Scraper - Title-Based Approach
 * Gets party info from each candidate's page title: "Name(Party):Constituency..."
 * Fetches candidate IDs from constituency pages, then gets party from title.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const dataPath = path.join(__dirname, '../client/src/data/tnConstituencies.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      } 
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Extract candidate IDs from a constituency page
function extractCandidateIds(html) {
  const ids = [];
  // Match all candidate.php?candidate_id=NUMBER patterns
  const regex = /candidate\.php\?candidate_id=(\d+)/g;
  let match;
  const seen = new Set();
  while ((match = regex.exec(html)) !== null) {
    if (!seen.has(match[1])) {
      ids.push(match[1]);
      seen.add(match[1]);
    }
  }
  return ids;
}

// Get name and party from a candidate page title
function parseTitle(html) {
  const titleMatch = html.match(/<title>\s*([^<]+)\s*<\/title>/i);
  if (!titleMatch) return null;
  
  const title = titleMatch[1];
  // Format: "Name(Party):Constituency- ..."
  const m = title.match(/^(.+?)\((.+?)\)\s*:/);
  if (m) {
    return { name: m[1].trim(), party: m[2].trim() };
  }
  return null;
}

// Abbreviate party names
function abbrev(p) {
  const map = {
    'Dravida Munnetra Kazhagam': 'DMK',
    'All India Anna Dravida Munnetra Kazhagam': 'AIADMK',
    'Bharatiya Janata Party': 'BJP',
    'Indian National Congress': 'INC',
    'Pattali Makkal Katchi': 'PMK',
    'Tamilaga Vettri Kazhagam': 'TVK',
    'Naam Tamilar Katchi': 'NTK',
    'Viduthalai Chiruthaigal Katchi': 'VCK',
    'Communist Party of India  (Marxist)': 'CPI(M)',
    'Communist Party of India (Marxist)': 'CPI(M)',
    'Communist Party of India': 'CPI',
    'Amma Makkal Munnetra Kazhagam': 'AMMK',
    'Marumalarchi Dravida Munnetra Kazhagam': 'MDMK',
    'Desiya Murpokku Dravida Kazhagam': 'DMDK',
    'Makkal Needhi Maiam': 'MNM',
    'Bahujan Samaj Party': 'BSP',
    'Independent': 'IND',
  };
  for (const [k, v] of Object.entries(map)) {
    if (p.toLowerCase().includes(k.toLowerCase())) return v;
  }
  if (p.length <= 8) return p;
  return p;
}

const MAJOR_PARTIES = new Set(['DMK', 'AIADMK', 'BJP', 'INC', 'TVK', 'NTK', 'PMK', 'VCK', 'CPI(M)', 'CPI', 'AMMK', 'MDMK', 'DMDK', 'MNM']);

async function scrapeConstituency(constId) {
  const url = `https://myneta.info/TamilNadu2026/index.php?action=show_candidates&constituency_id=${constId}`;
  const html = await fetch(url);
  
  const candidateIds = extractCandidateIds(html);
  if (candidateIds.length === 0) return [];
  
  const results = [];
  const partiesSeen = new Set();
  
  // Fetch each candidate's page to get their party
  for (const cid of candidateIds) {
    try {
      const candHtml = await fetch(`https://myneta.info/TamilNadu2026/candidate.php?candidate_id=${cid}`);
      const info = parseTitle(candHtml);
      if (info) {
        const party = abbrev(info.party);
        const isMajor = MAJOR_PARTIES.has(party);
        
        if (isMajor && !partiesSeen.has(party)) {
          results.push({ name: info.name, party });
          partiesSeen.add(party);
        }
      }
      await sleep(80);
    } catch (e) { /* skip */ }
    
    // Stop once we have enough major parties (at least 5) or checked enough
    if (partiesSeen.size >= 5 || results.length >= 6) break;
  }
  
  return results;
}

async function main() {
  console.log('🔍 MyNeta TN 2026 Real Candidate Scraper');
  console.log('📊 Source: myneta.info/TamilNadu2026/ (ADR Database)\n');
  
  // Get constituency list from main page
  const indexHtml = await fetch('https://myneta.info/TamilNadu2026/');
  const constRegex = /constituency_id=(\d+)[^"]*"[^>]*>([^<]+)</g;
  let match;
  const constituencies = [];
  const seen = new Set();
  while ((match = constRegex.exec(indexHtml)) !== null) {
    const id = match[1];
    const name = match[2].trim();
    if (!seen.has(id) && !name.includes('ALL CONST') && name.length > 1) {
      constituencies.push({ id, name });
      seen.add(id);
    }
  }
  
  console.log(`Found ${constituencies.length} constituencies.\n`);
  
  const allResults = {};
  let processed = 0;
  
  for (const c of constituencies) {
    try {
      process.stdout.write(`[${++processed}/${constituencies.length}] ${c.name}...`);
      const candidates = await scrapeConstituency(c.id);
      allResults[c.name.toUpperCase()] = candidates;
      
      if (candidates.length > 0) {
        console.log(` ✅ ${candidates.map(x => `${x.name}(${x.party})`).join(', ')}`);
      } else {
        console.log(` ⚠️ no major parties found`);
      }
      
      await sleep(150);
    } catch (e) {
      console.log(` ❌ ${e.message}`);
    }
  }
  
  // Save intermediate result
  fs.writeFileSync(path.join(__dirname, 'myneta_raw.json'), JSON.stringify(allResults, null, 2));
  
  // Update local constituency data
  let updated = 0;
  data.forEach(c => {
    const key = c.name.toUpperCase().trim();
    
    // Try multiple match strategies
    let candidates = allResults[key];
    if (!candidates) {
      // Remove SC/ST suffix for matching
      const plain = key.replace(/\s*\(SC\)|\s*\(ST\)/gi, '').trim();
      for (const [k, v] of Object.entries(allResults)) {
        const kPlain = k.replace(/\s*\(SC\)|\s*\(ST\)/gi, '').trim();
        if (kPlain === plain || k.includes(plain) || plain.includes(kPlain)) {
          candidates = v;
          break;
        }
      }
    }
    
    if (candidates && candidates.length > 0) {
      c.nextElectionCandidates = candidates;
      updated++;
    }
  });
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Updated ${updated}/${data.length} constituencies with REAL MyNeta candidate names.`);
  console.log('🎉 Restart dev server to see real names!');
}

main().catch(console.error);
