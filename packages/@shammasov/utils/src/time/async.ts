export const sleep = async (time: number) =>
        new Promise(resolve =>
            setTimeout(resolve, time),
        )


        const createMutex = (key: string = String(Math.random()), debug =  false) => {
            let _mutexPromise = Promise.resolve({} as any)
            return <A extends readonly any[],R>(f: (...args:A) => Promise<R>) => {
                return Object.assign(async (...args: A)  => {
         
                    _mutexPromise = _mutexPromise.then(async () => {
                            if(debug) {
                                console.log('Mutex '+key+' call "'+(f.name||'NoNameFunction')+'" ', args)
                            }
                            const result =  await f(...args)
        
                            return result
                    })
        
                    return _mutexPromise as Promise<R>
                },{
                    unmutex: async (...args: A)  => {
         
                
                if(debug) {
                     console.log('Mutex '+key+' UnMutex call "'+(f.name||'NoNameFunction')+'" ', args)
                }
                            const result =  await f(...args)
        
                            return result
                    }
        
                }
                )
        
            }
        }

class A {
    private a = {v:0}
        private _mutex=createMutex('a', true)
        
        type = "report";
        title: string;
    
        run = this._mutex(async function run(v: string) {await sleep(1000); return v})
        save = this._mutex(async (v: string) => {await sleep(1000); await this.run.unmutex('in save'); return v})
        constructor(t: string) {
        this.title = t;
        }
    }
          /** const a = new A('s')
            a.run('hello!')
            a.save('s')
            a.run('next!')
            */