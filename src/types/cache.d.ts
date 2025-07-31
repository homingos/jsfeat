// =============================================================================
// src/types/jsfeat/cache.d.ts
// =============================================================================

import { data_t } from './core';

export declare function allocate(capacity: number, data_size: number): void;
export declare function get_buffer(size_in_bytes: number): data_t;
export declare function put_buffer(node: data_t): void;
