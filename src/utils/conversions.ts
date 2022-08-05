export const milesToKM = (miles: number) => {
    const kilometers = miles * 1.60934;
    return kilometers;
}

export const capitalize = (str: string): string => {
    const split = str.split('')
    return split[0].toUpperCase() + split.slice(1).join('')

}

export const capitalizePhrase = (str: string): string => {
    const split = str.split(' ')
    const result = []
    for(let word of split){
        result.push(capitalize(word))
    }
    return result.join(' ')
}
