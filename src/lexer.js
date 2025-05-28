class Token {
    constructor(type, value, position) {
        this.type = type;
        this.value = value;
        this.position = position;
    }
}

class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.current_char = this.input[this.position];
    }

    error() {
        throw new Error(`Error léxico en posición ${this.position}: carácter inesperado '${this.current_char}'`);
    }

    advance() {
        this.position++;
        if (this.position >= this.input.length) {
            this.current_char = null;
        } else {
            this.current_char = this.input[this.position];
        }
    }

    skip_whitespace() {
        while (this.current_char !== null && /\s/.test(this.current_char)) {
            this.advance();
        }
    }

    number() {
        let result = '';
        while (this.current_char !== null && /\d/.test(this.current_char)) {
            result += this.current_char;
            this.advance();
        }
        return parseInt(result);
    }

    identifier() {
        let result = '';
        while (this.current_char !== null && /[a-zA-Z0-9]/.test(this.current_char)) {
            result += this.current_char;
            this.advance();
        }
        return result;
    }

    get_next_token() {
        while (this.current_char !== null) {
            if (/\s/.test(this.current_char)) {
                this.skip_whitespace();
                continue;
            }

            if (/\d/.test(this.current_char)) {
                return new Token('NUMBER', this.number(), this.position);
            }

            if (/[a-zA-Z]/.test(this.current_char)) {
                return new Token('IDENTIFIER', this.identifier(), this.position);
            }

            if (this.current_char === '+') {
                this.advance();
                return new Token('PLUS', '+', this.position - 1);
            }

            if (this.current_char === '-') {
                this.advance();
                return new Token('MINUS', '-', this.position - 1);
            }

            if (this.current_char === '*') {
                this.advance();
                return new Token('MULTIPLY', '*', this.position - 1);
            }

            if (this.current_char === '/') {
                this.advance();
                return new Token('DIVIDE', '/', this.position - 1);
            }

            if (this.current_char === '=') {
                this.advance();
                return new Token('ASSIGN', '=', this.position - 1);
            }

            if (this.current_char === '(') {
                this.advance();
                return new Token('LPAREN', '(', this.position - 1);
            }

            if (this.current_char === ')') {
                this.advance();
                return new Token('RPAREN', ')', this.position - 1);
            }

            if (this.current_char === ';') {
                this.advance();
                return new Token('SEMICOLON', ';', this.position - 1);
            }

            this.error();
        }

        return new Token('EOF', null, this.position);
    }

    tokenize() {
        const tokens = [];
        let token = this.get_next_token();
        
        while (token.type !== 'EOF') {
            tokens.push(token);
            token = this.get_next_token();
        }
        
        tokens.push(token);
        return tokens;
    }
}

module.exports = { Token, Lexer };