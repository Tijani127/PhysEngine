import { Lexer } from './js/lang/Lexer.js';
import { Parser } from './js/lang/Parser.js';
import { Interpreter } from './js/lang/Interpreter.js';
import { World } from './js/physics/World.js';

console.log("Starting Debug Test...");

const code = `
gravity(0, 500)
rect(100, 100, 800, 20)
circle(200, 10, 20)
`;

try {
    console.log("Testing Lexer...");
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    console.log("Tokens:", tokens.map(t => t.type).join(', '));

    console.log("Testing Parser...");
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log("AST:", JSON.stringify(ast, null, 2));

    console.log("Testing Interpreter...");
    const world = new World(800, 600);
    const interpreter = new Interpreter(world);
    interpreter.run(ast);

    console.log("World Bodies:", world.bodies.length);
    if (world.bodies.length !== 2) {
        throw new Error(`Expected 2 bodies, got ${world.bodies.length}`);
    }

    console.log("Testing Physics Update...");
    world.update(0.016);
    console.log("Body 0 Pos:", world.bodies[0].pos);

    console.log("Test Passed!");
} catch (e) {
    console.error("TEST FAILED");
    console.error(e);
}
