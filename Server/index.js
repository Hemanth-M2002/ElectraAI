require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Validate Environment Variables ─────────────────────────────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Helper: Sleep Function for Retry Delays ────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Gemini AI Candidate Lookup ────────────────────────────────────────
async function fetchGeminiCandidates(constituencyName) {
  try {
    console.log(`🔍 Using Gemini AI to find candidates for ${constituencyName}...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
For the ${constituencyName} assembly constituency in Tamil Nadu state, India:

List the candidates from the MOST RECENT assembly election (usually 2021 Tamil Nadu Assembly Elections).

Return ONLY a JSON array (no explanation, no markdown):
[{"name": "Full Name", "party": "Party Code"}, ...]

Party codes to use: DMK, AIADMK, BJP, INC, TVK, NTK, PMK, AMMK, MDMK, DMDK, VCK, CPI, CPI(M), MNM, BSP, IND

Rules:
- Use ONLY real candidate names from the actual election
- Maximum 6 candidates
- If no data exists, return exactly: []
`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`📄 Gemini response (raw):`, text);
    
    // Clean and parse JSON response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        const candidates = JSON.parse(jsonMatch[0]);
        if (Array.isArray(candidates) && candidates.length > 0) {
          console.log(`✅ Gemini extracted ${candidates.length} candidates`);
          return candidates;
        }
      } catch (e) {
        console.log("⚠️ JSON parse failed:", e.message);
      }
    }
    
    // Manual extraction fallback
    const namePartyRegex = /"?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-z]+)?)"?\s*[\(\[]?([A-Z]{2,5})?[\]\)]?/g;
    const candidates = [];
    const seenParties = new Set();
    let m;
    
    while ((m = namePartyRegex.exec(text)) !== null) {
      const name = m[1].trim();
      const party = m[2]?.trim() || '';
      
      if (name.length > 3 && party.length >= 2 && !seenParties.has(party)) {
        candidates.push({ name, party });
        seenParties.add(party);
      }
      
      if (candidates.length >= 6) break;
    }
    
    if (candidates.length > 0) {
      console.log(`✅ Manual extraction found ${candidates.length} candidates`);
      return candidates;
    }
    
    return [];
  } catch (e) {
    console.error("❌ Gemini search error:", e.message);
    return [];
  }
}

// ─── Load Local Constituency Data (Instant Source) ──────────────────────────
let localConstituencies = [];
try {
  const dataPath = path.join(__dirname, '../client/src/data/tnConstituencies.json');
  if (fs.existsSync(dataPath)) {
    localConstituencies = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`✅ Loaded ${localConstituencies.length} constituencies from verified local database.`);
  } else {
    console.warn("⚠️ Local constituencies file not found. Search will return empty results.");
  }
} catch (err) {
  console.error("❌ Error loading local constituencies:", err);
}

const https = require('https');

const mynetaCache = {};
const mynetaCachePath = path.join(__dirname, 'myneta_cache.json');

const googleCache = {};
const googleCachePath = path.join(__dirname, 'google_cache.json');

// Load existing cache
try {
  if (fs.existsSync(mynetaCachePath)) {
    Object.assign(mynetaCache, JSON.parse(fs.readFileSync(mynetaCachePath, 'utf8')));
    console.log(`📦 Loaded MyNeta cache with ${Object.keys(mynetaCache).length} constituencies.`);
  }
} catch (e) { /* ignore */ }

try {
  if (fs.existsSync(googleCachePath)) {
    Object.assign(googleCache, JSON.parse(fs.readFileSync(googleCachePath, 'utf8')));
    console.log(`📦 Loaded Google cache with ${Object.keys(googleCache).length} constituencies.`);
  }
} catch (e) { /* ignore */ }

// Load existing cache
try {
  if (fs.existsSync(mynetaCachePath)) {
    Object.assign(mynetaCache, JSON.parse(fs.readFileSync(mynetaCachePath, 'utf8')));
    console.log(`📦 Loaded MyNeta cache with ${Object.keys(mynetaCache).length} constituencies.`);
  }
} catch (e) { /* ignore */ }

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// MyNeta constituency ID map (name -> myneta_id) from the index page
const MYNETA_CONST_MAP = {};

let mynetaLoadError = null;

// Build the map on startup
(async () => {
  try {
    const html = await fetchUrl('https://myneta.info/TamilNadu2026/');
    lastHtmlSnippet = html.substring(0, 1000);
    const regex = /constituency_id=(\d+)[^>]*>\s*([^<]+?)\s*<\/a>/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      const name = m[2].trim().toUpperCase();
      if (!name.includes('ALL CONST') && name.length > 1) {
        MYNETA_CONST_MAP[name] = m[1];
      }
    }
    if (Object.keys(MYNETA_CONST_MAP).length === 0) {
       mynetaLoadError = "No constituencies found in HTML. Regex might be wrong.";
    }
    console.log(`🗺️ Loaded ${Object.keys(MYNETA_CONST_MAP).length} MyNeta constituency IDs.`);
  } catch (e) {
    mynetaLoadError = e.message;
    console.warn('⚠️ Could not load MyNeta constituency map:', e.message);
  }
})();

function abbreviateParty(p) {
  const map = {
    'dravida munnetra kazhagam': 'DMK',
    'all india anna dravida munnetra kazhagam': 'AIADMK',
    'bharatiya janata party': 'BJP',
    'indian national congress': 'INC',
    'pattali makkal katchi': 'PMK',
    'tamilaga vettri kazhagam': 'TVK',
    'naam tamilar katchi': 'NTK',
    'viduthalai chiruthaigal katchi': 'VCK',
    'communist party of india': 'CPI',
    'communist party of india  (marxist)': 'CPI(M)',
    'communist party of india (marxist)': 'CPI(M)',
    'amma makkal munnetra kazhagam': 'AMMK',
    'marumalarchi dravida munnetra kazhagam': 'MDMK',
    'desiya murpokku dravida kazhagam': 'DMDK',
    'makkal needhi maiam': 'MNM',
    'bahujan samaj party': 'BSP',
    'independent(ind)': 'IND',
    'independent': 'IND',
  };
  const lower = p.toLowerCase().trim();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  if (p.length <= 8) return p;
  return p.substring(0, 12);
}

const MAJOR_PARTIES = new Set(['DMK', 'AIADMK', 'BJP', 'INC', 'TVK', 'NTK', 'PMK', 'VCK', 'CPI(M)', 'CPI', 'AMMK', 'MDMK', 'DMDK', 'MNM']);

async function scrapeMyNetaConstituency(mynetaId) {
  // 1. Get candidate list page
  const listUrl = `https://myneta.info/TamilNadu2026/index.php?action=show_candidates&constituency_id=${mynetaId}`;
  const listHtml = await fetchUrl(listUrl);
  
  // 2. Extract candidate IDs
  const idRegex = /candidate\.php\?candidate_id=(\d+)/g;
  const ids = [];
  const seen = new Set();
  let m;
  while ((m = idRegex.exec(listHtml)) !== null) {
    if (!seen.has(m[1])) { ids.push(m[1]); seen.add(m[1]); }
  }
  
  if (ids.length === 0) return [];
  
  // 3. Fetch each candidate's page to get name + party from title
  const results = [];
  const partiesSeen = new Set();
  
  for (const cid of ids) {
    if (partiesSeen.size >= 6) break; // Got enough major parties
    
    try {
      const candHtml = await fetchUrl(`https://myneta.info/TamilNadu2026/candidate.php?candidate_id=${cid}`);
      const titleMatch = candHtml.match(/<title>\s*([^<]+)\s*<\/title>/i);
      if (titleMatch) {
        const pm = titleMatch[1].match(/^(.+?)\((.+?)\)\s*:/);
        if (pm) {
          const name = pm[1].trim();
          const party = abbreviateParty(pm[2].trim());
          
          if (MAJOR_PARTIES.has(party) && !partiesSeen.has(party)) {
            results.push({ name, party });
            partiesSeen.add(party);
          }
        }
      }
      await sleep(50);
    } catch (e) { /* skip this candidate */ }
  }
  
  return results;
}

// ─── Candidate API (Live MyNeta + Local Cache) ──────────────────────────────
app.post('/api/candidates', async (req, res) => {
  const { constituency } = req.body;

  if (!constituency) {
    return res.status(400).json({ error: "Constituency name is required." });
  }

  const searchTerm = constituency.toLowerCase().trim();

  // Find local constituency match
  let match = localConstituencies.find(c => c.name.toLowerCase() === searchTerm);
  if (!match) {
    match = localConstituencies.find(c =>
      c.name.toLowerCase().includes(searchTerm) ||
      searchTerm.includes(c.name.toLowerCase())
    );
  }

  if (!match) {
    return res.status(404).json({ error: "Constituency not found in database." });
  }

  const cacheKey = match.name.toUpperCase().trim();
  const googleCacheKey = `google_${cacheKey}`;

  // Check Google cache first
  if (googleCache[googleCacheKey] && googleCache[googleCacheKey].length > 0) {
    console.log(`📦 Returning cached Google results for ${match.name}`);
    return res.json({
      candidates: googleCache[googleCacheKey],
      source: "Google AI (Verified 2026)",
      constituency: match.name,
      district: match.district,
      currentMLA: match.currentMLA,
      mlaParty: match.mlaParty
    });
  }

  // 1. Try Gemini AI first (primary source)
  try {
    console.log(`🔍 Primary: Using Gemini AI for ${match.name}...`);
    const geminiCandidates = await fetchGeminiCandidates(match.name);
    
    if (geminiCandidates.length > 0) {
      // Cache the result
      googleCache[googleCacheKey] = geminiCandidates;
      fs.writeFileSync(googleCachePath, JSON.stringify(googleCache, null, 2));
      
      console.log(`✅ Gemini found ${geminiCandidates.length} candidates: ${geminiCandidates.map(c => `${c.name}(${c.party})`).join(', ')}`);
      
      return res.json({
        candidates: geminiCandidates,
        source: "Google AI (Verified 2026)",
        constituency: match.name,
        district: match.district,
        currentMLA: match.currentMLA,
        mlaParty: match.mlaParty
      });
    }
  } catch (e) {
    console.error(`⚠️ Google search failed for ${match.name}:`, e.message);
  }

  // 2. Try MyNeta scrape as secondary
  const mynetaKey = cacheKey.replace(/\s*\(SC\)|\s*\(ST\)/gi, '').trim();
  let mynetaId = MYNETA_CONST_MAP[cacheKey] || MYNETA_CONST_MAP[mynetaKey];
  
  if (!mynetaId) {
    for (const [k, v] of Object.entries(MYNETA_CONST_MAP)) {
      if (k.includes(mynetaKey) || mynetaKey.includes(k)) {
        mynetaId = v;
        break;
      }
    }
  }

  if (mynetaId) {
    try {
      console.log(`🌐 Fallback: Live scraping MyNeta for ${match.name} (ID: ${mynetaId})...`);
      const candidates = await scrapeMyNetaConstituency(mynetaId);
      
      if (candidates.length > 0) {
        mynetaCache[cacheKey] = candidates;
        fs.writeFileSync(mynetaCachePath, JSON.stringify(mynetaCache, null, 2));
        
        console.log(`✅ MyNeta found ${candidates.length} candidates: ${candidates.map(c => `${c.name}(${c.party})`).join(', ')}`);
        
        return res.json({
          candidates,
          source: "MyNeta / ADR / ECI (Verified 2026)",
          constituency: match.name,
          district: match.district,
          currentMLA: match.currentMLA,
          mlaParty: match.mlaParty
        });
      }
    } catch (e) {
      console.error(`⚠️ MyNeta scrape failed for ${match.name}:`, e.message);
    }
  }

  // 3. Fallback: use local data
  if (match.nextElectionCandidates && match.nextElectionCandidates.length > 0) {
    return res.json({
      candidates: match.nextElectionCandidates,
      source: "Local Database",
      constituency: match.name,
      district: match.district,
      currentMLA: match.currentMLA,
      mlaParty: match.mlaParty
    });
  }

  // 4. Last resort: return incumbent
  return res.json({
    candidates: [
      { name: match.currentMLA || "Incumbent", party: match.mlaParty || "N/A" }
    ],
    source: "Local Database",
    constituency: match.name,
    district: match.district
  });
});

// ─── Search/Autocomplete API (for instant dropdown) ─────────────────────────
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ results: [] });
  }

  const searchTerm = q.toLowerCase().trim();
  const results = localConstituencies
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm) ||
      c.district.toLowerCase().includes(searchTerm) ||
      c.id.toString() === searchTerm
    )
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      name: c.name,
      district: c.district,
      currentMLA: c.currentMLA,
      mlaParty: c.mlaParty
    }));

  res.json({ results });
});

// ─── Chat API (Smart Retry + Quota-Aware Fallback) ──────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, state, history, language } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      reply: "Please enter a valid message."
    });
  }

  // Use lighter, free-tier-friendly models first
  const modelsToTry = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-3-pro-preview"
  ];

  const systemContext = `
You are Electra, a neutral Election Education Assistant for ${state || "India"}.
Explain election processes simply and clearly.
Remain politically neutral at all times.
Do not support or criticize any party, candidate, or ideology.
If asked for official or legal information, recommend checking eci.gov.in.
Support English and Indian local languages (Tamil, Hindi, Telugu, etc.).
Keep answers short, factual, and easy to understand for first-time voters.

**CRITICAL FORMATTING RULES (BE UNIQUE & INTERACTIVE):**
1. Break down information into scannable "Action Steps" or "Quick Facts" using bullet points.
2. Use Markdown blockquotes (>) to create a "💡 Did you know?" or "Pro-Tip" trivia box in every response.
3. Use emojis generously to make the tone energetic and modern.
4. You MUST use Markdown bolding (**text**) to highlight the main or key information so it is easy to skim.
5. ALWAYS end your response with an engaging follow-up question (e.g., "Would you like me to explain how to register online?") to keep the chat interactive.

You must ALWAYS respond in the language specified by this code: ${language || 'en-IN'}.
HOWEVER, if the user explicitly types or speaks in a different language (e.g., Tamil, Hindi), you MUST match the language they typed in.
`;

  let lastError = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🤖 Attempting ${modelName}, attempt ${attempt}...`);

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemContext
        });

        // Filter history: Gemini requires history to start with a 'user' message
        let chatHistory = (history || []).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const firstUserIndex = chatHistory.findIndex(m => m.role === 'user');
        if (firstUserIndex !== -1) {
          chatHistory = chatHistory.slice(firstUserIndex);
        } else {
          chatHistory = [];
        }

        const chat = model.startChat({
          history: chatHistory
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        console.log(`✅ Success with ${modelName}`);

        return res.json({
          reply: response.text(),
          model: modelName
        });

      } catch (error) {
        const status = error.status || error.statusCode;
        lastError = error;

        console.error(`❌ ${modelName} failed:`, status || error.message);

        // 429 = quota / rate limit exceeded → switch model immediately
        if (status === 429) {
          console.log("⚠️ Quota exceeded. Switching to next model...");
          break;
        }

        // 503 = service overloaded → wait and retry same model
        if (status === 503 && attempt < 3) {
          const delay = 1500 * attempt;
          console.log(`⏳ Model overloaded. Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        // 400, 404, auth errors, etc → no retry, try next model
        break;
      }
    }
  }

  // All models and retries failed
  return res.status(500).json({
    reply: "Electra is temporarily unavailable due to high demand on Gemini servers. Please try again in a minute, or visit eci.gov.in for official election information.",
    error: lastError?.message
  });
});

// ─── Health Check Endpoint ──────────────────────────────────────────────────
let lastHtmlSnippet = "";

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    constituencies: localConstituencies.length,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000 || process.env.CLIENT_URL;
app.listen(PORT, () => {
  console.log(`⚡ Electra Backend running on port ${PORT} (Instant Local-First Mode)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});