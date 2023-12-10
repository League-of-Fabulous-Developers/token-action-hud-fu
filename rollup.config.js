import { terser } from 'rollup-plugin-terser'
import multi from '@rollup/plugin-multi-entry'
import livereload from 'rollup-plugin-livereload';

export default [
    {
        input: {
            include: [
                'scripts/*.js',
                'scripts/*/*.js'
            ],
            exclude: [
                'scripts/token-action-hud-fu.min.js']
        },
        output: {
            format: 'esm',
            file: 'scripts/token-action-hud-fu.min.js'
        },
        plugins: [
            terser({ keep_classnames: true, keep_fnames: true }),
            multi(),
            livereload ({
                port: 9999
            }),
        ]
    }
]
