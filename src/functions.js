var isReset = false;

export function makePools(setData) {

//Set up our card template from which we will build all our cards
	//Card JavaScript object
	const CardObj = function(data) {
		const cardName = data.name;
		const colors = data.colors;
		const colorIdentity = String(data.colorIdentity).replaceAll(',','');
		const convertedManaCost = data.convertedManaCost;
		const frameEffects = data.frameEffects;
		const manaCost = data.manaCost;
		const manaValue = data.manaValue;
		const number = data.number;
		const rarity = data.rarity;
		const types = data.types;
		return {cardName, colors, colorIdentity, convertedManaCost, frameEffects, manaCost, manaValue, number, rarity, types};
	}
	
	//Build every card from the list
	var cardSet = [];
	var cardList = setData.cards;
		
	for(let i = 0; i < cardList.length - 1; i++) {
		//sort out basic lands
		if(cardList[i].supertypes[0] !== "Basic") {
			let newCard = new CardObj(cardList[i]);
			cardSet.push(newCard);
		}
	}
			
	//build card pools these will be the arrays that we pull from when building packs
	//TODO: these are hard coded values for now, but let's make these to eventually be submittable values
	const numCubeSFCCommon = 3;
	const numCubeSFCUnCommon = 2;
	const numCubeSFCRareMythic = 1;
	const numCubeDFCCommon = 3;
	const numCubeDFCUnCommon = 2;
	const numCubeDFCRareMythic = 1;
	
	let cardPoolSFCCommon = [];
	let cardPoolSFCUnCommon = [];
	let cardPoolSFCRareMythic = [];
	let cardPoolDFC = [];
	
	//Save info about the boosters in the session so we have access to it later
	const boosterData = setData.booster.default.boosters[0].contents;
	if(boosterData.dfc != null) {
		sessionStorage.setItem('numCommons', boosterData.sfcCommon);
		sessionStorage.setItem('numUnCommons', boosterData.sfcUncommon);
		sessionStorage.setItem('numRareMythic', boosterData.sfcRareMythic);
		sessionStorage.setItem('numDFC', boosterData.dfc);
	} else {
		sessionStorage.setItem('numCommons', boosterData.common);
		sessionStorage.setItem('numUnCommons', boosterData.uncommon);
		sessionStorage.setItem('numRareMythic', boosterData.rareMythic);
		sessionStorage.setItem('numDFC', null);
	}
		
	for(let i = 0; i < cardSet.length -1; i++) {
		
		const card = cardSet[i];
		
		if(card.rarity === "common") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeDFCCommon; i++) {
					cardPoolDFC.push(card);
				}
			} else if (card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <numCubeSFCCommon; i++) {
					cardPoolSFCCommon.push(card);
				}
			}
		}
		
		if (card.rarity === "uncommon") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <  numCubeDFCUnCommon; i++) {
					cardPoolDFC.push(card);
				}
			} else if (card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeSFCUnCommon; i++) {
					cardPoolSFCUnCommon.push(card);
				}
			}
		}
		
		if (card.rarity === "rare" || card.rarity === "mythic") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <  numCubeDFCRareMythic; i++) {
					cardPoolDFC.push(card);
				}
			} else if (card.manaCost !== undefined) {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeSFCRareMythic; i++) {
					cardPoolSFCRareMythic.push(card);
				}
			}
		}
	}
	
	if(boosterData.dfc != null) {
		sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('cardPoolDFC', JSON.stringify(cardPoolDFC));
		sessionStorage.setItem('originalCardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('originalCardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('originalCardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('originalCardPoolDFC', JSON.stringify(cardPoolDFC));
	} else {
		sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('cardPoolDFC', null);
		sessionStorage.setItem('originalCardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('originalCardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('originalCardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('originalCardPoolDFC', null);
	}
}

export function getPools() {
	let cardPools = [];
	
	if(isReset) {
		cardPools.push(JSON.parse(sessionStorage.getItem('originalCardPoolSFCCommon')));
		cardPools.push(JSON.parse(sessionStorage.getItem('originalCardPoolSFCUnCommon')));
		cardPools.push(JSON.parse(sessionStorage.getItem('originalCardPoolSFCRareMythic')));
		cardPools.push(JSON.parse(sessionStorage.getItem('originalCardPoolDFC')));
	} else {
		cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCCommon')));
		cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCUnCommon')));
		cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCRareMythic')));
		cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolDFC')));
	}
	
	return cardPools;
}

export function determineMaxPacks() {
	
	let numCommons = sessionStorage.getItem('numCommons');
	let numUnCommons = sessionStorage.getItem('numUnCommons');
	let numRareMythic = sessionStorage.getItem('numRareMythic');
	let numDFC = sessionStorage.getItem('numDFC');
	let maxPacksArr = [];
	let maxPacks = 0;

	//get our pools from session
	let cardPools = getPools();
	
	maxPacksArr.push(Math.trunc(cardPools[0].length/numCommons));
	maxPacksArr.push(Math.trunc(cardPools[1]./*cardPoolSFCUnCommon.*/length/numUnCommons));
	maxPacksArr.push(Math.trunc(cardPools[2]./*cardPoolSFCRareMythic.*/length/numRareMythic));
	if(numDFC === null) maxPacksArr.push(Math.trunc(cardPools[3]./*cardPoolDFC.*/length/numDFC));
	maxPacks = Math.min.apply(Math, maxPacksArr);
	sessionStorage.setItem('maxPacksOriginal', JSON.stringify(maxPacks));
	sessionStorage.setItem('maxPacksCounter', JSON.stringify(maxPacks));
}

export default function makePacks(num) {	
	
	//get our pools from session
	let cardPools = getPools();
	
	let cardPoolSFCCommon = cardPools[0];
	let cardPoolSFCUnCommon = cardPools[1];
	let cardPoolSFCRareMythic = cardPools[2];
	let cardPoolDFC = cardPools[3];
	
	let maxPacks = 0;
	let numPacks = 0;
	let numCommons = sessionStorage.getItem('numCommons');
	let numUnCommons = sessionStorage.getItem('numUnCommons');
	let numRareMythic = sessionStorage.getItem('numRareMythic');
	let numDFC = sessionStorage.getItem('numDFC');
	
	//Determine max number of packs
	//Maximum number of packs possible
	if(isReset === true) {
		maxPacks = sessionStorage.getItem('maxPacksOriginal');
	} else {
		maxPacks = JSON.parse(sessionStorage.getItem('maxPacksCounter'));
	}
	
	if(maxPacks === 1) {
		numPacks = 1;
	} else if(maxPacks === 0) {
		return false;
	} else if(maxPacks < num) {
		numPacks = maxPacks;
	} else {
		numPacks = num;
	}
	
	let box = [];
	if(sessionStorage.getItem('box') !== null) {
		box = JSON.parse(sessionStorage.getItem('box'));
	}
	
	//Function that pulls a random card	
	function randomCard(pool, pack) {
		const getRandom = () => (Math.random() * pool.length);
		let uniqueCards = new Set();
		let uniqueCard;
		let unique = false;
		
		const hasDuplicates = (card) => {
			return uniqueCards.size === uniqueCards.add(card.cardName).size;
		}
		
		for (let card of pack) {
			uniqueCards.add(card.cardName);
		}

		do {
			let random = Math.trunc(getRandom());
			let card = pool[random];
			
			if(!hasDuplicates(card)) {
				pool.splice(random, 1);
				uniqueCard = card;
				unique = true;
			}
			
		} while (!unique);
		
		return 	uniqueCard;
		
	}
	
	//Process the packs			
	for(let i=0; i < numPacks; i++) {
		let cardPack = [];
		
		//pick our commons
		for(let i=0; i < numCommons; i++) {
			cardPack.push(randomCard(cardPoolSFCCommon, cardPack));
		}
		
		//pick our uncommons
		for(let i=0; i < numUnCommons; i++) {
			cardPack.push(randomCard(cardPoolSFCUnCommon, cardPack));
		}
		
		//pick our rare or mythic
		for(let i=0; i< numRareMythic; i++) {
			cardPack.push(randomCard(cardPoolSFCRareMythic, cardPack));
		}
		
		//pick our double face card
		for(let i=0; i< numDFC; i++) {
			cardPack.push(randomCard(cardPoolDFC, cardPack));
		}
		
		box.push(cardPack);
	}
	
	//Update the pools in the session
	sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
	sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));	
	sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
	sessionStorage.setItem('cardPoolDFC', JSON.stringify(cardPoolDFC));
	sessionStorage.setItem('maxPacksCounter', JSON.stringify(maxPacks - numPacks));	
	sessionStorage.setItem('box', JSON.stringify(box));
}