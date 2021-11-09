import React from 'react';
import ReactDOM from 'react-dom';
import {useEffect,useState} from 'react';
import './style.css';
	
function makePacks(setData) {
	
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

	function randomCard(array) {
		let i = (Math.random() * array.length);
		return array.splice(i, 1);
	}
	
	//Build every card from the list
	var cardSet = [];
	var cardList = setData.data.cards;
		
	for(let i = 0; i < cardList.length - 1; i++) {
		//sort out basic lands
		if(cardList[i].supertypes[0] !== "Basic") {
			let newCard = new CardObj(cardList[i])
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
		
	for(let i = 0; i < cardSet.length -1; i++) {
		
		const card = cardSet[i];
		
		if(card.rarity === "common") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
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
		
		if (card.rarity === "uncommon") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
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
		
		if (card.rarity === "rare" || card.rarity === "mythic") {
			if(card.frameEffects == "sunmoondfc" && card.manaCost !== undefined) {
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
	const boosterData = setData.data.booster.default.boosters[0].contents;
	const numCommons = boosterData.sfcCommon;
	const numUnCommons = boosterData.sfcUncommon;
	const numRareMythic = boosterData.sfcRareMythic;
	const numDFC = boosterData.dfc;
	
	//How many packs to make in the box
	//TODO: Will be hard coded value at first, but will make it an input
	const numPacks = 6;
	var box = []
	
	for(let i=0; i < numPacks; i++) {
		let cardPack = [];
		
		//pick our commons
		for(let i=0; i < numCommons; i++) {
			//TODO: Make sure that each of these are unique	 to it's pack
			cardPack.push(randomCard(cardPoolSFCCommon));
		}
		
		//pick our uncommons
		for(let i=0; i < numUnCommons; i++) {
			//TODO: Make sure that each is unique to it's pack
			cardPack.push(randomCard(cardPoolSFCUnCommon));
		}
		
		//pick our rare or mythic
		for(let i=0; i< numRareMythic; i++) {
			cardPack.push(randomCard(cardPoolSFCRareMythic));
		}
		
		//pick our double face card
		for(let i=0; i< numDFC; i++) {
			cardPack.push(randomCard(cardPoolDFC));
		}
		
		box.push(cardPack);
	}
	
	return box;
}

function ManaCost(props) {
	
	const costs = String(props.manaCost).replace(/[{}]/g, " ").split(" ").filter(n => n);
	
	return costs.map((cost, i) => <span className={"mtgicons icon-" + cost} key={i}><span className="path1"></span><span className="path2"></span></span>);
}

//React component for our cards
function Card(props) {
	
	const cardClass = [props.colorIdentity, props.rarity];
	return <li className={cardClass.join(' ')}><span className="name">{props.cardName}</span><ManaCost manaCost={props.manaCost} /></li>;
}

//React component of our pack
function Pack(data, packId) {
	//TODO: Look up useReducer() and see if it's viable replacement for useState()
	//Receiving warning but it's functioning right now, could be more elegant
	const [cards, setCards] = useState([]);
	
	useEffect(() => {
		setCards(data.data);
	})
	
	return (
			<div className="pack">
				<h2>Pack {data.packId+1}</h2>
				<ul>
					{cards.map((card, i) => <Card cardName={card[0].cardName} colorIdentity={card[0].colorIdentity} rarity={card[0].rarity} manaCost={card[0].manaCost} key={i}/>)}
				</ul>
			</div>
	)
}

function Box() {

	const [isLoaded, setIsLoaded] = useState(false);
	const [packs, setPacks] = useState([]);

	useEffect(() => {
		fetch("ISD.json", {method: 'get'})
		.then(response => response.json())
		.then(
			(result) => {
				setIsLoaded(true);
				setPacks(makePacks(result));
		}).catch(error => {
			console.log("Error!"); 
			console.log(error);
		})
	}, [])
	
	if (!isLoaded) {
		return <div>Loading...</div>
	} else {
		return(
		<div className="box">
			<div className="pack-set">
				{packs.map((pack, i) => <Pack data={pack} key={i} packId={i} />)}
			</div>
		</div>
		)
	}
}

ReactDOM.render(<Box />, document.getElementById("root"));