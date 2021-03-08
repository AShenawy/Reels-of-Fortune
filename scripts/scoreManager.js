// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script handles the results of a round of play

const betOutcomes = {
    NOWIN: 'no win',
    CHERRYTOP: '3xcherry top',
    CHERRYMID: '3xcherry mid',
    CHERRYBOT: '3xcherry bot',
    SEVENS: '3xseven',
    CHERRY7COMBO: 'cherry seven combo',
    BAR3: '3xbar 3',
    BAR2: '3xbar 2',
    BAR: '3xbar',
    BARCOMBO: 'bars combo'
}

const scoreMan = {
    _numSymbols: 5,   // number of symbols in single reel
    _winLines: ['top', 'mid', 'bot'],   // available win lines
    _firstReelRes: [ -1, ''],   // initialise empty
    _secondReelRes: [-1, ''],
    _thirdReelRes: [-1, ''],
    _betResult: '',

    get winLines() {
        return this._winLines;
    },

    get firstReelRes() {
        return this._firstReelRes;
    },

    get secondReelRes() {
        return this._secondReelRes;
    },

    get thirdReelRes() {
        return this._thirdReelRes;
    },

    get betResult() {
        return this._betResult;
    },

    getRandomSymIndex() {
        rndSym = Math.floor(Math.random() * this._numSymbols);
        return rndSym;
    },

    getRandomLine() {
        rndLine = Math.floor(Math.random() * this._winLines.length);
        return this._winLines[rndLine];
    },

    setRandomResults() {
        this._firstReelRes = [this.getRandomSymIndex(), this.getRandomLine()];
        this._secondReelRes = [this.getRandomSymIndex(), this.getRandomLine()];
        this._thirdReelRes = [this.getRandomSymIndex(), this.getRandomLine()];
    },

    setFirstReelResult(symNumber, linePos) {
        if (symNumber === undefined)
            this._firstReelRes[0] = this.getRandomSymIndex();
        else
            this._firstReelRes[0] = symNumber;

        this._firstReelRes[1] = linePos || this.getRandomLine();
    },

    setSecondReelResult(symNumber, linePos) {
        if (symNumber === undefined)
            this._secondReelRes[0] = this.getRandomSymIndex();
        else
            this._secondReelRes[0] = symNumber;

        this._secondReelRes[1] = linePos || this.getRandomLine();
    },

    setThirdReelResult(symNumber, linePos) {
        if (symNumber === undefined)
            this._thirdReelRes[0] = this.getRandomSymIndex();
        else
            this._thirdReelRes[0] = symNumber;

        this._thirdReelRes[1] = linePos || this.getRandomLine();
    },

    checkResults() {
        // check if all reels landed on mid win line
        if (checkAllSameLine(this._firstReelRes[1], this._secondReelRes[1], this._thirdReelRes[1])) {
            // check 3x combos
            if (checkSameSymbol(this._firstReelRes[0], this._secondReelRes[0], this._thirdReelRes[0])) {
                // same symbol combo, check which symbol based on summation of symbol index value
                const sumSymbolIndex = this._firstReelRes[0] + this._secondReelRes[0] + this._thirdReelRes[0];
                this._betResult = get3XCombo(this._firstReelRes[1], sumSymbolIndex);
            }
            // check other combinations
            else {
                this._betResult = getLineOutcome(this._firstReelRes[0], this._secondReelRes[0], this._thirdReelRes[0]);
            }
        }
        // check if all reels landed on either top or bottom lines
        else if(checkTopBot(this._firstReelRes[1], this._secondReelRes[1], this._thirdReelRes[1])) {
            // at this point we have possible combos on either top or bottom line or both
        }
        else {
            console.log('No Winning Line!');
            this._betResult = betOutcomes.NOWIN;
        }
    },
}

// returns whether all given line values are the same
const checkAllSameLine = (line1, line2, line3) => {
    return line1 === line2 && line1 === line3;
}

// returns whether given line values belong either on top or bottom win lines
const checkTopBot = (line1, line2, line3) => {
    if (line1 === 'top' || line1 === 'bot') {
        if (line2 === 'top' || line2 === 'bot') {
            if (line3 === 'top' || line3 === 'bot') {
                return true;
            }
        }
    }
    else {
        return false;
    }
}

// returns whether given values all have same symbol index/number
const checkSameSymbol = (sym1, sym2, sym3) => {
    return sym1 === sym2 && sym1 === sym3;
}

// returns either winning combo or no win for dissimilar symbols (should be on same line)
const getLineOutcome = (sym1, sym2, sym3) => {
    // check if 7 (index 3) & cherry (index 4) combo
    if (sym1 === 3 || sym1 === 4) {
        if (sym2 === 3 || sym2 === 4) {
            if (sym3 === 3 || sym3 === 4) {
                console.log('7 & Cherry Combo!');
                return betOutcomes.CHERRY7COMBO;
            }
        }
    }

    // check if mix of BAR symbols (indices 0, 1, and 2)
    if (sym1 === 0 || sym1 === 1 || sym1 === 2) {
        if (sym2 === 0 || sym2 === 1 || sym2 === 2) {
            if (sym3 === 0 || sym3 === 1 || sym3 === 2) {
                console.log('BARs Mix Combo!');
                return betOutcomes.BARCOMBO;
            }
        }
    }

    // if both above checks failed then no win
    console.log('No Winning Combo!');
    return betOutcomes.NOWIN;
}

// returns which 3x combo won (same line and symbol)
// first parameter linePos for Cherry combos
const get3XCombo = (linePos, sumSymbols) => {
    switch(sumSymbols) {
        case 12:    // 3xCherry (sym index 4)
            if (linePos === 'mid') {
                console.log('3x Cherry Mid!');
                return betOutcomes.CHERRYMID;
            }
            else if (linePos === 'top') {
                console.log('3x Cherry Top!');
                return betOutcomes.CHERRYTOP;
            }
            else if (linePos === 'bot') {
                console.log('3x Cherry Bot!');
                return betOutcomes.CHERRYBOT;
            }
            else {
                console.error('wrong linePos input');
                return '';
            }

        case 9:     // 3xSeven (sym index 3)
            console.log('3x Seven!');
            return betOutcomes.SEVENS;

        case 6:     // 3xBAR2 (sym index 2)
            console.log('3x BAR2!');
            return betOutcomes.BAR2;

        case 3:     // 3xBAR (sym index 1)
            console.log('3x BAR!');
            return betOutcomes.BAR;

        case 0:     // 3xBAR3 (sym index 0)
            console.log('3x BAR3!');
            return betOutcomes.BAR3;
    }
}