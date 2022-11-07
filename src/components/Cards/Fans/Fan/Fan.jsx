import React from "react";

import "./Fan.css";

const Fan = (props) => (
	<div className={props.classesL}>
		<span>{props.rank}</span>
		<span>{props.adress}</span>
		<span>{props.waves}</span>
	</div>
);

export default Fan;
