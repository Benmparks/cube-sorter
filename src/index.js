import React from 'react';
import ReactDOM from 'react-dom';
import {useEffect,useState} from 'react';
import './style.css';

window.onload = function(){
	sessionStorage.clear();
}

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

function determineMaxPacks(isReset) {
	
	let cardPoolSFCCommon = [];
	let cardPoolSFCUnCommon = [];
	let cardPoolSFCRareMythic = [];
	let cardPoolDFC = [];
	let numCommons = sessionStorage.getItem('numCommons');
	let numUnCommons = sessionStorage.getItem('numUnCommons');
	let numRareMythic = sessionStorage.getItem('numRareMythic');
	let numDFC = sessionStorage.getItem('numDFC');
	let maxPacksArr = [];
	let maxPacks = 0;

	
	if(isReset) {
		cardPoolSFCCommon = JSON.parse(sessionStorage.getItem('originalCardPoolSFCCommon'));
		cardPoolSFCUnCommon = JSON.parse(sessionStorage.getItem('originalCardPoolSFCUnCommon'));
		cardPoolSFCRareMythic = JSON.parse(sessionStorage.getItem('originalCardPoolSFCRareMythic'));
		cardPoolDFC = JSON.parse(sessionStorage.getItem('originalCardPoolDFC'));
	} else {
		cardPoolSFCCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCCommon'));
		cardPoolSFCUnCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCUnCommon'));
		cardPoolSFCRareMythic = JSON.parse(sessionStorage.getItem('cardPoolSFCRareMythic'));
		cardPoolDFC = JSON.parse(sessionStorage.getItem('cardPoolDFC'));
	}
	
	maxPacksArr.push(Math.trunc(cardPoolSFCCommon.length/numCommons));
	maxPacksArr.push(Math.trunc(cardPoolSFCUnCommon.length/numUnCommons));
	maxPacksArr.push(Math.trunc(cardPoolSFCRareMythic.length/numRareMythic));
	if(numDFC === null) maxPacksArr.push(Math.trunc(cardPoolDFC.length/numDFC));
	maxPacks = Math.min.apply(Math, maxPacksArr);
	sessionStorage.setItem('maxPacksOriginal', JSON.stringify(maxPacks));
	sessionStorage.setItem('maxPacksCounter', JSON.stringify(maxPacks));
}

function makePacks(num, isReset) {	
	//Get the data from session storage
	let cardPoolSFCCommon = [];
	let cardPoolSFCUnCommon = [];
	let cardPoolSFCRareMythic = [];
	let cardPoolDFC = [];
	
	if(isReset) {
		cardPoolSFCCommon = JSON.parse(sessionStorage.getItem('originalCardPoolSFCCommon'));
		cardPoolSFCUnCommon = JSON.parse(sessionStorage.getItem('originalCardPoolSFCUnCommon'));
		cardPoolSFCRareMythic = JSON.parse(sessionStorage.getItem('originalCardPoolSFCRareMythic'));
		cardPoolDFC = JSON.parse(sessionStorage.getItem('originalCardPoolDFC'));
	} else {
		cardPoolSFCCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCCommon'));
		cardPoolSFCUnCommon = JSON.parse(sessionStorage.getItem('cardPoolSFCUnCommon'));
		cardPoolSFCRareMythic = JSON.parse(sessionStorage.getItem('cardPoolSFCRareMythic'));
		cardPoolDFC = JSON.parse(sessionStorage.getItem('cardPoolDFC'));
	}
	
	let maxPacks = 0;
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
	
	let box = [];
	if(sessionStorage.getItem('box') !== null) {
		box = JSON.parse(sessionStorage.getItem('box'));
	}
	
	//How many packs to make in the box
	if(maxPacks === 1) {
		var numPacks = 1;
	} else if(maxPacks === 0) {
		return false;
	} else {
		var numPacks = num;
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
		
		return uniqueCard;
		
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

function ManaCost(props) {

	function parseCost(cost) {
		switch(cost) {
			case 'G':
				return "Green";
			case 'R':
				return "Red";
			case 'U':
				return "Blue";
			case "W":
				return "White";
			case "B":
				return "Black";
			default:
				return cost;
		}
		
	}
	
	const costs = String(props.manaCost).replace(/[{}]/g, " ").split(" ").filter(n => n);
	return costs.map((cost, i) => <span className={"mtgicons icon-" + cost} key={i}><span className="visually-hidden">{parseCost(cost)}</span><span className="path1"></span><span className="path2"></span></span>);
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
					{cards.map((card, i) => <Card cardName={card.cardName} colorIdentity={card.colorIdentity} rarity={card.rarity} manaCost={card.manaCost} key={i}/>)}
				</ul>
			</div>
	)
}

function PackNumSelect() {
	
	const maxPacks = JSON.parse(sessionStorage.getItem('maxPacksCounter'));
	if(maxPacks > 0) {
		let minPacks = 1;
		let packSelect = Array(maxPacks).fill()
			.map(() => minPacks++);
		return (
			<div className="packSelect">
				<label htmlFor="packNumSelect">How many packs do you want to generate?</label>
				<select className="packNumSelect" id="packNumSelect">
					{packSelect.map((option, i) => <option value={option} key={i}>{option}</option>)} 
				</select>
			</div>
		)
	} else {
		return (
			<div className="packSelect">		
				<label htmlFor="packNumSelect">How many packs do you want to generate?</label>
				<select className="packNumSelect" id="packNumSelect" disabled>
				</select>
			</div>
		)
	}
}

function Box() {

	const [isLoaded, setIsLoaded] = useState(false);
	const [formSubmitted, setSubmitted] = useState(false);
	const [packs, setPacks] = useState([]);

	useEffect(() => {
		fetch("./ALA.json", {method: 'get'})
		.then(response => response.json())
		.then(
			(result) => {
				makePools(result);
				determineMaxPacks();
		}).then((result) => {
			 setIsLoaded(true);
		}).catch(error => {
			console.log("Error!"); 
			console.log(error);
		})
	}, [])
	
	const submitPackNum = (event) => {
		event.preventDefault();
		makePacks(event.target.packNumSelect.value, false);
		setPacks(JSON.parse(sessionStorage.getItem('box')));
		setSubmitted(true);
	}
	const handleSubmit = (event) => {
		event.preventDefault();
		makePacks(event.target.more.value, false);
		setPacks(JSON.parse(sessionStorage.getItem('box')));
		if(JSON.parse(sessionStorage.getItem('maxPacksCounter') == 0)) {
			document.getElementById('submit').disabled = true;
		}
	}
	
	const handleReset = (event) => {
		event.preventDefault();
		sessionStorage.removeItem('box');
		setSubmitted(false);
		document.getElementById('submit').disabled = false;
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
					
					<form name="selectSet" className="numPacks" onSubmit={submitPackNum}>
						<PackNumSelect />
						<button>Let's go!</button>
					</form>
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
					<form name="morePacks" onSubmit={handleSubmit} className="packForm">
						<input type="hidden" name="more" id="more" value="3" />
						<button type="button" onClick={handleReset} name="reset" id="resetButton">Reset</button>						
						<button type="submit" name="submit" id="submit">Make More!</button>
					</form>
					<span className="remaining">Remaining Packs: {JSON.parse(sessionStorage.getItem('maxPacksCounter'))}</span>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Box />, document.getElementById("root"));