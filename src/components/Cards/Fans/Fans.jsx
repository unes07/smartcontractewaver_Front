import React from "react";

import Fan from "./Fan/Fan"
// import "./Fans.css";

const Fans = (props) => (
	<div className="Fans">
		<Fan 
			classesL="Fan tabh"
			rank="Rank"
			adress="Waver Adresse"
			waves="Waves" 
		/>

		<Fan
			classesL="Fan"
			rank="1"
			adress={Object.keys(props.topFans)[0] === undefined ?
			'Be a top waver' : Object.keys(props.topFans)[0].substring(0,25) + '...'}
			waves={Object.keys(props.topFans)[0] === undefined ? 0 : props.topFans[Object.keys(props.topFans)[0]]}
		/>

		<Fan
			classesL="Fan"
			rank="2"
			adress={Object.keys(props.topFans)[1] === undefined ?
			'Be a top waver' : Object.keys(props.topFans)[0].substring(0,25) + '...'}
			waves={Object.keys(props.topFans)[1] === undefined ? 0 :props.topFans[Object.keys(props.topFans)[1]]}
		/>

		<Fan
			classesL="Fan"
			rank="3"
			adress={Object.keys(props.topFans)[2] === undefined ?
			'Be a top waver' : Object.keys(props.topFans)[0].substring(0,25) + '...'}
			waves={Object.keys(props.topFans)[2] === undefined ? 0 : props.topFans[Object.keys(props.topFans)[2]]}
		/>

		<Fan />
	</div>
);

export default Fans;
