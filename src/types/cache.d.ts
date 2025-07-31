// =============================================================================
// src/types/jsfeat/cache.d.ts
// =============================================================================
declare module "jsfeat/lib/jsfeat_cache.js" {
    import { data_t } from "jsfeat/lib/jsfeat_core.js";


    export function allocate(capacity: number, data_size: number): void;
    export function get_buffer(size_in_bytes: number): data_t;
    export function put_buffer(node: data_t): void;
}