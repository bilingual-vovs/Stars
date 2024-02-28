let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

let controlsData = {
    ITERATIONS: 5,
    ANGLE: 69,
    UPS: 60
}

class IdContainer {
    constructor (arr){
        this.data = arr
    }

    id(name){
        for (let key in this.data){
            if (this.data[key][0] == name){
                return this.data[key][1]
            }
        }
    }

    name(id){
        for (let key in this.data){
            if (this.data[key][1] == id){
                return this.data[key][0]
            }
        }
    }
}

let ID_TO_NAMES = new IdContainer([
    ['ANGLE', 'angle'],
    ['ITERATIONS', 'iterations'],
    ['UPS', 'ups']
])

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Line{
    constructor(a, b){
        this.start = a
        this.end = b
    }
    get length(){
        let {start, end} = this
        return Math.sqrt((start.x - end.x)*(start.x - end.x) + (start.y - end.y)* (start.y - end.y))
    }
    split = (n) => {
        let res = []
        let {start, end} = this
        for(let i = 0; i<n-1;i++){
            res.push(
                new Line(
                    new Point((start.x + (i/(n-i))*end.x)/(1+i/(n-i)),
                    (start.y + (i/(n-i))*end.y)/(1+i/(n-i))),
                    new Point((start.x + ((i+1)/(n-(i+1)))*end.x)/(1+(i+1)/(n-i-1)),
                    (start.y + ((i+1)/(n-(i+1)))*end.y)/(1+(i+1)/(n-i-1)))
                ))
        }
        res.push(
            new Line(
                res[n-2].end,
                end
            ))
        return res
    }

    get xDif(){
        return this.start.x - this.end.x
    }
    get yDif(){
        return this.start.y - this.end.y
    }

    get midPoint(){
        let {start, end} = this
        return new Point((start.x + end.x)/2, (start.y + end.y)/2)
    }

    get angle(){
        let {length, yDif,xDif} = this 
        return Math.atan(xDif/yDif) 
    }
    
    pointOfTriengle = (angle) => {
        let {start, midPoint, xDif, yDif} = this
        let rad = angle*(Math.PI/180)
        let height = Math.tan(rad)*start.distTo(midPoint)
        let point = new Point(midPoint.x + Math.sin(this.angle + (yDif < 0 ? 90*Math.PI/180 : -90*Math.PI/180))*height, midPoint.y + Math.cos(this.angle + (yDif < 0 ? 90*Math.PI/180 : -90*Math.PI/180))*height) 
        return point
    }

    draw = () => {
        let {start, end} = this
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        ctx.stroke();
    }

}

class Point{
    constructor(x, y){
        this.x = x
        this.y = y
    }
    lineTo = (b) => {
        return new Line(this, b)
    }

    distTo = (b) => {
        let a = this
        return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y) * (a.y - b.y))
    }
}


let lines = [new Line(new Point(400, 400), new Point(800, 400)), new Line(new Point(800, 400), new Point(600, 800)), new Line(new Point(600, 800), new Point(400, 400))]


const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(el => el.draw())
}

let interval

let startSim = () => {
    for(let i = 0; i<controlsData.ITERATIONS; i++){
        l = lines.length
        for(let j = 0; j < l;j++ ){
            let line = lines.shift()
            let newLines = line.split(3)
            newLines[1] = new Line(newLines[1].start, newLines[1].pointOfTriengle(controlsData.ANGLE))
            newLines.push(new Line(newLines[1].end, newLines[2].start))
            newLines.forEach(el => {
                lines.push(el)
            })
        }
    }
    interval = setInterval(update, 1000/controlsData.UPS)
} 

let restart = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = []
    clearInterval(interval)
    startSim()
}

let inputChange = (evt) => {

    controlsData[ID_TO_NAMES.name(evt.target.id)] = evt.target.value
    
    restart()
}

let controlsVisiability = false
const controls = () => {
    controlsVisiability = !controlsVisiability
    document.getElementById('controls').style.display = (controlsVisiability ? 'none' : 'block')
}

let inputs = document.getElementsByClassName("control-inp")

for (let key in inputs){
    let input = inputs[key]

    if (!input.id) continue
    input.value = controlsData[ID_TO_NAMES.name(input.id)]

    input.addEventListener('input', inputChange)
}

canvas.width = SPACE_SIZE_X()
canvas.height = SPACE_SIZE_Y()
addEventListener("resize", (evt) => {
    canvas.width = SPACE_SIZE_X()
    canvas.height = SPACE_SIZE_Y()
})  


addEventListener("keypress", (evt) => { 
    if (evt.code == 'KeyQ'){
        controls()
    }
})

document.getElementById('qoute-box').onclick = () => document.getElementById('qoute-box').style.display = 'none'

controls()


startSim()
