import fetch from 'isomorphic-fetch'

export default async (...args) => {
    const response = await fetch(...args)
    const result = await response.json()
    return result
}

export const fetchText = async (...args) => {
    const response = await fetch(...args)
    const result = await response.text()
    return result
}
