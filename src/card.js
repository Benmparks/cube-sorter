import ManaCost from "./ManaCost.js";

//React component for our cards
function Card(props) {
	const cardClass = [props.colorIdentity, props.rarity];
	return <li className={cardClass.join(' ')}><span className="name">{props.cardName}</span><ManaCost manaCost={props.manaCost} /></li>;
}
export default Card;