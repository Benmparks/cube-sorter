fetch("ISD.json", {method: 'get'}).then(response => response.json())
	.then(jsonData => {
		console.log("Hello");
		const data = jsonData;
		console.log(data);
	}).catch(error => {
		console.log("Error!"); 
		console.log(error);
	})

function makePacks(setData) {
	console.log(setData);
	
	//Set up our card template from which we will build all our cards
	var Card = function(cardName, colors, colorIdentity, convertedManaCost, frameEffects, manaCost, manaValue, number, rarity, types) {
		this.cardName = cardName;
		this.colors = colors;
		this.colorIdentity = colorIdentity;
		this.convertedManaCost = convertedManaCost;
		this.frameEffects = frameEffects;
		this.manaCost = manaCost;
		this.manaValue = manaValue;
		this.number = number;
		this.rarity = rarity;
		this.types = types;
	}
	
	//Set up pack template from which we will build our packs
	
	var Pack = function(card) {
		this.card = card;
	}
	
	//"Box" of packs we will deliver at the end
	
	var Box = function(pack) {
		this.pack = pack;
	}
	
	function randomCard(array) {
		let i = (Math.random() * array.length);
		return array.splice(i, 1);
	}
	
	//Build every card from the list
	var cardSet = new Array();
	var cardList = setData.data.cards;
		
	for(let i = 0; i < cardList.length - 1; i++) {
		//sort out basic lands
		if(cardList[i].supertypes[0] != "Basic") {
			var card = new Card(
				colors = cardList[i].colors,
				colorIdentity = cardList[i].colorIdentity,
				convertedManaCost = cardList[i].convertedManaCost,
				frameEffects = cardList[i].frameEffects,
				manaCost = cardList[i].manaCost,
				manaValue = cardList[i].manaValue,
				name = cardList[i].name,
				number = cardList[i].number,
				rarity = cardList[i].rarity,
				types = cardList[i].types
			)
			cardSet.push(card);
		}
	}
		
	//build card pools these will be the arrays that we pull from when building packs
	//TODO: these are hard coded values for now, but let's make these to eventually be submittable values
	var numCubeSFCCommon = 3;
	var numCubeSFCUnCommon = 2;
	var numCubeSFCRareMythic = 1;
	var numCubeDFCCommon = 3;
	var numCubeDFCUnCommon = 2;
	var numCubeDFCRareMythic = 1;
	
	var cardPoolSFCCommon = new Array();
	var cardPoolSFCUnCommon = new Array();
	var cardPoolSFCRareMythic = new Array();
	var cardPoolDFC = new Array();
		
	for(let i = 0; i < cardSet.length -1; i++) {
		
		const card = cardSet[i];
		
		if(card.rarity == "common") {
			if(card.frameEffects == "sunmoondfc") {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeDFCCommon; i++) {
					cardPoolDFC.push(card);
				}
			} else {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <numCubeSFCCommon; i++) {
					cardPoolSFCCommon.push(card);
				}
			}
		}
		
		if (card.rarity == "uncommon") {
			if(card.frameEffects == "sunmoondfc") {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <  numCubeDFCUnCommon; i++) {
					cardPoolDFC.push(card);
				}
			} else {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeSFCUnCommon; i++) {
					cardPoolSFCUnCommon.push(card);
				}
			}
		}
		
		if (card.rarity == "rare" || card.rarity == "mythic") {
			if(card.frameEffects == "sunmoondfc") {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i <  numCubeDFCRareMythic; i++) {
					cardPoolDFC.push(card);
				}
			} else {
				//Since this is a common, add it to the pool three times
				for(let i = 0; i < numCubeSFCRareMythic; i++) {
					cardPoolSFCRareMythic.push(card);
				}
			}
		}
	}
	
	//Get the data about how the packs are built
	var boosterData = setData.data.booster.default.boosters[0].contents;
	var numCommons = boosterData.sfcCommon;
	var numUnCommons = boosterData.sfcUncommon;
	var numRareMythic = boosterData.sfcRareMythic;
	var numDFC = boosterData.dfc;
	
	//How many packs to make in the box
	//TODO: Will be hard coded value at first, but will make it an input
	var numPacks = 6;
	var box = new Array();
	
	for(let i=0; i < numPacks; i++) {
		pack = new Array();
		
		//pick our commons
		for(let i=0; i < numCommons; i++) {
			//TODO: Make sure that each of these are unique	 to it's pack
			pack.push(randomCard(cardPoolSFCCommon));
		}
		
		//pick our uncommons
		for(let i=0; i < numUnCommons; i++) {
			//TODO: Make sure that each is unique to it's pack
			pack.push(randomCard(cardPoolSFCUnCommon));
		}
		
		//pick our rare or mythic
		for(let i=0; i< numRareMythic; i++) {
			pack.push(randomCard(cardPoolSFCRareMythic));
		}
		
		//pick our double face card
		for(let i=0; i< numDFC; i++) {
			pack.push(randomCard(cardPoolDFC));
		}
		
		box.push(pack);
	}
	
	
	
	console.log(box);
	
}