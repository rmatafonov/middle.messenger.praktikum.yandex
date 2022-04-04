export function capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function queryStringify(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}
