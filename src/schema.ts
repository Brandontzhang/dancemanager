import gql from "graphql-tag"

export const typeDefs = gql`
    type Query {
        "Query for an admin account with username and password information"
        loginAdmin(username: String, password: String): Admin
        "Get the list of competitions"
        competitions: [Competition]!
    }

    type Mutation {
        "Create an admin account (for super admin use)"
        createAdmin(username: String, password: String, email: String): createAdminResponse!
    }

    "Response containing details from a request creating a new admin account"
    type createAdminResponse {
        "Similar to HTTP status code, represents the status of the mutation"
        code: String!
        "Indicates whether the mutation was successful"
        success: Boolean!
        "Human-readable message for the UI"
        message: String!
        "Newly create admin account information"
        admin: Admin
    }

    "Administrator account for running a competition"
    type Admin {
        "Primary key id"
        id: ID!
        "Admin account username"
        username: String!
        "Admin account password"
        email: String!
    }

    "A competition holding references to judges, contestants, and events"
    type Competition {
        "Primary key id"
        id: ID!,
        "Competition name"
        name: String!
        "Start date of competition"
        date: String
        "Judges partaking in the competition"
        judges: [Judge]!
        "Contestant couples registered for the competition"
        contestants: [Contestant]!
        "All events created for the competition"
        events: [Event]!
        "Queue of upcoming events to be run"
        eventQueue: [Event]!
    }

    "A contestant is a couple with a number assigned"
    type Contestant {
        "Primary key id"
        id: ID!
        "Number of the contestant couple"
        number: Int
        "Competition this registration is part of"
        competition: Competition
    }

    "Record tracking how a contestant performed in a particular round"
    type ContestantRound {
        "Primary key id"
        id: ID!
        "Reference to the contestant record"
        contestant: Contestant!
        "Tracking which judges marked the couple for this round"
        judgeMarks: [Judge]
    }

    "Record tracking how a contestant perfomed in the final round, key difference from normal rounds is that actual placements are considered"
    type ContestantFinal {
        "Primary key id"
        id: ID!
        "Reference to the contestant record"
        contestant: Contestant!
        "Tracking which judges marked the couple for which place"
        judgeMarks: [[Judge]]
    }

    "An event is made of several rounds, each comprising of at least one heat, culminating in a final with placements"
    type Event {
        "Primary key id"
        id: ID!
        "Name of the event"
        name: String!
        "Description of the event"
        description: String
        "If the event has been completed (final has been finished)"
        complete: Boolean
        "A record of rounds (ex. 1st round, quarter-final, semi-final)"
        rounds: [Round]
        "A record of the final containing the judges' marks and contestant placements"
        final: Final
    }

    "The final round of an event where contestants are ranked by the judges"
    type Final {
        "Primary key id"
        id: ID!
        "Records for dontestants participating in the final"
        contestantFinal: [ContestantFinal!]!
    }

    "When a round has too many contestants to be ran all at once, it is broken down into heats"
    type Heat {
        "Primary key id"
        id: ID!
        "Records for dontestants participating in the heat"
        contestantMarks: [ContestantMarks!]!
    }

    "Judge account marking contestants"
    type Judge {
        "Primary key id"
        id: ID!
        "Name of the judge"
        name: String!
        "Judge number for reference in case of anonimity"
        number: Int
    }

    "One round of an event, comprising of at least one heat"
    type Round {
        "Primary key id"
        id: ID!
        "Contestants participating in the round"
        contestants: [Contestant]!
        "NUmber of heats in the round"
        heats: [Heat!]!
        "Amount each judge is expected to recall for the next round (number they should mark down)"
        cutoff: Int
        "Judges participating in the round"
        judges: [Judge]
    }
`;