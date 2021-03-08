// by Ahmed ElShenawy (elshenawy.ahmed@gmail.com)
// This script handles player data

const player = {
    _balance: 100,
    _betAmount: 1,

    get balance() {
        return this._balance;
    },

    set balance(num) {
        if (typeof num === 'number')
            this._balance = num;
        else
            alert('Entered balance is not a number');
    },

    addBalance(amount) {
        this._balance += amount;
    },

    placeBet() {
        this._balance -= this._betAmount;
    }
}