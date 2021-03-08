// By Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// this is the main P5.js script file which runs the game

// UI elements
let body;   // graphic for slot machine body/frame
let payTableScreen; // graphic for pay table
let isPayTableOn = false; // switch for displaying the pay table
let winGIFs;    // array of winning GIFs
let displayedWinGIF;    // specific image which will actually show
let isWinGIFOn = false; // switch for displaying the winning image
let isLineBlinking = false;     // switch for win lines blinking
let winLineDist;    // for drawing win lines and reference point where reels are drawn
let topLineCoord = {};
let midLineCoord = {};
let botLineCoord = {};

// reel-related elements
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

// buttons declarations
let btnSpin; // button to start playing
let isSpinningDisabled = false;
let btnPT; // button to display pay table
let btnExit; // button to exit pay table

// misc elements
let gameMessage; // for displaying text in message screen


// p5*js function to ensure data load before displaying going to setup step
function preload() {
    // load images
    const s_bar = loadImage('./images/reel/BAR.png');
    const s_bar2 = loadImage('./images/reel/2xBAR.png');
    const s_bar3 = loadImage('./images/reel/3xBAR.png');
    const s_seven = loadImage('./images/reel/7.png');
    const s_cherry = loadImage('./images/reel/Cherry.png');

    // Slot machine has 3 reels, each having following 5 symbols in order:
    // 3xBAR, BAR, 2xBAR, 7, CHERRY
    reelSymbolImages = [s_bar3, s_bar, s_bar2, s_seven, s_cherry];

    body = loadImage('./images/Frame.png');
    payTableScreen = loadImage('./images/PayTable.png');
    const winCherryBot = loadImage('./images/winImages/winCherryBot.gif');
    const winCherryTop = loadImage('./images/winImages/winCherryTop.gif');
    const winCherryMid = loadImage('./images/winImages/winCherryMid.gif');
    const winCherrySeven = loadImage('./images/winImages/winCherrySeven.gif');
    const winSevens = loadImage('./images/winImages/winSevens.gif');
    const win3BAR = loadImage('./images/winImages/win3BAR.gif');
    const win2BAR = loadImage('./images/winImages/win2BAR.gif');
    const winBAR = loadImage('./images/winImages/winBAR.gif');
    const winBARCombo = loadImage('./images/winImages/winBarCombo.gif');
    const tryAgain = loadImage('./images/winImages/lose.gif');
    // array should follow the betOutcomes enum
    winGIFs = [tryAgain, winBARCombo, winBAR, win2BAR, win3BAR, winCherrySeven, winSevens, winCherryMid, winCherryTop, winCherryBot];
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
    topLineCoord = {
        x1: 0,
        y1: (height * 0.5) - winLineDist,
        x2: width,
        y2: (height * 0.5) - winLineDist,
    }
    midLineCoord = {
        x1: 0,
        y1: height * 0.5,
        x2: width,
        y2: height * 0.5,
    }
    botLineCoord = {
        x1: 0,
        y1: height * 0.5 + winLineDist,
        x2: width,
        y2: (height * 0.5) + winLineDist,
    }

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

    drawUI();
    // debugSquares();
}

function checkLoop() {
    reels.forEach(reel => {
            if (reel.pos.y >= loopRef)
                reel.loop();
        }
    );
}

function disablePlayerSpin(value) {
    isSpinningDisabled = value;
}

function play() {
    if (player.balance > 0 && !isSpinningDisabled) {
        disablePlayerSpin(true);
        player.placeBet();
        startSpin();
        displayMessage('Game started. Good luck!');
    }
    else if (isSpinningDisabled) {
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

    // check spin bet outcome
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

            // console.log(d1);
            if (d1 > 3 || d1 < -20) {
                // console.log('first reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                // console.log('first reel reached stop point');
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
                // console.log('center reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                // console.log('center reel reached stop point');
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
                // console.log('right reel below or above stop point');
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.moveDown();
                });
            }
            else {
                // console.log('right reel reached stop point');
                stopReelsRight = false;  //reset condition for draw func
                reels.forEach(reel => {
                    if (reel.order === side)
                        reel.resetDownVelocity();
                });

                // check and display spin results after last reel stopped
                checkWinnings();
            }
            break;
    }
}

function checkWinnings() {
    switch (scoreMan.betResult[0]) {
        case betOutcomes.NOWIN:
            displayWinResult(betOutcomes.NOWIN);
            displayMessage('No luck. Try Again!');
            break;

        case betOutcomes.BARCOMBO:
            player.addBalance(5);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.BARCOMBO);
            displayMessage('Congratulations! BAR combination!');
            break;

        case betOutcomes.BAR:
            player.addBalance(10);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.BAR);
            displayMessage('Congratulations! 3 BAR combo!');
            break;

        case betOutcomes.BAR2:
            player.addBalance(20);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.BAR2);
            displayMessage('Congratulations! 3 2xBAR combo!');
            break;

        case betOutcomes.BAR3:
            player.addBalance(50);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.BAR3);
            displayMessage('Congratulations! 3 3xBAR combo!');
            break;

        case betOutcomes.CHERRY7COMBO:
            player.addBalance(75);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.CHERRY7COMBO);
            displayMessage('Congratulations! Cherry & 7 combo!');
            break;

        case betOutcomes.SEVENS:
            player.addBalance(150);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.SEVENS);
            displayMessage('Congratulations! 3 7s combo!');
            break;

        case betOutcomes.CHERRYMID:
            player.addBalance(1000);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.CHERRYMID);
            displayMessage('Huge Win! 3 Cherry mid line combo!');
            break;

        case betOutcomes.CHERRYTOP:
            player.addBalance(2000);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.CHERRYTOP);
            displayMessage('Mega Win! 3 Cherry top line combo!');
            break;

        case betOutcomes.CHERRYBOT:
            player.addBalance(4000);
            displayBlinkingLine(true);
            displayWinResult(betOutcomes.CHERRYBOT);
            displayMessage('JACKPOT!! 3 Cherry bottom line combo!');
            break;
    }

    // allow player to spin again after last reel stops and win showed
    disablePlayerSpin(false);

    setTimeout(function (){
        displayBlinkingLine(false);
    }, 2000);
}

function displayWinResult(winCondition) {
    displayedWinGIF = winGIFs[winCondition];
    displayGIF(true);

    // hide GIF after 2 seconds
    setTimeout(function () {
        displayGIF(false);
    }, 2000);
}

function displayGIF(value) {
    isWinGIFOn = value;
}

function blinkLine() {
    switch (scoreMan.betResult[1]) {
        case 'top':
            push();
            if (frameCount %  21 > 8) {
                strokeWeight(5);
                stroke('gold');
                line(topLineCoord.x1, topLineCoord.y1, topLineCoord.x2, topLineCoord.y2);
            }
            pop();
            break;

        case 'mid':
            push();
            if (frameCount %  21 > 8) {
                strokeWeight(5);
                stroke('gold');
                line(midLineCoord.x1, midLineCoord.y1, midLineCoord.x2, midLineCoord.y2);
            }
            pop();
            break;

        case 'bot':
            push();
            if (frameCount %  21 > 8) {
                strokeWeight(5);
                stroke('gold');
                line(botLineCoord.x1, botLineCoord.y1, botLineCoord.x2, botLineCoord.y2);
            }
            pop();
            break;
    }
}

function displayBlinkingLine(value) {
    isLineBlinking = value;
}

function displayPayTable(value) {
    // only display table if not spinning
    if (!isSpinningDisabled)
        isPayTableOn = value;
}

function drawScoreLines() {
    push();
    stroke(0);
    strokeWeight(5);
    line(topLineCoord.x1, topLineCoord.y1, topLineCoord.x2, topLineCoord.y2);   // top line
    line(midLineCoord.x1, midLineCoord.y1, midLineCoord.x2, midLineCoord.y2);     // mid line
    line(botLineCoord.x1, botLineCoord.y1, botLineCoord.x2, botLineCoord.y2);   // bot line
    pop();

    if (isLineBlinking)
        blinkLine();
}

function drawUI() {
    // body/frame
    push();
    image(body, 0, 0);
    pop();

    // balance & play table area
    push();
    translate(width - 320, height - 150);
    // fill('black');
    // stroke('green');
    // rect(0, 0, 300, 140);
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

    // show win images
    if (isWinGIFOn) {
        push();
        imageMode(CENTER);
        image(displayedWinGIF, 180, height * 0.5);
        pop();
    }

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

    if (isDebugMode) {
        push();
        fill('black');
        rect(0,0, width, 70);
        fill('red');
        textStyle(BOLD);
        textSize(46);
        textAlign(CENTER);
        text('-=# DEBUG MODE #=-', width * 0.5, 50);
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