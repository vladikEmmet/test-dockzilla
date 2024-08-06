export function padZero(num) {
    return num < 10 ? '0' + num : num;
}

export function throttle(func, delay) {
    let timer = null;
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay);
        }
    };
}

export function parseTimestamp(timestamptz) {
    const date = new Date(timestamptz);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}