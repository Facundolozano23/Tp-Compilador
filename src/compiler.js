const fs = require('fs');
const path = require('path');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { SemanticAnalyzer } = require('./semantic');
const { CodeGenerator } = require('./codegen');

class MiniCalcCompiler {
    constructor() {
        this.reset();
    }

    reset() {
        this.lexer = null;
        this.parser = null;
        this.semantic_analyzer = new SemanticAnalyzer();
        this.code_generator = new CodeGenerator();
    }

    compile(source_code, output_file = null) {
        try {
            console.log('🚀 COMPILADOR MINICALC v1.0');
            console.log('=' .repeat(50));
            
            // Fase 1: Análisis Léxico
            console.log('\n🔍 FASE 1: Análisis Léxico');
            this.lexer = new Lexer(source_code);
            const tokens = this.lexer.tokenize();
            console.log(`✅ ${tokens.length} tokens generados`);

            // Fase 2: Análisis Sintáctico
            console.log('\n🌳 FASE 2: Análisis Sintáctico');
            this.parser = new Parser(tokens);
            const ast = this.parser.parse();
            console.log('✅ AST generado correctamente');

            // Fase 3: Análisis Semántico
            console.log('\n✅ FASE 3: Análisis Semántico');
            this.semantic_analyzer.analyze(ast);
            console.log('✅ Verificación semántica exitosa');
            
            const variables = Array.from(this.semantic_analyzer.symbol_table.keys());
            console.log(`📋 Variables encontradas: ${variables.join(', ')}`);

            // Fase 4: Generación de Código
            console.log('\n🚀 FASE 4: Generación de Código');
            const generated_code = this.code_generator.generate(ast);
            console.log('✅ Código JavaScript generado');

            // Fase 5: Guardar archivo (si se especifica)
            if (output_file) {
                fs.writeFileSync(output_file, generated_code);
                console.log(`💾 Archivo guardado: ${output_file}`);
            }

            console.log('\n🎉 COMPILACIÓN COMPLETADA');
            console.log('=' .repeat(50));

            return {
                success: true,
                generated_code: generated_code,
                ast: ast,
                tokens: tokens,
                symbols: this.semantic_analyzer.symbol_table
            };

        } catch (error) {
            console.error('\n❌ ERROR DE COMPILACIÓN:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    compile_file(input_file, output_file) {
        try {
            console.log(`📂 Leyendo archivo: ${input_file}`);
            const source_code = fs.readFileSync(input_file, 'utf8');
            
            console.log('\n📝 CÓDIGO FUENTE:');
            console.log('-'.repeat(30));
            console.log(source_code);
            console.log('-'.repeat(30));
            
            const result = this.compile(source_code, output_file);
            
            if (result.success) {
                console.log(`\n🎯 PARA EJECUTAR:`);
                console.log(`   node ${output_file}`);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Error leyendo archivo:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = { MiniCalcCompiler };