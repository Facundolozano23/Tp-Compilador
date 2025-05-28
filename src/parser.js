// Importar las clases del AST
const {
    ProgramNode,
    AssignmentNode,
    BinaryOpNode,
    NumberNode,
    IdentifierNode,
    ExpressionStatementNode
} = require('./ast');

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.current_token = this.tokens[this.pos];
    }

    error(expected = null) {
        const msg = expected 
            ? `Error sintáctico: se esperaba ${expected}, pero se encontró ${this.current_token.type}`
            : `Error sintáctico: token inesperado ${this.current_token.type}`;
        throw new Error(msg);
    }

    advance() {
        this.pos++;
        if (this.pos < this.tokens.length) {
            this.current_token = this.tokens[this.pos];
        }
    }

    eat(token_type) {
        if (this.current_token.type === token_type) {
            this.advance();
        } else {
            this.error(token_type);
        }
    }

    parse() {
        const statements = [];
        
        while (this.current_token.type !== 'EOF') {
            statements.push(this.statement());
        }
        
        return new ProgramNode(statements);
    }

    statement() {
        if (this.current_token.type === 'IDENTIFIER' && 
            this.pos + 1 < this.tokens.length && 
            this.tokens[this.pos + 1].type === 'ASSIGN') {
            return this.assignment();
        } else {
            const expr = this.expression();
            this.eat('SEMICOLON');
            return new ExpressionStatementNode(expr);
        }
    }

    assignment() {
        const identifier = this.current_token.value;
        this.eat('IDENTIFIER');
        this.eat('ASSIGN');
        const expression = this.expression();
        this.eat('SEMICOLON');
        return new AssignmentNode(identifier, expression);
    }

    expression() {
        let node = this.term();

        while (this.current_token.type === 'PLUS' || this.current_token.type === 'MINUS') {
            const operator = this.current_token;
            this.advance();
            node = new BinaryOpNode(node, operator, this.term());
        }

        return node;
    }

    term() {
        let node = this.factor();

        while (this.current_token.type === 'MULTIPLY' || this.current_token.type === 'DIVIDE') {
            const operator = this.current_token;
            this.advance();
            node = new BinaryOpNode(node, operator, this.factor());
        }

        return node;
    }

    factor() {
        const token = this.current_token;

        if (token.type === 'NUMBER') {
            this.advance();
            return new NumberNode(token.value);
        } else if (token.type === 'IDENTIFIER') {
            this.advance();
            return new IdentifierNode(token.value);
        } else if (token.type === 'LPAREN') {
            this.advance();
            const node = this.expression();
            this.eat('RPAREN');
            return node;
        } else {
            this.error('NUMBER, IDENTIFIER o (');
        }
    }
}

module.exports = { Parser };