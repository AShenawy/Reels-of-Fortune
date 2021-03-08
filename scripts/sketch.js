// By Ahmed ElShenawy (elshenawy.ahmed@gmail.com)

/*
doneTODO spin button to start spinning
doneTODO reels spin for 2 secs then stop
doneTODO spin reduces balance by 1
doneTODO if balance is <= 0 don't play
doneTODO pick random values for reels to land on
doneTODO allow end values to be determined
TODO force balance input to accept numbers only
TODO calculate winnings based on pay table
TODO adjust timing of reels stopping / cheat it (fast roll and redraw at position)
doneTODO clicking pay table displays it (image) + button to close it
 */
// debug mode variables
let isDebugMode = true; // allows fixing reel positions
let reel1FixedSym = 0;
let reel2FixedSym = 2;
let reel3FixedSym = 0;
let reel1FixedLine = 'mid';
let reel2FixedLine = 'mid';
let reel3FixedLine = 'mid';

let body;   // graphic for slot machine body/frame
let payTableScreen; // graphic for pay table
let isPayTableOn = false; // switch for displaying the pay table

let reelSymbolImages;
const reelNamedSymbols = ['3BAR', 'BAR', '2BAR', '7', 'CHERRY'];
let reelLeft0, reelLeft1, reelCnt0, reelCnt1, reelRight0, reelRight1;
let reels;
const gutter = 50; // horizontal gap between each reel, in pixels
let moveReelsLeft = false;
let moveReelsMid = false;
let moveReelsRight = false;
let stopReelsLeft = false;
let stopReelsMid = false;
let stopReelsRight = false;

let loopRef;    // reference point where a reel will loop back to top. depends on reel size
let winLineDist;    // for drawing win lines and reference point where reels are drawn

let btnSpin; // button to start playing
let isSpinning = false;
let btnPT; // button to display pay table
let btnExit; // button to exit pay table

let gameMessage; // for displaying text in message screen


// p5*js function to ensure data load before displaying going to setup step
function preload() {
    // load images
    const s_bar = loadImage('./images/reel/BAR.png');
    const s_bar2 = loadImage('./images/reel/2xBAR.png');
    const s_bar3 = loadImage('./images/reel/3xBAR.png');
    const s_seven = loadImage('./images/reel/7.png');
    const s_cherry = loadImage('./images/reel/Cherry.png');
    body = loadImage('./images/Frame.png');
    payTableScreen = loadImage('./images/PayTable.png');

    // Slot machine has 3 reels, each having following 5 symbols in order:
    // 3xBAR, BAR, 2xBAR, 7, CHERRY
    reelSymbolImages = [s_bar3, s_bar, s_bar2, s_seven, s_cherry];
}

// p5*js function to setup elements, runs once on start
function setup() {
    let cnv = createCanvas(1280, 720)
    cnv.parent('canvas');
    scoreMan.numSymbols = reelNamedSymbols.length;

    // create reels, each section has 2 reels for continuous scrolling
    reelLeft0 = createReel(reelSymbolImages, reelNamedSymbols, 'left');
    reelLeft1 = createReel(reelSymbolImages, reelNamedSymbols, 'left');
    reelCnt0 = createReel(reelSymbolImages, reelNamedSymbols, 'mid');
    reelCnt1 = createReel(reelSymbolImages, reelNamedSymbols, 'mid');
    reelRight0 = createReel(reelSymbolImages, reelNamedSymbols, 'right');
    reelRight1 = createReel(reelSymbolImages, reelNamedSymbols, 'right');
    reels = [reelLeft0, reelLeft1, reelCnt0, reelCnt1, reelRight0, reelRight1];

    // setup references
    loopRef = reelLeft0.size + spacing;     // all reels assumed to be same size
    winLineDist = (reelLeft0.symH * 0.5) + (spacing * 0.5);

    // position reels
    const topPos = height * 0.5 - winLineDist - reelLeft0.symH * 0.5;
    const leftPos = (width * 0.5) - (reelLeft0.symW * 1.5) - gutter;
    reelLeft0.pos = createVector(leftPos, topPos);
    reelLeft1.pos = createVector(leftPos, topPos -reelLeft1.size - spacing);
    const centerPos = (width * 0.5) - (reelCnt0.symW * 0.5);
    reelCnt0.pos = createVector(centerPos, topPos);
    reelCnt1.pos = createVector(centerPos, topPos -reelCnt1.size - spacing);
    const rightPos = (width * 0.5) + (reelRight0.symW * 0.5) + gutter;
    reelRight0.pos = createVector(rightPos, topPos);
    reelRight1.pos = createVector(rightPos, topPos -reelRight1.size - spacing);


    // create spin button
    btnSpin = new Clickable();
    btnSpin.onPress = play;
    btnSpin.resize(180, 80);
    btnSpin.locate(width*0.5 - btnSpin.width*0.5, height*0.5 +200);
    btnSpin.color = 'SeaGreen';
    btnSpin.textColor = 'lemonChiffon';
    btnSpin.stroke = 'YellowGreen';
    btnSpin.strokeWeight = 4;
    btnSpin.text = 'SPIN';
    btnSpin.textSize = 32;

    // create pay table button
    btnPT = new Clickable();
    btnPT.onPress = function () {displayPayTable(true);};
    btnPT.resize(290, 40);
    btnPT.locate(width - 315, height - 145);
    btnPT.cornerRadius = 5;
    btnPT.strokeWeight = 3;
    btnPT.text = 'PAY TABLE';
    btnPT.color = 'gold';
    btnPT.stroke = 'orange'
    btnPT.textSize = 14;

    // create exit pay table button
    btnExit = new Clickable();
    btnExit.onPress = function() {displayPayTable(false);};
    btnExit.resize(180, 80);
    btnExit.locate(width*0.5 - btnSpin.width*0.5, height*0.5 +200);
    btnExit.color = 'gold';
    btnExit.stroke = 'orange';
    btnExit.strokeWeight = 4;
    btnExit.text = 'EXIT';
    btnExit.textSize = 32;
}

function write()
{
    console.log('done!');
}

// p5*js function to draw elements. Runs continuously by default
function draw() {
    background(180);
    drawScoreLines();


    // draw reels
    reels.forEach(reel => reel.render());

    // make reels loop
    checkLoop();

    // condition to move reels
    if (moveReelsLeft)
        moveReels('left');
    if (moveReelsMid)
        moveReels('mid');
    if (moveReelsRight)
        moveReels('right');

    // condition to stop reels
    if (stopReelsLeft)
        stopReels('left');
    if (stopReelsMid)
        stopReels('mid');
    if (stopReelsRight)
        stopReels('right');

    //TODO remove these squares
    // squares for looping debug
    debugSquares();

    drawUI();
    // drawButtons();
    // noLoop();

}

function checkLoop() {
    reels.forEach(reel => {
            if (reel.pos.y >= loopRef)
                reel.loop();
        }
    );
}

function play() {
    if (player.balance > 0 && !isSpinning) {
        isSpinning = true;
        player.placeBet();
        startSpin();
        displayMessage('Game started. Good luck!');
    }
    else if (isSpinning) {
        displayMessage('Game in progress. Please wait for \nthe reels to stop before spinning again.');
    }
    else
        displayMessage('Not enough credits in balance \nPlease add more credits.');
}

function startSpin() {
    // choose which play mode to set results on
    if (isDebugMode) {
        console.log('playing fixed game');
        scoreMan.setFirstReelResult(reel1FixedSym, reel1FixedLine);
        scoreMan.setSecondReelResult(reel2FixedSym, reel2FixedLine);
        scoreMan.setThirdReelResult(reel3FixedSym, reel3FixedLine);
        console.log('first reel values: ' + scoreMan.firstReelRes);
        console.log('second reel values: ' + scoreMan.secondReelRes);
        console.log('third reel values: ' + scoreMan.thirdReelRes);
    }
    else
    {
        console.log('playing random game');
        scoreMan.setRandomResults();
        console.log('first reel values: ' + scoreMan.firstReelRes);
        console.log('second reel values: ' + scoreMan.secondReelRes);
        console.log('third reel values: ' + scoreMan.thirdReelRes);
    }

    scoreMan.checkResults();

    // allow all reels to move
    stopReelsLeft = false;
    stopReelsMid = false;
    stopReelsRight = false;
    moveReelsLeft = true;
    moveReelsMid = true;
    moveReelsRight = true;

    // stop first/left reel
    setTimeout(function() {
        stopSpin('left');
        }, spinTime);


}

function stopSpin(side) {
    switch (side) {
        case 'left':
            moveReelsLeft = false;
            stopReelsLeft = true;
            break;
        case 'mid':
            moveReelsMid = false;
            stopReelsMid = true;
            break;
        case 'right':
            moveReelsRight = false;
            stopReelsRight = true;
            break;
    }
}

function moveReels(side) {
    reels.forEach(reel => {
        if (reel.order === side) {
            reel.moveDown();
            reel.accelDown();
        }
    });
}

function stopReels(side) {
    switch (side) {
        case 'left':
            // set shift of reel by symbol picked by game/ input from debugger
            // for first symbol (3xBAR), shift value is 0
            let symShift1 = scoreMan.firstReelRes[0] * (reelLeft0.symH + spacing);

            // set top win line as baseline to measure stopping distance from. calculate as:
            // top win line position = distance to mid screen - distance to top win line
            // top win line - mid point of chosen symbol on reel
            let baseline1 = ((height * 0.5) - winLineDist) - (reelLeft0.pos.y + (reelLeft0.symH * 0.5) + symShift1);

            // shift distance 'd' reference point to the win line picked by game/ input from debugger
            let d1 = baseline1 + (scoreMan.winLines.indexOf(scoreMan.firstReelRes[1]) * winLineDist);

            console.log(d1);
            if (d1 > 3 || d1 < -20) {
                console.log('first reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                console.log('first reel reached stop point');
                stopReelsLeft = false;  //reset condition for draw func
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.resetDownVelocity();
                });

                // stop second/mid/center reel
                setTimeout(function() {
                    stopSpin('mid');
                }, spinTime + stopInterval);
            }
            break;

        case 'mid':
            // check comments on case first for details
            let symShift2 = scoreMan.secondReelRes[0] * (reelCnt0.symH + spacing);
            let baseline2 = ((height * 0.5) - winLineDist) - (reelCnt0.pos.y + (reelCnt0.symH * 0.5) + symShift2);
            let d2 = baseline2 + (scoreMan.winLines.indexOf(scoreMan.secondReelRes[1]) * winLineDist);

            if (d2 > 3 || d2 < -20) {
                console.log('center reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                console.log('center reel reached stop point');
                stopReelsMid = false;  //reset condition for draw func
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.resetDownVelocity();
                });

                // stop third/right reel
                setTimeout(function() {
                    stopSpin('right');
                }, spinTime + (2 * stopInterval));
            }
            break;

        case 'right':
            // check comments on case first for details
            let symShift3 = scoreMan.thirdReelRes[0] * (reelRight0.symH + spacing);
            let baseline3 = ((height * 0.5) - winLineDist) - (reelRight0.pos.y + (reelRight0.symH * 0.5) + symShift3);
            let d3 = baseline3 + (scoreMan.winLines.indexOf(scoreMan.thirdReelRes[1]) * winLineDist);

            if (d3 > 3 || d3 < -20) {
                console.log('right reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                console.log('right reel reached stop point');
                stopReelsRight = false;  //reset condition for draw func
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.resetDownVelocity();
                });
            }
            break;
    }

    // allow player to spin again after last reel stops
    if (side === 'right')
        isSpinning = false;
}

function displayPayTable(value) {
    // only display table if not spinning
    if (!isSpinning)
        isPayTableOn = value;
}

function drawScoreLines() {
    push();
    stroke(0);
    strokeWeight(5);
    line(0, (height * 0.5) - winLineDist, width, (height * 0.5) - winLineDist);   // top line
    line(0, height * 0.5, width, height * 0.5);     // mid line
    line(0, (height * 0.5) + winLineDist, width, (height * 0.5) + winLineDist);   // bot line
    pop();
}

function drawUI() {
    // body/frame
    // push();
    image(body, 0, 0);
    // pop();

    // balance & play table area
    push();
    translate(width - 320, height - 150);
    fill('black');
    stroke('green');
    rect(0, 0, 300, 140);
    fill('gold');
    stroke('orange');
    strokeWeight(3);
    rect(5, 50, 290, 40, 5);
    fill('black')
    noStroke();
    textSize(14);
    textAlign(LEFT, CENTER);
    text('BALANCE', 15, 70);
    textAlign(RIGHT);
    text(numToCurrency(player.balance), 285, 70);
    pop();

    // game messages area
    push();
    translate(width -320, 220)
    fill('black');
    stroke('orange');
    strokeWeight(4);
    rect(0, 0, 300, 280, 15);
    textAlign(LEFT);
    noStroke();
    fill('white');
    textSize(16);
    text(gameMessage, 10, 25, 280, 230);
    pop();

    // show pay table and accompanying exit button
    if (isPayTableOn) {
        push();
        image(payTableScreen, 0, 0);
        btnExit.draw();
        pop();
    }

    // hide play buttons if pay table displayed
    if (!isPayTableOn) {
        // spin button
        push();
        btnSpin.draw();
        pop();

        // pay table button
        push();
        btnPT.draw();
        pop();
    }
}

function debugSquares() {
    push();
    fill('red');
    square(reelLeft0.pos.x, reelLeft0.pos.y - spacing, spacing);
    fill('blue');
    square(reelLeft1.pos.x, reelLeft1.pos.y + reelLeft1.size, spacing);
    pop();
}

function displayMessage(message) {
    gameMessage = message;
}