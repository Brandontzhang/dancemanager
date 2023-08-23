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

export type AdminModel = {
    id: string, 
    username: string,
    email: string
}