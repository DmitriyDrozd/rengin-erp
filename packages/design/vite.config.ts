import {defineConfig, PluginOption, UserConfigExport, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import GitRevision from 'vite-plugin-git-revision'
import { visualizer } from "rollup-plugin-visualizer"



// https://vitejs.dev/config/
export default defineConfig({

    envPrefix: 'STONES_',
    optimizeDeps: {
    },
    plugins: [
        //  visualizer({brotliSize : true, gzipSize: true}) as PluginOption,
        // viteCompression({algorithm:'brotliCompress',verbose:true}),
        //reactSWC(),//
        react(),//
        /*   viteExternalsPlugin({
               ramda: 'R',
               luxon: 'luxon'

           }),*/
        splitVendorChunkPlugin(),

        visualizer() as PluginOption
    ],


    define: {
        /* 'process.env.STONES_LOG_ROCKET': `"${STONES_LOG_ROCKET}"`,
     'process.git': {
           VERSION: JSON.stringify(gitRevisionPlugin.GE),
           COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
           BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
           LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),*/
    },//
    server: {


    } }as UserConfigExport
)

