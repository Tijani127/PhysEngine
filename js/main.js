import { Editor } from './editor.js';
import { World } from './physics/World.js';
import { Lexer } from './lang/Lexer.js';
import { Parser } from './lang/Parser.js';
import { Interpreter } from './lang/Interpreter.js';
import { EXAMPLES } from './examples.js';

class App {
    constructor() {
        this.editor = new Editor();
        this.canvas = document.getElementById('sim-canvas');
        this.ctx = this.canvas.getContext('2d');14
        this.fpsCounter = document.getElementById('fps-counter');
        this.consoleOutput = document.getElementById('console-output');

        // Physics Setup
        this.world = new World(this.canvas.width, this.canvas.height);
        this.interpreter = new Interpreter(this.world, (...args) => this.log(...args));

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.editor.onRun = (code) => this.runCode(code);
        this.editor.onReset = () => this.resetSimulation();
        this.editor.onExampleLoad = (key) => {
            const code = EXAMPLES[key];
            if (code) {
                this.editor.setCode(code);
                this.runCode(code);
            }
        };

        // Initial Run
        this.runCode(this.editor.getCode());

        this.lastTime = 0;
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.world.width = rect.width;
        this.world.height = rect.height;
    }

    runCode(code) {
        console.log("Running code...");
        try {
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();

            this.interpreter.run(ast);
            console.log("Execution successful.");
        } catch (e) {
            console.error(e);
            this.log(`Error: ${e.message}`);
        }
    }

    resetSimulation() {
        this.world.clear();
        this.consoleOutput.innerHTML = '';
        this.runCode(this.editor.getCode());
    }

    log(...args) {
        const line = document.createElement('div');
        line.className = 'console-log';
        line.innerText = args.join(' ');
        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (dt < 0.1) {
            this.update(dt);
        }

        this.draw();

        this.fpsCounter.innerText = `FPS: ${Math.round(1 / dt) || 60}`;
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        this.world.update(dt);
    }

    draw() {
        this.ctx.fillStyle = '#020617';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.world.draw(this.ctx);
    }
}

new App();
