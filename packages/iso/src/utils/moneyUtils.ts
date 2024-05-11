export const getDiffAndDiffPercent = (a?: number, b?: number) => {
    if (a === undefined || b === undefined || a === 0) {
        return [-1, -1];
    }

    const diff = b - a;
    const diffPercent = (b / a) * 100 - 100;

    return [diff.toFixed(2), diffPercent.toFixed(2)];
};

export const memoizedGetDiffAndDiffPercent = () => {
    const memo = {};

    return (a: number, b: number) => {
        const accessor = `${a},${b}`;

        if (memo[accessor]) {
            return memo[accessor];
        }

        memo[accessor] = getDiffAndDiffPercent(a, b);

        return memo[accessor];
    }
}
