import fs from 'fs';
import * as cheerio from 'cheerio';

async function scrapeRealData() {
  try {
    const response = await fetch('https://en.wikipedia.org/wiki/2021_Tamil_Nadu_Legislative_Assembly_election');
    const html = await response.text();
    const $ = cheerio.load(html);

    let targetTable = null;
    $('table.wikitable').each((i, table) => {
      const headers = $(table).find('th').map((i, el) => $(el).text().trim().replace(/\n/g, ' ')).get();
      if (headers.join('').includes('Winner') && headers.join('').includes('Runner Up')) {
        targetTable = table;
      }
    });

    if (!targetTable) {
      console.error('Target table not found!');
      return;
    }

    const constituencies = [];
    let currentDistrict = '';

    $(targetTable).find('tr').each((i, tr) => {
      const cells = $(tr).find('td, th');
      
      // Check if it's a district header row (usually 1 cell with 'District')
      if (cells.length === 1 && $(cells[0]).text().includes('District')) {
        currentDistrict = $(cells[0]).text().replace('District', '').trim();
        return;
      }

      const row = cells.map((_, el) => $(el).text().trim().replace(/\n/g, ' ')).get();
      
      // Check if it's a data row (Col 0 should be a number)
      const id = parseInt(row[0]);
      if (!isNaN(id) && row.length >= 11) {
        const name = row[1];
        const winnerName = row[3];
        const winnerParty = row[5];
        const runnerUpName = row[8];
        const runnerUpParty = row[10];

        if (winnerName && winnerParty && runnerUpName && runnerUpParty) {
          constituencies.push({
            id: String(id),
            name: name,
            district: currentDistrict || 'Tamil Nadu',
            currentMLA: winnerName,
            mlaParty: winnerParty,
            nextElectionCandidates: [
              { name: winnerName, party: winnerParty },
              { name: runnerUpName, party: runnerUpParty }
            ],
            totalVoters: '2,50,000+ (Est.)',
            guide: `This is constituency number ${id} located in ${currentDistrict || 'Tamil Nadu'}. Polling procedures follow standard ECI guidelines.`
          });
        }
      }
    });

    if (constituencies.length > 0) {
      fs.writeFileSync('../client/src/data/tnConstituencies.json', JSON.stringify(constituencies, null, 2));
      console.log(`Successfully saved ${constituencies.length} constituencies with REAL names and parties.`);
    } else {
      console.error('No constituencies found!');
    }

  } catch (error) {
    console.error('Scrape error:', error);
  }
}

scrapeRealData();
