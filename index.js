let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

let controlsData = {
    SPEED: 5,
    BAGS: 500,
    CATCH: 15,
    COLOR: false,
    UPS: 30,
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
    ['SPEED', 'speed', false],
    ['BAGS', 'bags', true],
    ['CATCH', 'catch', false],
    ['UPS', 'ups', false]
])

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let paused = false
let bags = []

class Bag {
    constructor(x, y, i){
        this.x = x
        this.y = y
        this.i = i
    }

    get target(){
        return bags[this.i+1] || bags[0]
    }

    get color() {
        let r = (this.i%32)*8
        let g = ((512 - r)%32)*8
        let b = (512 - g) 
        return controlsData.COLOR ? `rgb(${r}, ${g}, ${b})` : 'rgb(256, 256, 256)'
    }

    update = (i) =>{
        if (!paused){
            this.i = i
            let {x, y} = this.target
            let xdif = x - this.x 
            let ydif = y - this.y
            let gepo = Math.sqrt(xdif*xdif + ydif*ydif)
            this.x += xdif*(controlsData.SPEED/gepo)
            this.y += ydif*(controlsData.SPEED/gepo)
            if (this.x + 10 > SPACE_SIZE_X()) this.x = SPACE_SIZE_X()-10
            if (this.y + 10 > SPACE_SIZE_Y()) this.y = SPACE_SIZE_Y()-10
            if (this.x < 10) this.x = 10
            if (this.y < 10) this.y = 10
            if (isNaN(this.x) || isNaN(this.y)) bags.splice(i, 1)
            if (Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y)) < controlsData.SPEED*controlsData.CATCH/10){
                bags.splice(i+1, 1)
            }
        }
    }

    draw = () => {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, 4, 4)
    } 

}


const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bags.forEach((el, i) => {
        el.update(i)
        el.draw()
    })
}

let interval

let startSim = () => {
    for(let i = 0; i<controlsData.BAGS; i++){
        bags.push(new Bag(Math.floor(Math.random()*SPACE_SIZE_X()), Math.floor(Math.random()*SPACE_SIZE_Y()), i))
    }
    interval = setInterval(update, 1000/controlsData.UPS)
} 

let restart = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bags = []
    clearInterval(interval)
    startSim()
}

let pause = () => {
    paused = !paused
}

let inputChange = (evt) => {

    controlsData[ID_TO_NAMES.name(evt.target.id)] = evt.target.value
    if (controlsData[ID_TO_NAMES.name(evt.target.id)][2]) restart()
    
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
    else if (evt.code == 'KeyR'){
        restart()
    }
    else if (evt.code == 'KeyP'){
        pause()
    }
})

addEventListener('keyup', evt => {
    switch (evt.key){
        case "ArrowUp":
            controlsData.SPEED += 1
            document.getElementById(ID_TO_NAMES.id("SPEED")).value = controlsData.SPEED
            break
        case "ArrowDown":
            controlsData.SPEED -= 1
            document.getElementById(ID_TO_NAMES.id("SPEED")).value = controlsData.SPEED
            break
    }
})


addEventListener("click", evt =>{
    if (evt.shiftKey) bags.push(new Bag(evt.clientX, evt.clientY, bags.length))
})

let mouse = false

addEventListener('mousedown', evt => {
    mouse = true
})

addEventListener('mouseup', evt => {
    mouse = false
})

addEventListener('mousemove', evt => {
    if (mouse && evt.shiftKey) bags.push(new Bag(evt.clientX, evt.clientY, bags.length))
})

document.getElementById('cb2-7').onchange = (evt)=>{
    controlsData.COLOR = evt.target.checked
}


document.getElementById('qoute-box').onclick = () => document.getElementById('qoute-box').style.display = 'none'

controls()


startSim()
