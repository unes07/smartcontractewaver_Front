import React from "react";

import Spinner from "../UI/Spinner/Spinner";
import Fans from "./Fans/Fans"
import "./Cards.css";

const Cards = (props) => {

	let waveadresses = [];
	props.allWaves.map(wave => {
		waveadresses.push(wave.address);
		return waveadresses;
	});
	console.log(waveadresses)

	let fans = waveadresses.reduce((acc, curr) => {
		return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
	}, {});
	console.log("Fans:", fans);

	function maxValues(o, n) {
		// Get object values and sort descending
		const values = Object.values(o).sort((a, b) => b - a);
		
		// Check if more values exist than number required
		if (values.length <= n) return o;
		
		// Find nth maximum value
		const maxN = values[n - 1];
		
		// Filter object to return only key/value pairs where value >= maxN
		return Object.entries(o)
			.reduce((o, [k, v]) => v >= maxN ? { ...o, [k]: v } : o, {});
	}

	const top = maxValues(fans, 3);
	console.log(top)

	return (
		<div className="Cards">
			<div className="Card">
				<Fans topFans ={top} />
			</div>
			<div className="Card">
				<h3>Nbr. Waves</h3>
				{props.loading ? <Spinner /> : <h1>{props.allWaves.length}</h1>}
			</div>
		</div>
	)
}


export default Cards;
