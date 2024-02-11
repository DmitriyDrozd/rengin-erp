

export const defaultTimerStart = +new Date()
   

const NS_PER_SEC = 1e9;

const getTimer = (start: Date | number  = defaultTimerStart, firstStart = start) => {
 
    const startDate = typeof start === 'number' ? new Date(start) : start
    let checkPoint = new Date()

    // @ts-ignore
    let duration = checkPoint - startDate


    return duration
}


export default getTimer