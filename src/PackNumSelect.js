function PackNumSelect(props) {
	let maxPacks = 	props.num;
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

export default PackNumSelect;