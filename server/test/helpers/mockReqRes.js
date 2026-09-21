import { vi } from 'vitest';

export function newMockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res); // permite encadenar res.status(400).json(...)
    res.json = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res); 
    return res;
}

export function newMockReq(overrides = {}) {
    return {
        body: {},
        session: {
            destroy: vi.fn((callback) => callback && callback(null)),
            ...overrides.session
        },
        ...overrides
    };
}