import gql from "graphql-tag"

export const typeDefs = gql`
    type Query {
        "Get the list of competitions"
        competitions: [Competition]!
    }

    type Admin {
        id: ID!
        username: String!
        email: String!
    }

    type Competition {
        id: ID!,
        name: String!
        date: String
        judges: [Judge]!
        contestants: [Contestant]!
        currentEvent: Event
        events: [Event]!
        eventQueue: [Event]!
    }

    type Contestant {
        id: ID!
        number: Int
        competition: Competition
    }
    
    type Event {
        id: ID!
        name: String!
        description: String
        complete: Boolean
        rounds: [Round]
        final: Final
    }

    type Final {
        id: ID!
        contestant: Contestant
        judgeMarks: [[Judge]]
    }

    type Heat {
        id: ID!
        contestant: Contestant
        judgeMarks: [Judge]
    }

    type Judge {
        id: ID!
        name: String!
        number: Int
    }

    type Round {
        id: ID!
        contestants: [Contestant]!
        heats: [Heat!]!
        cutoff: Int
        judges: [Judge]
    }
`