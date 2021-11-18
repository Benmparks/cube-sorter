import {makePools, determineMaxPacks} from "./functions.js";
import {useEffect} from 'react';

function SetSelect(props) {
	const cardSets = JSON.parse(sessionStorage.getItem('totalCardSets'));
	
	const handleChange = (event) => {
		console.log(event.target.value);
		
		let emptyOption = document.getElementById("emptyOption");
		
		if(emptyOption !== null) {
			emptyOption.remove();
		}
		
		determineMaxPacks();
		props.callBack();
	}
	
	useEffect(() => {
		makePools(JSON.parse(sessionStorage.getItem(document.getElementById("cardSetSelect").value)));
		determineMaxPacks();
		props.callBack();
	})
		
	if(cardSets !== null) {
		return (
			<div className="setSelect">
				<label htmlFor="cardSetSelect">What set do you want to make packs for?</label>
				<select className="cardSetSelect" id="cardSetSelect" onChange={handleChange}>
					{cardSets.map((cardSet, i) => <option value={cardSet.setCode} key={i}>{cardSet.setName}</option>)}
				</select>
			</div>
		)
	} else {
		return (
			<div className="cardSetSelect">
				No sets to load
			</div>
		)
	}
}

export default SetSelect;