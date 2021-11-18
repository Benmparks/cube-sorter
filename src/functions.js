//This function doesn't get exported, so we're going to separate them
function getPools() {
	let cardPools = [];

	cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCCommon')));
	cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCUnCommon')));
	cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolSFCRareMythic')));
	cardPools.push(JSON.parse(sessionStorage.getItem('cardPoolDFC')));
	
	return cardPools;
}

//Functions that get exported
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
	maxPacksArr.push(Math.trunc(cardPools[1].length/numUnCommons));
	maxPacksArr.push(Math.trunc(cardPools[2].length/numRareMythic));
	if(numDFC === null) maxPacksArr.push(Math.trunc(cardPools[3].length/numDFC));
	maxPacks = Math.min.apply(Math, maxPacksArr);
	sessionStorage.setItem('maxPacksOriginal', JSON.stringify(maxPacks));
	sessionStorage.setItem('maxPacksCounter', JSON.stringify(maxPacks));
}

export default function makePacks(num) {	
	
	//get our pools from session
	let cardPools = getPools();
	
	//retrieve the card pools based on rarity
	let cardPoolSFCCommon = cardPools[0];
	let cardPoolSFCUnCommon = cardPools[1];
	let cardPoolSFCRareMythic = cardPools[2];
	let cardPoolDFC = cardPools[3];
	
	//Retrieve other variables we will need from storage
	let maxPacks = JSON.parse(sessionStorage.getItem('maxPacksCounter'));;
	let numPacks = 0;
	let numCommons = sessionStorage.getItem('numCommons');
	let numUnCommons = sessionStorage.getItem('numUnCommons');
	let numRareMythic = sessionStorage.getItem('numRareMythic');
	let numDFC = sessionStorage.getItem('numDFC');
	
	if(maxPacks === 0) {
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
		//we use a set because that doesn't allow duplicates
		let uniqueCards = new Set();
		let uniqueCard;
		let unique = false;
		
		const hasDuplicates = (card) => {
			//If this returns as "false" it is true that is a duplicate card
			//Yes, I know that's backwards but it does the thing
			//We achieve this by checking the size of the set before a card is attempted to add, 
			//and if they are equal we know that we were not able to add a unique card to the set
			return uniqueCards.size === uniqueCards.add(card.cardName).size;
		}
		
		//We need to compare all the cards that are already in the pack to to see if what
		//we want to add is unique
		for (let card of pack) {
			uniqueCards.add(card.cardName);
		}

		//Perform this loop while the card is not unique.  We make a random number, then pull
		//that number from the "pool" array.
		do {
			let random = Math.trunc(getRandom());
			let card = pool[random];
			
			//Another reminder that if hasDuplicate() returns true, then that's bad
			//we want it to return false
			if(!hasDuplicates(card)) {
				//splice the card from the pool so it's removed permanently
				pool.splice(random, 1);
				uniqueCard = card;
				unique = true;
			}
			
		} while (!unique);
		
		return 	uniqueCard;
		
	}
	
	//Finally it is time to make our packs!	
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
	
	//Update the pools in the session so when we go back to more make more we are working
	//from the correct pools that have already had the correct cards removed.  We are also updating
	//pack counter so it can be displayed correctly
	sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
	sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));	
	sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
	sessionStorage.setItem('cardPoolDFC', JSON.stringify(cardPoolDFC));
	sessionStorage.setItem('maxPacksCounter', JSON.stringify(maxPacks - numPacks));	
	sessionStorage.setItem('box', JSON.stringify(box));
}

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
		const power = data.power;
		const rarity = data.rarity;
		const text = data.text;
		const toughness = data.toughness;
		const type = data.type;
		const types = data.types;
		return {cardName, colors, colorIdentity, convertedManaCost, frameEffects, manaCost, manaValue, number, power, rarity, text, toughness, type, types};
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
	//when building a cube like this you are making some of your own randomization efforts by including
	//a set number of commons, uncommons, and rare/mythic rare cards.  This math is roughly based on
	//how a MTG sheet of cards is printed before being cut.
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
	
	
	//Big loop to build our common, uncommon, and rare/mythic pools
	//For each card we check if it's a single face card or double faced card
	//We achieve this by looking for the "sunmoondfc" type which denotes whether it is a DFC or not
	//If it IS a double faced we only want ones with a mana cost, which will be undefined, because
	//otherwise it is the "transformed" side of the double faced card.  Our DFC pools would be
	//doubled up otherwise
	for(let i = 0; i < cardSet.length -1; i++) {
		
		const card = cardSet[i];
		
		//Build the common pool
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
		
		//Build the uncommon pool
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
		
		//Build the rare/mythic pool
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
	
	
	//We need to determine whether or not there are double faced cards because it means
	//that in our JSON data the cards have a different name are called different things.
	if(boosterData.dfc != null) {
		sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('cardPoolDFC', JSON.stringify(cardPoolDFC));
	} else {
		sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
		sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
		sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
		sessionStorage.setItem('cardPoolDFC', null);
	}
}

