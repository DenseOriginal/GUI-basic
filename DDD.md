# DDD

## DESIGN (D1)
### Flowchart af overordnet program
![](DesignFlowChart.png)

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
![](agile-scrum.png)
## DOKUMENTATION (D2)



## DELING (D3)
![](agile-scrum.png)