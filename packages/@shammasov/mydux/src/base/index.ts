import {Slice} from "@reduxjs/toolkit";

export type StateWithSlice<S extends Slice> = {
    [k in  S["reducerPath"]]: ReturnType<Slice['reducer']>
}
