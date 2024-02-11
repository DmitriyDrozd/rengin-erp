import {createEntitySlice} from "../features/entity";
import {createSlice} from "@reduxjs/toolkit";
import {Slice} from "@reduxjs/toolkit";

export type StateWithSlice<S extends Slice> = {
    [k in  S["name"]]: ReturnType<Slice['reducer']>
}
