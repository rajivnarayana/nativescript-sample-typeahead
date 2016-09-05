export function delay(milli = 3000) : Promise<any> {
    return new Promise(resolve => setTimeout(resolve, milli)); 
}