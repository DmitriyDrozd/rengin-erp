import {defineConfig, PluginOption, splitVendorChunkPlugin, UserConfigExport} from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
//import appConfig from '@app-config/vite';
//import react from "@vitejs/plugin-react-swc";

const RENGIN_VITE_PORT = process.env.RENGIN_VITE_PORT || 9302
const RENGIN_SERVICE_API =  process.env.RENGIN_SERVICE_API || 'http://127.0.0.1:'+9380

const env = {
    RENGIN_VITE_PORT,
    RENGIN_SERVICE_API
}

console.log('Env ',env)

// https://vitejs.dev/config/
export default defineConfig({

    envPrefix: 'RENGIN_',

    optimizeDeps: {
    },
    plugins: [
        //  visualizer({brotliSize : true, gzipSize: true}) as PluginOption,
        // viteCompression({algorithm:'brotliCompress',verbose:true}),
        //reactSWC(),//
        //appConfig(),
        react(),//
        /*   viteExternalsPlugin({
               ramda: 'R',
               luxon: 'luxon'

           }),*/
        splitVendorChunkPlugin(),

        visualizer() as PluginOption
    ],


    define: {
        /* 'process.env.RENGIN_LOG_ROCKET': `"${RENGIN_LOG_ROCKET}"`,
     'process.git': {
           VERSION: JSON.stringify(gitRevisionPlugin.GE),
           COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
           BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
           LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),*/
    },//
    server: {
    host: '127.0.0.1',
        port: RENGIN_VITE_PORT,
        proxy: {
            '/api/': RENGIN_SERVICE_API,
            '/sse/': RENGIN_SERVICE_API,
            '/models/': RENGIN_SERVICE_API,

            '/uploads/': RENGIN_SERVICE_API,
            '/archives/': RENGIN_SERVICE_API,
            '/backup/': RENGIN_SERVICE_API,
            '/reports/': RENGIN_SERVICE_API
        },
    } }as UserConfigExport
)

