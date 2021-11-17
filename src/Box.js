import {useEffect,useState} from 'react';
import "./functions.js";
import Pack from "./Pack.js";
import PackNumSelect from "./PackNumSelect.js";
import SetSelect from "./SetSelect.js";
import RemainingPacks from "./RemainingPacks.js";
import makePacks from "./functions.js";

function Box() {

	const [isLoaded, setIsLoaded] = useState(false);
	const [numSelect, setNumSelect] = useState(null);
	const [formSubmitted, setSubmitted] = useState(false);
	const [maxPacksReached, setMaxPacksReached] = useState(false);
	const [packs, setPacks] = useState([]);
	const setArr = ['./ALA.json', './RTR.json', 'ISD.json'];

	//Use the event hook to load our JSON on load
	useEffect(() => {
		let totalCardSets = [];
		Promise.all(
		setArr.map(url =>
			fetch(url, {method: 'get'})
			.then(response => response.json())
			.then(
				(result) => {
					totalCardSets.push({"setCode": result.data.code, "setName": result.data.mcmName});
					sessionStorage.setItem(result.data.code, JSON.stringify(result.data));
			}).catch(error => {
				console.log("Error!"); 
				console.log(error);
			})
		)).then(result => {
			sessionStorage.setItem('totalCardSets', JSON.stringify(totalCardSets));
			setIsLoaded(true);
		});
	})
	
	const submitPackNum = (event) => {
		event.preventDefault();
		sessionStorage.removeItem('box');
		makePacks(event.target.packNumSelect.value);
		setPacks(JSON.parse(sessionStorage.getItem('box')));
		setSubmitted(true);
		checkMaxPacks();

	}
	
	const handleSubmit = (event) => {
		event.preventDefault();
		makePacks(event.target.more.value);
		sessionStorage.removeItem('box');
		sessionStorage.removeItem('maxPacksCounter');
		checkMaxPacks();
	}
	
	const getCallBack = (boolean) => {
		setNumSelect(JSON.parse(sessionStorage.getItem('maxPacksCounter')));
	}
	
	const checkMaxPacks = () => {
		const maxPacks = parseInt(JSON.parse(sessionStorage.getItem('maxPacksCounter')));
		if(maxPacks === 0) {
			setMaxPacksReached(true);
		} else {
			setMaxPacksReached(false);
		}
	}
	
	const handleReset = (event) => {
		event.preventDefault();
		setNumSelect(0);
		setSubmitted(false);
		checkMaxPacks();
	}
	
	const handleSeeAll = (event) => {
		event.preventDefault();
		const maxPacks = parseInt(JSON.parse(sessionStorage.getItem('maxPacksCounter')));
		console.log(maxPacks);
		makePacks(maxPacks);
		setPacks(JSON.parse(sessionStorage.getItem('box')));
		checkMaxPacks();		
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
						<SetSelect callBack={getCallBack} />
						<PackNumSelect num={numSelect}/>
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
					<form name="morePacks" onSubmit={handleSubmit} className="packForm" id="packForm">
						<input type="hidden" name="more" id="more" value="3" />
						<button type="button" onClick={handleReset} name="reset" id="resetButton">Reset</button>
						<button type="button" onClick={handleSeeAll} name="seeAll" id="seeAll" disabled={maxPacksReached}>See All</button>						
						<button type="submit" name="submit" id="submit" disabled={maxPacksReached}>Make More!</button>
					</form>
					<RemainingPacks />
				</div>
			</div>
		)
	}
}

export default Box;