// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// this script handles the debug/fixed mode variables

// debug mode variables
let isDebugMode = false; // allows fixing reel positions
let reel1FixedSym = -1;
let reel2FixedSym = -1;
let reel3FixedSym = -1;
let reel1FixedLine = '';
let reel2FixedLine = '';
let reel3FixedLine = '';

const getCheckboxInput = () => {
    let checkbox = document.getElementById('debugCheck');
    if(checkbox.checked === true) {
        createDebugMenu();
        isDebugMode = true;
    }
    else {
        removeElements();
        isDebugMode = false;
    }
}


let balInput;
let balInputBtn;
let reel1SymSelect;
let reel1LineSelect;
let reel2SymSelect;
let reel2LineSelect;
let reel3SymSelect;
let reel3LineSelect;

const createDebugMenu = () => {
    // player balance debugging
    let d = createDiv();
    d.parent('debugMenu');
    let p = createP('Input custom player balance');
    p.parent(d);

    balInput = createInput(1);
    balInput.parent(d);
    balInput.elt.type = 'number';
    balInput.elt.value = '1';
    balInput.elt.min = '1';
    balInput.elt.max = '5000';
    balInput.changed(checkInputVal);

    balInputBtn = createButton('Confirm');
    balInputBtn.parent(d);
    balInputBtn.mousePressed(function () {
       setPlayerBalance(balInput.value());
    });

    // first reel debugging
    let d1 = createDiv();
    d1.parent('debugMenu');
    let p1 = createP('Setup Left Reel');
    p1.parent(d1);

    reel1SymSelect = createSelect();
    reel1SymSelect.parent(d1);
    reel1SymSelect.option('Random Symbol', -1);
    reel1SymSelect.option('BAR', 1);
    reel1SymSelect.option('2xBAR', 2);
    reel1SymSelect.option('3xBAR', 0);
    reel1SymSelect.option('7', 3);
    reel1SymSelect.option('CHERRY', 4);
    reel1SymSelect.changed(function () {
        reel1FixedSym = parseInt(reel1SymSelect.value());
        console.log('picked ' +reel1FixedSym+ ' for reel 1');        
    });

    reel1LineSelect = createSelect();
    reel1LineSelect.parent(d1);
    reel1LineSelect.option('Random Line', '');
    reel1LineSelect.option('top');
    reel1LineSelect.option('mid');
    reel1LineSelect.option('bot');
    reel1LineSelect.changed(function () {
       reel1FixedLine = reel1LineSelect.value();
       console.log('picked ' + reel1FixedLine + ' for reel 1');
    });

    // second reel debugging
    let d2 = createDiv();
    d2.parent('debugMenu');
    d2.position(300, -69, 'relative')
    let p2 = createP('Setup Center Reel');
    p2.parent(d2);

    reel2SymSelect = createSelect();
    reel2SymSelect.parent(d2);
    reel2SymSelect.option('Random Symbol', -1);
    reel2SymSelect.option('BAR', 1);
    reel2SymSelect.option('2xBAR', 2);
    reel2SymSelect.option('3xBAR', 0);
    reel2SymSelect.option('7', 3);
    reel2SymSelect.option('CHERRY', 4);
    reel2SymSelect.changed(function () {
        reel2FixedSym = parseInt(reel2SymSelect.value());
        console.log('picked ' + reel2FixedSym + ' for reel 2');
    });

    reel2LineSelect = createSelect();
    reel2LineSelect.parent(d2);
    reel2LineSelect.option('Random Line', '');
    reel2LineSelect.option('top');
    reel2LineSelect.option('mid');
    reel2LineSelect.option('bot');
    reel2LineSelect.changed(function () {
        reel2FixedLine = reel2LineSelect.value();
        console.log('picked ' + reel2FixedLine + ' for reel 2');
    });

    // third reel debugging
    let d3 = createDiv();
    d3.parent('debugMenu');
    d3.position(600, -138, 'relative')
    let p3 = createP('Setup Right Reel');
    p3.parent(d3);

    reel3SymSelect = createSelect();
    reel3SymSelect.parent(d3);
    reel3SymSelect.option('Random Symbol', -1);
    reel3SymSelect.option('BAR', 1);
    reel3SymSelect.option('2xBAR', 2);
    reel3SymSelect.option('3xBAR', 0);
    reel3SymSelect.option('7', 3);
    reel3SymSelect.option('CHERRY', 4);
    reel3SymSelect.changed(function () {
        reel3FixedSym = parseInt(reel3SymSelect.value());
        console.log('picked ' + reel3FixedSym + ' for reel 3');
    });
	
    reel3LineSelect = createSelect();
    reel3LineSelect.parent(d3);
    reel3LineSelect.option('Random Line', '');
    reel3LineSelect.option('top');
    reel3LineSelect.option('mid');
    reel3LineSelect.option('bot');
    reel3LineSelect.changed(function () {
        reel3FixedLine = reel3LineSelect.value();
        console.log('picked ' + reel3FixedLine + ' for reel 3');
    });
}

const checkInputVal = () => {
    if (balInput.value() > 5000) {
        balInput.elt.value = 5000;
    }
    else if (balInput.value() < 1) {
        balInput.elt.value = 1;
    }
}

const setPlayerBalance = () => {
    checkInputVal();
    player.balance = balInput.value();
}
