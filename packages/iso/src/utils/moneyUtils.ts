export const getDiffAndDiffPercent = (a?: string, b?: string) => {
    if (a === "" || b === "") {
        return ["", ""];
    }

    const sumA = +a;
    const sumB = +b;

    const diff = sumB - sumA;
    const diffPercent = (sumB / sumA) * 100 - 100;

    return [diff.toFixed(2), diffPercent.toFixed(2) + '%'];
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
