class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class ProgramNode extends ASTNode {
    constructor(statements) {
        super('Program');
        this.statements = statements;
    }
}

class AssignmentNode extends ASTNode {
    constructor(identifier, expression) {
        super('Assignment');
        this.identifier = identifier;
        this.expression = expression;
    }
}

class BinaryOpNode extends ASTNode {
    constructor(left, operator, right) {
        super('BinaryOp');
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class NumberNode extends ASTNode {
    constructor(value) {
        super('Number');
        this.value = value;
    }
}

class IdentifierNode extends ASTNode {
    constructor(name) {
        super('Identifier');
        this.name = name;
    }
}

class ExpressionStatementNode extends ASTNode {
    constructor(expression) {
        super('ExpressionStatement');
        this.expression = expression;
    }
}

// Exportar las clases para usar en otros archivos
module.exports = {
    ASTNode,
    ProgramNode,
    AssignmentNode,
    BinaryOpNode,
    NumberNode,
    IdentifierNode,
    ExpressionStatementNode
};