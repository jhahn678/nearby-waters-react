export const colors: string[] = [
    '#e6194B', '#ffe119', '#02b039', 
    '#f032e6', '#bfef45', '#f58231', 
    '#4363d8', '#808000', '#800000'
]

export const genColor = (index: number): string => {
    return colors[index % colors.length]
}