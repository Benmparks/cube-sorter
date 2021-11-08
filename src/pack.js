import React from 'react';

class Pack extends React.Component {
	useEffect(()=>{
		axios.get("./ISD.json")
		.then(response => {
			const data = response;
			console.log(data);
		}).catch(error => {
			console.log("Error!"); 
			console.log(error);
		}, [])
	});
	
	const [cardData,setCardData]=useState([]);
	const [packData,setPackData]=useState(
		Card: 
	);

	render() {
		return (
			<div className="pack">
				<Card data="cardData" />
			</div>
		);
	}
}