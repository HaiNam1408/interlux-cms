export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
