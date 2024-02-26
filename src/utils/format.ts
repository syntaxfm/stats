// Formats strings like '▼3' and '▲1' to numbers like -3 and 1
export function formatChange(change: string | null) {
    if (!change) {
        return null;
    }
    const sign = change[0] === '▼' ? -1 : 1;
    const number = parseInt(change.slice(1));
    return sign * number;
}
