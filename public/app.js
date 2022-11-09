let socket = io();
let userNum; //current visitor online


socket.on('connect', function () {
    console.log("Connected");
});

//receiving live visitor count from server
socket.on('liveCount', (arg) => {
    console.log(arg);
    let nameElement = document.getElementById("user-count");
    nameElement.innerHTML = arg;
    userNum = arg;
});

//console.log(userNum);

//send form input msg to server
let nameInput = document.getElementById('name-input');
let msgInput = document.getElementById('msg-input');
let plotInput = document.getElementById('plot-input');
let sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', function () {
    let curName = nameInput.value;
    let curMsg = msgInput.value;
    let curPlot = plotInput.value;

    let msgObj = { "name": curName, "msg": curMsg, "plot": curPlot };
    //console.log(curPlot);

    socket.emit('msg', msgObj);
});


////////////////p5 codes///////////////
let imgs = []; //flower array
let tomb_on;
let tomb_off;
let skeleton;
let cnv;


let xdis = 180;
let ydis = 250;

function preload() {
    for (let i = 0; i < 12; i++) {
        imgs[i] = loadImage("media/flowers/" + i + ".png");
    }
    tomb_on = loadImage("media/tomb_on.png");
    tomb_off = loadImage("media/tomb_off.png");
    skeleton = loadImage("media/skeleton.png");
}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    cnv.position(x, 0);
    cnv.style('z-index', '-1');
}


function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    centerCanvas();
    imageMode(CENTER);

    //background (100);

    //flowers
    socket.on('data', function (obj) {
        console.log(obj);
        drawFlower(obj);
    });

    //grey tombs
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 2; j++) {
            rectMode(CENTER);
            noFill();
            stroke(255,70);
            rect((width / 2 - xdis * 2) + xdis * i, height / 2 + ydis * j,160, 150);
            image(tomb_off, (width / 2 - xdis * 2) + xdis * i, height / 2 + ydis * j-80, 70, 140);
            
        }
    }

    //plot numbers
    let step = 1;
    for (y = height / 2 - 60; y <= height; y = y + ydis) {
        for (x = width / 2 - xdis * 2; x <= width / 2 + xdis * 2; x = x + xdis) {
            noStroke();
            fill(255,50);
            textAlign(CENTER);
            text("plot # " + step, x-50, y);
            step++;
        }
    }

    //listening to msg from server & turning tombs on
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data.name);
        console.log(data.msg);
        

        let plotName = data.name;
        let plotMsg = data.msg;
        let plotNum = data.plot;

        let s = plotName;
        let s2 = plotMsg;

        if (plotNum <= 5) {
            //change color
            image(tomb_on, (width / 2 - xdis * 3) + xdis * plotNum, height / 2-80, 70, 130);
            //show info
            fill(255);
            noStroke();
            text(s, (width / 2 - xdis * 3) + xdis * plotNum, height / 2+20, 150,80);
            text(s2, (width / 2 - xdis * 3) + xdis * plotNum, height / 2+40, 150,80);
        } else  {
            image(tomb_on, (width / 2 - xdis * 3) + xdis * (plotNum - 5), height / 2-80 + ydis, 70, 130);
            fill(255);
            noStroke();
            text(s, (width / 2 - xdis * 3) + xdis * (plotNum - 5), height / 2+270, 150,80);
            text(s2, (width / 2 - xdis * 3) + xdis * (plotNum - 5), height / 2 +290, 150, 80);
        } 
        

    });


    //showing skeletons
    // for (let i = 0; i < userNum; i++) {
    //     image(skeleton, 200 + 50 * i, 40, 40, 60);
    // };

    //rect white frame
    // rectMode(CENTER);
    // stroke(255);
    // noFill();
    // rect(width/2, height /2+20, width*0.8, height*0.85, 30);
}

function windowResized() {
    centerCanvas();
}

function draw(){
   
    
    for (let i = 0; i < userNum; i++) {
        image(skeleton, 200 + 50 * i, 40, 60, 60);
        
    };
}
//get mouse position
function mouseClicked() {
    let mousePos = { x: mouseX, y: mouseY };
    console.log(mousePos);
    socket.emit('data', mousePos);
}

//draw random flowers
function drawFlower(pos) {
    imageMode(CENTER);
    let index = int(random(12));
    let size = random(30, 50);
    image(imgs[index], pos.x, pos.y, size, size);
}

