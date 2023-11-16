const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Star{
    posX = Math.floor(Math.random()*1000)
    posY = Math.floor(Math.random()*1000)
    size = 1 + Math.floor(Math.random()*3)
    color = `rgba(256, 256, 256, ${50 + Math.floor(Math.random()*50)})`
    speedX = 1 - Math.random()*2
    speedY = 1 - Math.random()*2

    lineDist = 201

    constructor(){
        
    }

    move = () => {
        this.posX += this.speedX
        this.posY += this.speedY 
        if (this.posX > 1000 || this.posX < 0){
            this.speedX = 0-this.speedX
        }
        if (this.posY > 1000 || this.posY < 0){
            this.speedY = 0-this.speedY
        }
    }

    connectTo = (x, y, dist) => {
        ctx.beginPath()
        ctx.moveTo(this.posX, this.posY)
        ctx.lineTo(x, y)
        ctx.lineWidth = 3 - dist/67
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

    isClose = (x, y) => {
        // let x2 = Math.max(x, this.posX) - Math.min(x, this.posX)
        // let y2 = Math.max(y, this.posY) - Math.min(y, this.posY)
        let x2 = this.posX - x
        let y2 = this.posY - y
        let dist = Math.sqrt(x2*x2 + y2*y2)
        console.log(x, y, this.posX, this.posY, dist, x2, y2)
        if (dist < this.lineDist){
            this.connectTo(x, y, dist)
        }
    }
}

let stars = []

for (let i = 0; i < 50; i++){
    stars.push(new Star())
}

mouse = {
    x: 10000,
    y: 10000
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


setInterval(update, 20)

let move = (evt) => {
    mouse.x = evt.layerX
    mouse.y = evt.layerY
}

let out = () => {
    mouse.x = mouse.y = 10000
}

canvas.onmousemove = move
canvas.onmouseout = out