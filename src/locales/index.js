import en from './en'

const getValue = (object, keys) => {
    const [key, ...all] = keys
    const value = object?.[key] || ''
    return (typeof value === 'object') ? getValue(value, all) : value
}

export default (local = 'en') => {
    const lang = { en }
    return (value) => getValue(lang[local], value.split('.')) || value
}