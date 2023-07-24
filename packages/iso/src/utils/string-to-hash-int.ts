export default (str: string) => {
    let arr = String(str).split('');
    return Math.abs(arr.reduce(
        (hashCode, currentVal) =>
            (hashCode =
                currentVal.charCodeAt(0) +
                (hashCode << 6) +
                (hashCode << 16) -
                hashCode),
        0
    ));
};