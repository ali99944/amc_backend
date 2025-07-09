export const parseBoolean = (value) => {
    const valid_booleans = ['true', 'false']

    if(!valid_booleans.includes(value)) throw new Error("not a valid boolean")

    return value === 'true'
}


export const parseArray = (value) => {
    try {
        return JSON.parse(value)
    } catch(error) {
        throw "not valid array"
    }
}