const { MiniCalcCompiler } = require('./src/compiler');
const fs = require('fs');
const path = require('path');

function crear_ejemplos() {
    const ejemplos = {
        'basico.mc': `x = 5;
y = 10;
result = x + y * 2;
result;`,
        
        'parentesis.mc': `a = 3;
b = 4;
c = (a + b) * 2;
final = c - 1;
final;`,
        
        'complejo.mc': `base = 10;
altura = 5;
area = base * altura;
perimetro = (base + altura) * 2;
area;
perimetro;`
    };

    if (!fs.existsSync('./examples')) {
        fs.mkdirSync('./examples');
    }

    Object.entries(ejemplos).forEach(([filename, code]) => {
        const filepath = path.join('./examples', filename);
        fs.writeFileSync(filepath, code);
        console.log(`📝 Creado: ${filepath}`);
    });
}

function main() {
    console.log('🚀 MINICALC COMPILER DEMO\n');

    console.log('📁 Creando archivos de ejemplo...');
    crear_ejemplos();

    const compiler = new MiniCalcCompiler();
    const archivos = ['basico.mc', 'parentesis.mc', 'complejo.mc'];

    archivos.forEach((archivo, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 COMPILANDO EJEMPLO ${index + 1}: ${archivo}`);
        console.log(`${'='.repeat(60)}`);

        const input_path = path.join('./examples', archivo);
        const output_path = path.join('./examples', archivo.replace('.mc', '.js'));

        const result = compiler.compile_file(input_path, output_path);

        if (result.success) {
            console.log('\n📋 CÓDIGO GENERADO:');
            console.log('─'.repeat(40));
            console.log(result.generated_code);
            console.log('─'.repeat(40));
            
            console.log('\n🎯 EJECUTANDO CÓDIGO COMPILADO:');
            console.log('─'.repeat(25));
            
            try {
                // FIX: Usar ruta absoluta y ejecutar directamente el código
                const absolute_path = path.resolve(output_path);
                delete require.cache[absolute_path];
                require(absolute_path);
            } catch (error) {
                console.error('❌ Error ejecutando:', error.message);
            }
        }

        compiler.reset();
        console.log('\n' + '─'.repeat(60));
    });

    console.log('\n🎉 DEMO COMPLETADO');
    
    // Mostrar archivos generados
    console.log('\n📁 ARCHIVOS COMPILADOS GENERADOS:');
    archivos.forEach(archivo => {
        const js_file = archivo.replace('.mc', '.js');
        console.log(`   examples/${js_file}`);
    });
}

// Verificar argumentos de línea de comandos
if (process.argv.length > 2) {
    const input_file = process.argv[2];
    const output_file = process.argv[3] || input_file.replace('.mc', '.js');
    
    console.log('🔧 MODO COMPILACIÓN INDIVIDUAL');
    const compiler = new MiniCalcCompiler();
    const result = compiler.compile_file(input_file, output_file);
    
    if (result.success) {
        console.log(`\n✅ Archivo compilado exitosamente!`);
        console.log(`📂 Ejecutar con: node ${output_file}`);
    }
} else {
    main();
}