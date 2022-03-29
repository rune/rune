// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default [{
    input: 'src/browser.ts',
    output: {
        file: 'dist/browser.js',
        format: 'iife',
        name: 'Rune'
    },
    plugins: [typescript({tsconfig: './tsconfig.browser.json'})]
},{
    input: 'src/index.ts',
    output: {
        sourcemap: true,
        format: 'commonjs',
        file: 'dist/index.js',
    },
    plugins: [typescript({tsconfig: './tsconfig.json'})]
}];