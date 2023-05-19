// This will convert the items from the file with the format of 
// { "item1 + item2: product" } to {product: [item1, item2]} and then store 
// that in a file items.json

// Make sure to run file inside the scripts folder
// cd scripts && node items-map-generator.js

// const SOURCE_FILE_URL = "https://gist.githubusercontent.com/nojvek/90751f0ac3abe814bb0b00d5acb7cf00/raw/9b59d5bb928d4e8fce4ae6a52ab1ecdc54d3854e/Little%2520Alchemy%2520Cheats"
const SOURCE_FILE_URL = "http://localhost:8000/little-alchemy-cheats.json"
const DESTINATION_MAP_FILE = "../public/items-map.json"
const DESTINATION_LIST_FILE = "../public/items-list.json"

const fs = require('fs');

async function main() {
	const res = await fetch(SOURCE_FILE_URL)
	const src = await res.json()
	const items = {}
	const itemsList = new Set();
	for (const [key, value] of Object.entries(src)) {
		const source_items = key.split(" + ")
		// Adding items to map
		items[value] = source_items
		// Adding items to list
		itemsList.add(source_items[0])
		itemsList.add(source_items[1])
		itemsList.add(value)
	}
	try {
		fs.writeFileSync(DESTINATION_MAP_FILE, JSON.stringify(items))
	} catch (err) {
		console.error('Error while writing map file:', err)
	}
	try {
		fs.writeFileSync(DESTINATION_LIST_FILE, JSON.stringify(Array.from(itemsList)))
	} catch (err) {
		console.error('Error while writing list file:', err)
	}
	console.log("Done!")
}

main();