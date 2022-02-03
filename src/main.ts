/// <reference path="../node_modules/@types/p5/global.d.ts"/>

import { Button } from "./GUI/button";

let button: Button;

(window as any).setup = () => {
	createCanvas(windowWidth, windowHeight);

	background(255);

	button = new Button(100, 100, 'Hello');
	button.textSize = 24;

	button.onClick = () => console.log('onClick');
	button.onHover = () => console.log('onHover');
	button.onRelease = () => console.log('onRelease');
	button.onPressed = () => console.log('onPressed');
}

(window as any).draw = () => {

	rect(width-100,0,width, height);
	button.live();
}
