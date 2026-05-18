export class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.position < this.input.length) {
            const char = this.input[this.position];

            if (/\s/.test(char)) {
                this.position++;
                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                this.tokens.push(this.readIdentifier());
                continue;
            }

            if (/[0-9]/.test(char) || char === '-') {
                this.tokens.push(this.readNumber());
                continue;
            }

            if (char === '(') {
                this.tokens.push({ type: 'LPAREN', value: '(' });
                this.position++;
                continue;
            }

            if (char === ')') {
                this.tokens.push({ type: 'RPAREN', value: ')' });
                this.position++;
                continue;
            }

            if (char === ',') {
                this.tokens.push({ type: 'COMMA', value: ',' });
                this.position++;
                continue;
            }

            if (char === '/' && this.input[this.position + 1] === '/') {
                // Comment
                while (this.position < this.input.length && this.input[this.position] !== '\n') {
                    this.position++;
                }
                continue;
            }

            console.error(`Unknown character: ${char}`);
            this.position++;
        }

        return this.tokens;
    }

    readIdentifier() {
        let start = this.position;
        while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
            this.position++;
        }
        return { type: 'IDENTIFIER', value: this.input.slice(start, this.position) };
    }

    readNumber() {
        let start = this.position;
        // Handle negative numbers
        if (this.input[this.position] === '-') {
            this.position++;
        }
        while (this.position < this.input.length && /[0-9.]/.test(this.input[this.position])) {
            this.position++;
        }
        const val = this.input.slice(start, this.position);
        return { type: 'NUMBER', value: parseFloat(val) };
    }
}
