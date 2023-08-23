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

    type Admin {
        "Primary key id"
        id: ID!
        "Admin account username"
        username: String!
        "Admin account password"
        email: String!
    }

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

    type Contestant {
        "Primary key id"
        id: ID!
        "Number of the contestant couple"
        number: Int
        "Competition this registration is part of"
        competition: Competition
    }
    
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

    type Final {
        "Primary key id"
        id: ID!
        "Contestants participating in the final"
        contestant: Contestant
        "Array tracking which judges marked which palce"
        judgeMarks: [[Judge]]
    }

    type Heat {
        "Primary key id"
        id: ID!
        contestant: Contestant
        judgeMarks: [Judge]
    }

    type Judge {
        "Primary key id"
        id: ID!
        name: String!
        number: Int
    }

    type Round {
        "Primary key id"
        id: ID!
        contestants: [Contestant]!
        heats: [Heat!]!
        cutoff: Int
        judges: [Judge]
    }
`;