export const jsonParse = (obj) => {
    try {
        return JSON.parse(obj)
    } catch (error) {
        return {}
    }
}