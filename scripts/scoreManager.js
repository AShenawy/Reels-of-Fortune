// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script handles the results of a round of play

const betOutcomes = {
    NOWIN: 0,
    BARCOMBO: 1,
    BAR: 2,
    BAR2: 3,
    BAR3: 4,
    CHERRY7COMBO: 5,
    SEVENS: 6,
    CHERRYMID: 7,
    CHERRYTOP: 8,
    CHERRYBOT: 9,
}

const scoreMan = {
    _numSymbols: 5,   // number of symbols in single reel. default = 5
    _winLines: ['top', 'mid', 'bot'],   // available win lines
    _firstReelRes: [-1, ''],   // initialise empty
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

    get numSymbols() {
        return this._numSymbols;
    },

    set numSymbols(value) {
        if (typeof value === 'number' && value > 0)
            this._numSymbols = value;
        else
            console.error("Setting value of numSymbols in scoreManager is of wrong type or value <= 0");
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
        if (checkAllSameLine(this._firstReelRes[1], this._secondReelRes[1], this._thirdReelRes[1]) === 'mid') {
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
            //TODO this part is fucked UP!
        else if(checkTopBot(this._firstReelRes[1], this._secondReelRes[1], this._thirdReelRes[1])) {
            // at this point we have 2 possible combos on either top/bottom lines or both, which need to be compared
            let topLineResult, botLineResult;

            // check 3x combo
            if (checkAllSameLine(this._firstReelRes[1], this._secondReelRes[1], this._thirdReelRes[1]) !== '') {
                if (checkSameSymbol(this._firstReelRes[0], this._secondReelRes[0], this._thirdReelRes[0])) {
                    const sumTop = getSymValue(this._firstReelRes, 'top') + getSymValue(this._secondReelRes, 'top') + getSymValue(this._thirdReelRes, 'top');
                    const sumBot = getSymValue(this._firstReelRes, 'bot') + getSymValue(this._secondReelRes, 'bot') + getSymValue(this._thirdReelRes, 'bot');
                    topLineResult = get3XCombo('top', sumTop);
                    botLineResult = get3XCombo('bot', sumBot);
                    console.log('top line bet outcome: enum value '+ topLineResult + ', bet value: ' + getKeyByValue(betOutcomes, topLineResult));
                    console.log('bot line bet outcome: enum value: '+ botLineResult + ', bet value: ' + getKeyByValue(betOutcomes, botLineResult));

                    // bet result is the greater of either result
                    this._betResult = (topLineResult >= botLineResult) ? topLineResult : botLineResult;
                    console.log('best bet result: ' + this._betResult + ', bet value: ' + getKeyByValue(betOutcomes, this._betResult));
                }
            }
        }
            // reels landed on mix of top/bottom and mid lines
        else {
            console.log('No Winning Line!');
            this._betResult = betOutcomes.NOWIN;
        }
    },
}

// returns whether all given line values are the same and returns it
const checkAllSameLine = (line1, line2, line3) => {
    if (line1 === line2 && line1 === line3)
        return line1;
    else
        return '';
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

// returns symbol value for win line (top/bottom only) specified in second parameter
const getSymValue = (reelResult, checkLine) => {
    // error checks before doing function
    if (checkLine === 'mid') {
        console.warn('getSymValue function wrongfully used to check against mid win line.\n' +
            'Use getSymValue only for checking against top or bottom win lines. Use ');
        return -1;
    }
    else if (checkLine === '' || typeof checkLine !== 'string')
    {
        console.error("Wrong type or value for second parameter in getSymValue. Use string values of either 'top' or 'bot'.");
        return -1;
    }


    if (reelResult[1] === checkLine) {
        // symbol landed on check line. return symbol value
        return reelResult[0];
    }
    else if (reelResult[1] === 'top' && checkLine === 'bot') {
        // symbol landed above check line. return next symbol in reel
        // if symbol is at end of reel, return first symbol
        return reelResult[0] + 1 > (scoreMan.numSymbols -1) ? 0 : reelResult[0] + 1;
    }
    else {
        // symbol landed below check line. return previous symbol in reel
        // if symbol is at start of reel, return last symbol
        return reelResult[0] - 1 < 0 ? scoreMan.numSymbols -1 : reelResult[0] - 1;
    }
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
// first parameter for line-dependent Cherry combos
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