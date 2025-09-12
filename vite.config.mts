import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import dts from 'vite-plugin-dts'

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./src/index.tsx"],
            name: "woby-list",
            formats: [/*'cjs', '*/'es'/*, 'umd'*/],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
        rollupOptions: {
            external: ['woby', 'woby/jsx-runtime', 'oby', 'woby/jsx-runtime', 'woby-styled',],
            output: {
                globals: {
                    'woby': 'woby',
                    'woby/jsx-runtime': 'woby/jsx-runtime',
                }
            }
        }
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        // dts({ entryRoot: './src/lib', outputDir: './dist/types' })
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
})



export default config
