let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

let controlsData = {
    SPEED: 5,
    BAGS: 500,
    CATCH: 15,
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
    ['SPEED', 'speed'],
    ['BAGS', 'bags'],
    ['CATCH', 'catch'],
    ['UPS', 'ups']
])

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

    update = (i) =>{
        this.i = i
        let {x, y} = this.target
        let xdif = x - this.x 
        let ydif = y - this.y
        let gepo = Math.sqrt(xdif*xdif + ydif*ydif)
        this.x += xdif*(controlsData.SPEED/gepo)
        this.y += ydif*(controlsData.SPEED/gepo)
        if (Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y)) < controlsData.SPEED*controlsData.CATCH/10){
            bags.splice(i+1, 1)
        }
    }

    draw = () => {
        ctx.fillStyle = "rgb(256, 256, 256)"
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
    restart()
})  


addEventListener("keypress", (evt) => { 
    if (evt.code == 'KeyQ'){
        controls()
    }
})

addEventListener("keypress", (evt) => { 
    if (evt.code == 'KeyR'){
        restart()
    }
})

document.getElementById('qoute-box').onclick = () => document.getElementById('qoute-box').style.display = 'none'

controls()


startSim()
