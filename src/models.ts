export type CompetitionModel = {
    id: number,
    name: string,
    date: string,
    judges: [number],
    contestants: [number],
    currentEvent: number,
    events: [number],
    eventQueue: [number],
}