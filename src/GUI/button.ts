import { Color } from "p5";

export class Button {
  private _isClicked: boolean = false;
  public get isClicked(): boolean { return this._isClicked };
  private _isHovering: boolean = false;
  public get isHovering(): boolean { return this._isHovering };
  public onClick: Function = () => {};
  public onHover: Function = () => {};
  public onRelease: Function = () => {};
  public onPressed: Function = () => {};

  public paddingWidth = 8;
  public paddingHeight = 4;
  public textSize = 12;
  public width: number = 0;
  public height: number = 0;

  constructor(
    public x: number,
    public y: number,
    public text: string = "",
    public cornerRounding: number = 0,
    public backgroundColor: Color = color(175),
    public hoverWeight: number = 0.1,
    public clickedColor: Color = color(200),
    public textColor: Color = color(0),
  ) { }

  public live(): void {
    push();
    textSize(this.textSize);
    const width = this.width || textWidth(this.text) + this.paddingWidth * 2;
    const height = this.height || (max(textAscent(), textDescent()) * 0.5 + this.paddingHeight) * 2;
    pop();

    const tempIsMouseHovering = this.isMouseOver(width, height);
    const tempIsClicked = tempIsMouseHovering && mouseIsPressed;
    
    // Button has just been clicked
    if(!this.isClicked && tempIsClicked) {
      this._onClick();
    }

    // Button has just been released
    if(this.isClicked && !tempIsClicked) {
      this._onRelease();
    }

    // Mouse hover and not clicked
    if(tempIsMouseHovering && !mouseIsPressed) {
      this._onHover();
    }

    // Mouse is pressed
    if(tempIsClicked) {
      this._onPressed();
    }

    this._isClicked = tempIsClicked;
    this._isHovering = tempIsMouseHovering;
    this.draw(width, height, this.cornerRounding);
  }

  private draw(width: number, height: number, cornerRounding: number): void {
    push();

    translate(this.x, this.y);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(this.textSize);

    noStroke();

    fill(this.isClicked ? lerpColor(this.backgroundColor,this.clickedColor, 0.4) : (this.isHovering ? lerpColor(this.backgroundColor,color(0), this.hoverWeight) : this.backgroundColor));

    rect(0, 0, width, height,this.cornerRounding);

    fill(this.textColor);
    text(this.text, 0, 0);

    pop();
  }

  private isMouseOver(width: number, height: number): boolean {
    return (
      mouseX > this.x - (width / 2) &&
      mouseX < this.x + (width / 2) &&
      mouseY > this.y - (height / 2) &&
      mouseY < this.y + (height / 2)
    );
  }

  private _onClick() {
    this.onClick();
  }

  private _onHover() {
    this.onHover();
  }

  private _onRelease() {
    this.onRelease();
  }

  private _onPressed() {
    this.onPressed();
  }
}