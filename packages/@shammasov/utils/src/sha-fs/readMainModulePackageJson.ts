import * as Path from 'path'
import PackageJson from '../../package.json'

export const readMainModulePackageJson = () => {
    const fs = require('node:fs')
    const packageJsonPath = Path.join(require.main.filename,'..','package.json')

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as any as typeof PackageJson
    return pkg
}