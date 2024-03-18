import fse from 'fs-extra';

export const ensureMoved = async (src: string, dest: string) => {
    try {
        const isExists=await fse.exists(src)
        console.log(isExists, src)
        if (isExists) {
            console.log('moveTo',dest)
            await fse.move(src, dest,{})
            console.log('moved')
        }
    }catch (e) {
        console.log(src,e)
    }
}
