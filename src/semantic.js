class SemanticAnalyzer {
    constructor() {
        this.symbol_table = new Map();
        this.errors = [];
    }

    error(message) {
        this.errors.push(message);
    }

    analyze(ast) {
        this.visit(ast);
        
        if (this.errors.length > 0) {
            throw new Error(`Errores semánticos:\n${this.errors.join('\n')}`);
        }
        
        return true;
    }

    visit(node) {
        const method_name = `visit_${node.type}`;
        const visitor = this[method_name];
        
        if (!visitor) {
            throw new Error(`No hay método visitante para ${node.type}`);
        }
        
        return visitor.call(this, node);
    }

    visit_Program(node) {
        for (const statement of node.statements) {
            this.visit(statement);
        }
    }

    visit_Assignment(node) {
        this.visit(node.expression);
        this.symbol_table.set(node.identifier, {
            type: 'variable',
            initialized: true
        });
    }

    visit_ExpressionStatement(node) {
        this.visit(node.expression);
    }

    visit_BinaryOp(node) {
        this.visit(node.left);
        this.visit(node.right);
    }

    visit_Number(node) {
        return node.value;
    }

    visit_Identifier(node) {
        if (!this.symbol_table.has(node.name)) {
            this.error(`Variable '${node.name}' usada sin declarar`);
        } else {
            const symbol = this.symbol_table.get(node.name);
            if (!symbol.initialized) {
                this.error(`Variable '${node.name}' usada sin inicializar`);
            }
        }
    }
}

module.exports = { SemanticAnalyzer };