let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

let controlsData = {
    ITERATIONS: 5,
    ANGLE: 60,
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
    ['MAX_STAR_SIZE', 'star-size'],
    ['MAX_STAR_SPEED', 'star-speed'],
    ['CONNECTION_DISTANCE', 'connextion-dist'],
    ['LINE_THICKNESS_INDEX', 'line-thickness'],
    ['STARS_AMOUNT', 'star-amount'],
    ['UPS', 'ups']
])

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

lines = []

class KohaLine{

    constructor(a, b){
        this.a = a
        this.b = b
        this.l = Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1] - b[1])*(a[1] - b[1]))
        this.a3 = [(2*a[0]+b[0])/3, (2*a[1]+b[1])/3]
        this.b3 = [(2*b[0]+a[0])/3, (2*b[1]+a[1])/3]
        lines.push(this)
    }

    generateKoha = () => {
        new KohaLine(this.a3, [this.a3[0] +  this.l/3 * Math.sin(controlsData.ANGLE*Math.PI/180), this.a3[1] -  this.l * Math.cos(controlsData.ANGLE*Math.PI/180)])
        console.log([this.a3[0] +  this.l/3 * Math.sin(controlsData.ANGLE*Math.PI/180), this.a3[1] -  this.l * Math.cos(controlsData.ANGLE*Math.PI/180)])
        new KohaLine([this.a3[0] +  this.l/3 * Math.sin(controlsData.ANGLE*Math.PI/180), this.a3[1] -  this.l * Math.cos(controlsData.ANGLE*Math.PI/180)], this.b3)
    }


    draw = () => {
        let {a, b} = this
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);

        ctx.stroke();
    }
}


const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        line.draw()
    });
}

let interval

let startSim = () => {
    new KohaLine([100,500], [400, 500])
    for (let i = 0; i<5; i++){
        console.log(lines.length)
        for(let x = lines.lenght; x>=0;x--){
            lines[x].generateKoha()
        }
    }
    
    console.log(lines)
    interval = setInterval(update, 1000/controlsData.UPS)
}

mouse = {x:0, y:0}

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

let move = (evt) => {
    mouse.x = evt.layerX
    mouse.y = evt.layerY
}

let out = () => {

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
canvas.onmousemove = move
canvas.onmouseout = out

startSim()
