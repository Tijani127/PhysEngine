import { Vector } from './Vector.js';

export class Body {
    constructor(type, x, y, ...args) {
        this.type = type; // 'circle' or 'rect'
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.mass = 1;
        this.inverseMass = 1;
        this.restitution = 0.5;
        this.color = '#38bdf8';

        if (type === 'circle') {
            this.radius = args[0];
            this.mass = Math.PI * this.radius * this.radius * 0.01;
        } else if (type === 'rect') {
            this.width = args[0];
            this.height = args[1];
            this.mass = this.width * this.height * 0.01;
        }

        if (this.mass === 0) this.inverseMass = 0;
        else this.inverseMass = 1 / this.mass;
    }

    applyForce(force) {
        if (this.inverseMass === 0) return;
        this.acc = this.acc.add(force.mult(this.inverseMass));
    }

    update(dt) {
        if (this.inverseMass === 0) return;

        this.vel = this.vel.add(this.acc.mult(dt));
        this.pos = this.pos.add(this.vel.mult(dt));

        this.acc = new Vector(0, 0);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        if (this.inverseMass === 0) {
            ctx.fillStyle = '#94a3b8'; // Static color
        }

        ctx.beginPath();
        if (this.type === 'circle') {
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        } else if (this.type === 'rect') {
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
        ctx.fill();
        ctx.closePath();
    }
}
