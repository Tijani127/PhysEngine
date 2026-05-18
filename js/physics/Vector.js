export class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const m = this.mag();
        if (m > 0) {
            return this.mult(1 / m);
        }
        return new Vector(0, 0);
    }

    dist(v) {
        return this.sub(v).mag();
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}
