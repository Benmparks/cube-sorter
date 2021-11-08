import React,{useEffect,useState} from 'react';
import axios from 'axios';

const Card=()=> {

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

	return (
		<span className="colorIdentity rarity">Name</span>
	)
}

export default Card;