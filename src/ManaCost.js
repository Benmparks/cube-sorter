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

export default ManaCost;