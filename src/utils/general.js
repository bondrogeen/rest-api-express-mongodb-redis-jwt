import lang from '../locales/index'

const getLocaleError = lang()

export const jsonParse = (obj) => {
    try {
        return JSON.parse(obj)
    } catch (error) {
        return {}
    }
}



const mapErrors = (errors) => errors.reduce((acc, i) => {
    if (!acc?.[i.path]) acc[i.path] = []
    acc[i.path].push(getLocaleError(i.msg))
    return acc
}, {})

export const getErrors = (errors) => ({ errors: mapErrors(errors) })

export const isNumber = (num) => typeof num === 'number' && !isNaN(num);

export const getNumber = (num, def = 1) => isNumber(+num) ? +num : def

