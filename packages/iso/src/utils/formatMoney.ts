import millify from 'millify'

const formatMoney = (value: number) =>
    isNaN(value)
        ? '0'
        :
        value < 10000
            ? Math.round(value * 100) / 100
            : millify(Math.round(value * 100) / 100, {
                precision: 3,
                space: true,
            })

export default formatMoney
