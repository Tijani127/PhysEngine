import { Body } from '../physics/Body.js';
import { Vector } from '../physics/Vector.js';

export class Interpreter {
    constructor(world, onPrint) {
        this.world = world;
        this.onPrint = onPrint || console.log;
    }

    run(ast) {
        this.world.clear();
        for (const node of ast.body) {
            this.executeNode(node);
        }
    }

    executeNode(node) {
        switch (node.type) {
            case 'CallExpression':
                this.executeCall(node);
                break;
            default:
                console.warn('Unknown node type:', node.type);
        }
    }

    executeCall(node) {
        const args = node.arguments.map(arg => arg.value);

        switch (node.name) {
            case 'circle':
                // circle(x, y, r)
                this.world.addBody(new Body('circle', args[0], args[1], args[2]));
                break;
            case 'rect':
                // rect(x, y, w, h)
                this.world.addBody(new Body('rect', args[0], args[1], args[2], args[3]));
                break;
            case 'gravity':
                // gravity(x, y)
                this.world.gravity = new Vector(args[0], args[1]);
                break;
            // Add more commands here (e.g., 'spawn')
            case 'print':
                this.onPrint(...args);
                break;
            case 'bounciness':
                // bounciness(val)
                if (this.world.bodies.length > 0) {
                    const body = this.world.bodies[this.world.bodies.length - 1];
                    body.restitution = args[0];
                }
                break;
            // Aliases or removal of 3D commands
            case 'sphere':
                // Fallback for 3D scripts might be confusing/error, map to circle?
                this.world.addBody(new Body('circle', args[0], args[1], args[3]));
                break;
            case 'box':
                this.world.addBody(new Body('rect', args[0], args[1], args[3], args[4]));
                break;
            default:
                console.warn('Unknown function:', node.name);
        }
    }
}
