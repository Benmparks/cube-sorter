import React from 'react';
import ReactDOM from 'react-dom';
import {useEffect,useState} from 'react';
import './style.css';
	
var sessionStorage = window.sessionStorage;

function makePools(setData) {
	
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
	
	//Save info about the boosters in the session so we have access to it later
	const boosterData = setData.data.booster.default.boosters[0].contents;
	sessionStorage.setItem('numCommons', boosterData.sfcCommon);
	sessionStorage.setItem('numUnCommons', boosterData.sfcUncommon);
	sessionStorage.setItem('numRareMythic', boosterData.sfcRareMythic);
	sessionStorage.setItem('numDFC', boosterData.dfc);

		
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
	
	console.log(typeof cardPoolSFCCommon);
	console.log(cardPoolSFCUnCommon);
	
	sessionStorage.setItem('cardPoolSFCCommon', JSON.stringify(cardPoolSFCCommon));
	sessionStorage.setItem('cardPoolSFCUnCommon', JSON.stringify(cardPoolSFCUnCommon));
	sessionStorage.setItem('cardPoolSFCRareMythic', JSON.stringify(cardPoolSFCRareMythic));
	sessionStorage.setItem('cardPoolDFC', JSON.stringify(cardPoolDFC));
}

function makePacks(num) {	
	//Get the data from session storage
	let cardPoolSFCCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCCommon'));
	let cardPoolSFCUnCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCUnCommon'));
	let cardPoolSFCRareMythic = JSON.parse(sessionStorage.getItem('cardPoolSFCRareMythic'));
	let cardPoolDFC = JSON.parse(sessionStorage.getItem('cardPoolDFC'));
	let numCommons = sessionStorage.getItem('numCommons');
	let numUnCommons = sessionStorage.getItem('numUnCommons');
	let numRareMythic = sessionStorage.getItem('numRareMythic');
	let numDFC = sessionStorage.getItem('numDFC');
	let box = JSON.parse(sessionStorage.getItem('box'));
	
	//How many packs to make in the box
	const numPacks = num;
			
	function randomCard(array) {
		let i = (Math.random() * array.length);
		return array.splice(i, 1);
	}
				
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
	
	sessionStorage.setItem('box', JSON.stringify(box));
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
	const [formSubmitted, setSubmitted] = useState(false);
	const [packs, setPacks] = useState([]);

	useEffect(() => {
		fetch("ISD.json", {method: 'get'})
		.then(response => response.json())
		.then(
			(result) => {
				makePools(result);
		}).then((result) => {
			 makePacks(6);
			 setIsLoaded(true);
			 console.log(JSON.parse(sessionStorage.getItem(('box'))));
			 setPacks(JSON.parse(sessionStorage.getItem('box')));
		}).catch(error => {
			console.log("Error!"); 
			console.log(error);
		})
	}, [])
	const handleClick = value => () => setSubmitted(value);
	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(event);
		makePacks(event.target.value);
		setPacks(JSON.parse(sessionStorage.getItem('box')));
	}
	
	if ((!isLoaded) && (!formSubmitted)) {
		return <div>Loading...</div>
	} else if (isLoaded && !formSubmitted) {
		return (
			<div className="box">
				<div className="form-container">
					<h1>MTG Cube Sorter</h1>
					<p>A tool to sort MTG set cubes into packs that will help to create a more retail pack like environment</p>
					
					<p>The reason I built this project is that I have a Magic the Gathering "cube" that I would like to get out now and then and use, but it requires some set up beforehad.</p>

					<p>If you're unfamiliar with the terminology, a "cube" is a collection of cards from collectible card games that you use to be able to repeatedly play limited formats. This may be "drafting" which involves passing around packs of cards around a table and you choosing one before passing it to your right or left, or "sealed" which involves you receiving a pool of 6 packs of 15 cards and building your deck from that. Most cubes are singleton, which means that it has one of each card, but this one is different in that it looks to emulate the environment of playing this format specificially.</p>

					<p>The problem that I ran into is that if I wanted to use my Innistrad cube it would require some amount of set up to best try to recreate an environment that would be like a retail experience, where you open sealed packs of cards. I wrote this script with the intention of being able to randomize my own packs while eventually being able to more replicate a more retail pack-like environment, such as there being no risk of duplicate cards in the pack.</p>
					
					<button onClick={handleClick(true)}>Let's go!</button>
				</div>
			</div>
		)
	} else {
		return(
			<div className="container">
				<div className="box">
					<div className="pack-set">
						{packs.map((pack, i) => <Pack data={pack} key={i} packId={i} />)}
					</div>
				</div>
				<div className="add-more">
					<form name="morePacks" onSubmit={handleSubmit}>
						<input type="hidden" name="more" id="more" value="2" />						
						<button>Make More!</button>
					</form>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Box />, document.getElementById("root"));