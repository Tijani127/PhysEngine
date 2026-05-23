export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parse() {
        const statements = [];
        while (this.position < this.tokens.length) {
            statements.push(this.parseStatement());
        }
        return { type: 'Program', body: statements };
    }

    parseStatement() {
        // Currently only Function Calls
        const token = this.peek();

        if (token.type === 'IDENTIFIER') {
            return this.parseCallExpression();
        }

        throw new Error(`Unexpected token: ${token.type}`);
    }

    parseCallExpression() {
        const name = this.consume('IDENTIFIER').value;
        this.consume('LPAREN');
        const args = [];

        if (this.peek().type !== 'RPAREN') {
            args.push(this.parseExpression());
            while (this.peek().type === 'COMMA') {
                this.consume('COMMA');
                args.push(this.parseExpression());
            }
        }

        this.consume('RPAREN');
        return { type: 'CallExpression', name, arguments: args };
    }

    parseExpression() {
        const token = this.peek();
        
        // 1. Handle Numbers
        if (token.type === 'NUMBER') {
            return { type: 'Literal', value: this.consume('NUMBER').value };
        }

        // 2. Handle Quoted Strings ("hello")
        if (token.type === 'STRING') {
            return { type: 'Literal', value: this.consume('STRING').value };
        }

        // 3. Handle Raw Letters / Unquoted Text (hello)
        if (token.type === 'IDENTIFIER') {
            return { type: 'Identifier', value: this.consume('IDENTIFIER').value };
        }

        throw new Error(`Unexpected expression token: ${token.type}`);
    }


    consume(type) {
        const token = this.tokens[this.position];
        if (token.type === type) {
            this.position++;
            return token;
        }
        throw new Error(`Expected ${type} but got ${token.type}`);
    }

    peek() {
        return this.tokens[this.position];
    }
}
