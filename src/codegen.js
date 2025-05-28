class CodeGenerator {
    constructor() {
        this.code = [];
        this.indent_level = 0;
    }

    emit(line) {
        const indent = '  '.repeat(this.indent_level);
        this.code.push(indent + line);
    }

    generate(ast) {
        this.emit('// Código generado por MiniCalc Compiler');
        this.emit('// Fecha: ' + new Date().toISOString());
        this.emit('');
        this.emit('function main() {');
        this.indent_level++;
        
        this.visit(ast);
        
        this.indent_level--;
        this.emit('}');
        this.emit('');
        this.emit('// Ejecutar el programa principal');
        this.emit('main();');
        
        return this.code.join('\n');
    }

    visit(node) {
        const method_name = `visit_${node.type}`;
        const visitor = this[method_name];
        
        if (!visitor) {
            throw new Error(`No hay generador para ${node.type}`);
        }
        
        return visitor.call(this, node);
    }

    visit_Program(node) {
        for (const statement of node.statements) {
            this.visit(statement);
        }
    }

    visit_Assignment(node) {
        const expr = this.visit(node.expression);
        this.emit(`let ${node.identifier} = ${expr};`);
        this.emit(`console.log('${node.identifier} =', ${node.identifier});`);
        return node.identifier;
    }

    visit_ExpressionStatement(node) {
        const expr = this.visit(node.expression);
        this.emit(`console.log('Resultado:', ${expr});`);
        return expr;
    }

    visit_BinaryOp(node) {
        const left = this.visit(node.left);
        const right = this.visit(node.right);
        
        const op_map = {
            'PLUS': '+',
            'MINUS': '-',
            'MULTIPLY': '*',
            'DIVIDE': '/'
        };
        
        return `(${left} ${op_map[node.operator.type]} ${right})`;
    }

    visit_Number(node) {
        return node.value.toString();
    }

    visit_Identifier(node) {
        return node.name;
    }
}

module.exports = { CodeGenerator };