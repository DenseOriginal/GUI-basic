# DDD

Link til [programmet](https://htxprog.netlify.app/gui-basic/public/ "Programmet")

## DESIGN (D1)

### Flowchart af overordnet program

![DesignFlowChart](DesignFlowChart.png)

### Pseudo-kode af umiddelbare knap klasse og test implementation

```js
class knap () {
    constructor(x,y,w,h text) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
    }

    opdaterKnap() {
        rect(this.x,this.y,this.x+this.w,this.y+this.h);
        text(this.x,this.y,this.text)
    }
}

setup() {
    nyKnap = new knap(100,100,"hej");
}
draw() {
    nyKnap.opdaterKnap();
}
```

### Udviklings process
https://github.com/DenseOriginal/GUI-basic/projects/1
![Agile Scrum](agile-scrum.png)

## DOKUMENTATION (D2)

Flowchart der beskriver macro delen af hvordan vi tegner og opretter linjerne på skærmen.
![BrushStrokeFlowChart](BrushStrokeFlowChart.png)


### Funktions beskrivelse af button.isMouseOver()
button.isMouseOver tager to argumenter:
`width` og `height` som er bredden og højden af knappen
Funktionen bruger så henholdsvist musens x og y (`mouseX` og `mouseY`) til at kontrollere om musen befinder sig indenfor området med udgangspunkt i centrum.

Den returnerer resultatet af logikken som boolean
```ts
  private isMouseOver(width: number, height: number): boolean {
    return (
      mouseX > this.x - (width / 2) &&
      mouseX < this.x + (width / 2) &&
      mouseY > this.y - (height / 2) &&
      mouseY < this.y + (height / 2)
    );
  }
```
### Klasse diagram over knap klassen

```ts
class Button {
private _isClicked: boolean;
  public get isClicked(): boolean;
  private _isHovering: boolean;
  public get isHovering(): boolean;
  public onClick: Function;
  public onHover: Function;
  public onRelease: Function;
  public onPressed: Function;

  public paddingWidth: number;
  public paddingHeight: number;
  public textSize: number;
  public width: number;
  public height: number;

  constructor(
    public x: number,
    public y: number,
    public text?: string,
    public cornerRounding?: number,
    public backgroundColor?: Color,
    public hoverWeight?: number,
    public clickedColor?: Color,
    public textColor?: Color,
  ) { }

  public live(): void
  private draw(width: number, height: number, cornerRounding: number): void
  private isMouseOver(width: number, height: number): boolean
  
  private _onClick(): void
  private _onHover(): void
  private _onRelease(): void
  private _onPressed(): void
}
```

### Pseudo kode over hvordan man tegner linjer

```txt
Kør denne funktion hvert frame
    Tegn alle tidligere streger

    Hvis: Musen er trykket ned & Musen er indenfor tegne området
        Find den farve som stregen skal tegnes med
        
        Opret en midlertidigt streg, med den nuværende farve og tykkelse

    Hvis: Musen lige er blevet løftet
        Så skub den midlertidige streg til brushStrokes, så at den kan blive gemt

    Hvis: Musen er klikket & bliver trukket rundt på skærmen & Musen har    rykket sig mere end 2 pixels
        Tilføj musens punkt til den midlertige streg
```

## DELING (D3)

Link til sourcecode: [https://github.com/DenseOriginal/GUI-basic](https://github.com/DenseOriginal/GUI-basic)
![Agile Scrum](agile-scrum.png)
