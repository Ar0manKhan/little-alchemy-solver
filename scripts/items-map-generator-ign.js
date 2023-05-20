const SRC_URL = "https://www.ign.com/wikis/little-alchemy-2/Little_Alchemy_2_Cheats_-_List_of_All_Combinations"
const DESTINATION_MAP_FILE = "../public/items-map.json"
const DESTINATION_LIST_FILE = "../public/items-list.json"

const fs = require('fs');
const cheerio = require('cheerio');

async function main() {
	const res = await fetch(SRC_URL)
	const html = await res.text()
	console.log('[LOADED] html')
	const $ = cheerio.load(html)

	const items = {}
	const itemsList = new Set();

	const tableRows = $('table:eq(1) tbody tr').has('td')
	tableRows.each((i, el) => {
		const e = $(el);
		const heading = e.find('th').text().trim().toLowerCase();
		const data = e.find('td').text().trim().toLowerCase();
		const combinations = data.split(' / ')
		const combinationList = combinations.map(comb => {
			const [a, b] = comb.split(' + ')
			itemsList.add(a);
			itemsList.add(b);
			itemsList.add(heading.toLowerCase());
			return [a, b];
		})
		items[heading] = combinationList;
	})
	console.log("[GENERATED]", "List and Map");
	try {
		fs.writeFileSync(DESTINATION_MAP_FILE, JSON.stringify(items))
		console.log("[WRITTEN]", "Map file");
	} catch (err) {
		console.error('Error while writing map file:', err)
	}
	try {
		fs.writeFileSync(DESTINATION_LIST_FILE, JSON.stringify(Array.from(itemsList)))
		console.log("[WRITTEN]", "List file");
	} catch (err) {
		console.error('Error while writing list file:', err)
	}
	console.log("[FINISHED]")
}

main();