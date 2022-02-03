/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { addListener } from "process";
import { Button } from "./GUI/button";

let increaseButton: Button;

(window as any).setup = () => {
	createCanvas(1368, 722);

	background(255);

	increaseButton = new Button(width-35, +35, '+', 5);
	increaseButton.textSize = 24;

	increaseButton.onClick = () => console.log('increase brush size');
	increaseButton.onHover = () => console.log('onHover');
	increaseButton.onRelease = () => console.log('onRelease');
	increaseButton.onPressed = () => console.log('onPressed');
}

(window as any).draw = () => {

	push();
	fill(230);
	noStroke();
	rect(width-478,0,width, height);
	pop();

	increaseButton.live();
}
