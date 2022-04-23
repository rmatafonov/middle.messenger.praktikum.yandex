type Indexed<T = unknown> = {
    [key in string]: T;
};

export function isEqual(a: Indexed, b: Indexed): boolean {
    const ta = typeof a, tb = typeof b;
    return a && b && ta === 'object' && ta === tb ? (
        Object.keys(a).length === Object.keys(b).length &&
        Object.keys(a).every(key => isEqual(a[key] as Indexed, b[key] as Indexed))
    ) : (a === b);
}
