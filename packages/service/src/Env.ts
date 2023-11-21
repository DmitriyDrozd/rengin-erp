import dotenv from 'dotenv';
dotenv.config({})
import EnvStr from "../.env.dev"

const e: ExtractEnvVars<typeof EnvStr> = process.env as any


type ExtractEnvVar<Path, NextPart> = Path extends
    `${infer Param}=${number}`
    ? Record<Param, number> & NextPart
    : Path extends `${infer Param}="${string}"`
        ? Record<Param, string> & NextPart
        : NextPart;

type ExtractEnvVars<Path> = Path extends `${infer Segment}\n${infer Rest}`
    ? ExtractEnvVar<Segment, ExtractEnvVars<Rest>>
    : ExtractEnvVar<Path, {}>

const Env: ExtractEnvVars<typeof EnvStr> = process.env as any
export default Env
