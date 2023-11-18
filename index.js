let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

let controlsData = {
    MAX_STAR_SIZE: 3,
    MAX_STAR_SPEED: 100,
    CONNECTION_DISTANCE: 200,
    LINE_THICKNESS_INDEX: 3,
    STARS_AMOUNT: 80,
    UPS: 30
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

class Star{
    posX = Math.floor(Math.random()*SPACE_SIZE_X())
    posY = Math.floor(Math.random()*SPACE_SIZE_Y())
    size = 1 + Math.floor(Math.random()*controlsData.MAX_STAR_SIZE)
    color = `rgba(256, 256, 256, ${50 + Math.floor(Math.random()*50)})`
    speedX = controlsData.MAX_STAR_SPEED/2 - Math.random()*controlsData.MAX_STAR_SPEED
    speedY = controlsData.MAX_STAR_SPEED/2 - Math.random()*controlsData.MAX_STAR_SPEED

    lineDist = controlsData.CONNECTION_DISTANCE
    lineThicknessInd = controlsData.LINE_THICKNESS_INDEX

    ups = controlsData.UPS

    constructor(){
        
    }

    move = () => {
        this.posX += this.speedX/this.ups
        this.posY += this.speedY/this.ups
        if (this.posX > SPACE_SIZE_X() || this.posX < 0){
            this.speedX = 0-this.speedX
        }
        if (this.posY > SPACE_SIZE_Y() || this.posY < 0){
            this.speedY = 0-this.speedY
        }
    }

    connectTo = (x, y, dist) => {
        ctx.beginPath()
        ctx.moveTo(this.posX, this.posY)
        ctx.lineTo(x, y)
        ctx.lineWidth = this.lineThicknessInd - dist/(this.lineDist/this.lineThicknessInd)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

    isClose = (x, y) => {
        let x2 = this.posX - x
        let y2 = this.posY - y
        let dist = Math.sqrt(x2*x2 + y2*y2)
        if (dist < this.lineDist){
            this.connectTo(x, y, dist)
        }
    }
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(el => {
        ctx.fillStyle = el.color
        ctx.fillRect(el.posX, el.posY, el.size, el.size)
        el.isClose(mouse.x, mouse.y)
        el.move()
    });
}

let stars = []

let interval

let startSim = () => {
    for (let i = 0; i < controlsData.STARS_AMOUNT; i++){
        stars.push(new Star())
    }

    mouse = {
        x: SPACE_SIZE_X() + controlsData.CONNECTION_DISTANCE + 20,
        y: SPACE_SIZE_Y() + controlsData.CONNECTION_DISTANCE + 20
    }

    interval = setInterval(update, 1000/controlsData.UPS)
}

let restart = () => {
    stars = []
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
    mouse.x = SPACE_SIZE_X() + controlsData.CONNECTION_DISTANCE + 20,
    mouse.y = SPACE_SIZE_Y() + controlsData.CONNECTION_DISTANCE + 20
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