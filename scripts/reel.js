// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script handles reel logic for the slot machine

// vertical buffer between a reel's symbols, in pixels
const spacing = 40;

// downward velocity that drives the reels' rotation
const initialDownVel = 0.5;
const maxDownVel = 20;
const initialAcceleration = 0.1;
const maxAcceleration = 1.5;

// set how long reels should spin before stopping, in milliseconds
const spinTime = 2000;
const stopInterval = 500;

const createReel = (symbols, values, order) => {
    return {
        _symbols: symbols,
        _symW: symbols[0].width,
        _symH: symbols[0].height,
        _values: values,
        _order: order,
        _size: (symbols.length * symbols[0].height) + ((symbols.length - 1) * spacing),
        _pos: createVector(0, 0),
        _vel: createVector(0, initialDownVel),
        _acc: initialAcceleration,

        get symW() {
            return this._symW;
        },

        get symH() {
            return this._symH;
        },

        get order() {
            return this._order;
        },

        get size() {
            return this._size;
        },

        get pos() {
          return this._pos;
        },

        set pos(vector) {
            if (vector instanceof p5.Vector)
                this._pos = vector;
            else
                console.error('reel position isn\'t set using p5.Vector. Use createVector()');
        },

        moveDown() {
            this._pos.add(this._vel)
        },

        accelDown() {
            // keep accelerating until max velocity
            this._acc *= 1.1;
            this._vel.y = map(this._acc, initialAcceleration, maxAcceleration, initialDownVel, maxDownVel, true);
        },

        resetDownVelocity() {
            this._vel.y = initialDownVel;
            this._acc = initialAcceleration;
        },

        render() {
            for (i = 0; i < this._symbols.length; i++) {
                // Shift each symbol by 1 symbol height + spacing relative to previous symbol
                const shift =  i * (this._symH + spacing);
                image(this._symbols[i], this._pos.x, (this._pos.y + shift));
            }
        },

        loop() {
                // this._pos = createVector(this._pos.x, -this._size - spacing);
            this._pos.y = -this._size - spacing;
        },
    };
}