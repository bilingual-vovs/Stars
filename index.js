let SPACE_SIZE_X = () => window.innerWidth
let SPACE_SIZE_Y = () => window.innerHeight

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Sun {
    constructor(posX = SPACE_SIZE_X/2, posY = SPACE_SIZE_Y/2, size = 20, rays = 16){
        this.posX = posX
        this.posY = posY
        this.size = size
        this.rays = rays
    }

    moveTo = (x, y) => {
        this.posX = x
        this.posY = y
    }

    drawRay = (id) => {
        
    }


}


const update = () => {
    
}


let startSim = () => {

}

let restart = () => {

}

let out = () => {
    mouse.x = SPACE_SIZE_X() + controlsData.CONNECTION_DISTANCE + 20,
    mouse.y = SPACE_SIZE_Y() + controlsData.CONNECTION_DISTANCE + 20
}

canvas.width = SPACE_SIZE_X()
canvas.height = SPACE_SIZE_Y()

let move = (evt) => {
    mouse.x = evt.layerX
    mouse.y = evt.layerY
}

addEventListener("resize", (evt) => {
    canvas.width = SPACE_SIZE_X()
    canvas.height = SPACE_SIZE_Y()
})  

canvas.onmousemove = move
canvas.onmouseout = out
