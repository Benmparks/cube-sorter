import React from 'react';
import Card from "./Card.js";

//React component of our pack
function Pack(data, packId) {
	//TODO: Look up useReducer() and see if it's viable replacement for useState()
	//Receiving warning but it's functioning right now, could be more elegant
	const cards = data.data;
	
	return (
			<div className="pack">
				<h2>Pack {data.packId+1}</h2>
				<ul>
					{cards.map((card, i) => <Card cardName={card.cardName} colorIdentity={card.colorIdentity} rarity={card.rarity} manaCost={card.manaCost} key={i}/>)}
				</ul>
			</div>
	)
}

export default Pack;