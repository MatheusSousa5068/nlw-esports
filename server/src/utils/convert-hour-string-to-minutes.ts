export default function convertHourStringToMinutes(hourString: string) {
    const [hours, minutes] = hourString.split(':').map(Number)

    const amount = hours * 60 + minutes
    return amount
}