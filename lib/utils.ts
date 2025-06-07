export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export function formatCurrency(amount: number | string): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return '0 ₫';

    return value.toLocaleString('us-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}
