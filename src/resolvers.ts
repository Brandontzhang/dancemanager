import { Resolvers } from "./types";

export const resolvers: Resolvers = {
    Query: {
        loginAdmin: (_, { username, password }, { dataSources }) => {
            return dataSources.db.loginAdmin(username, password);
        },
        competitions: async (_, __, { dataSources }) => {
            return dataSources.db.getCompetitions();
        },
    },

    Mutation: {
        createAdmin: async (_, { username, password, email }, { dataSources }) => {
            try {
                const newAdmin = await dataSources.db.createAdmin(username, password, email);
                return {
                    code: "success",
                    success: true,
                    message: `Successfully created new admin user ${username}`,
                    admin: {
                        id: newAdmin.id,
                        username: newAdmin.username,
                        email: newAdmin.email
                    }
                }
            } catch (err) {
                return {
                    code: err.extensions.response.code,
                    success: false,
                    message: err.extensions.response.body,
                    admin: null
                }
            }
        }
    },

    Competition: {
        judges: async ({ id }, _, { dataSources }) => {
            return dataSources.db.getJudgesByCompetitionId(id);
        },
        contestants: async ({ id }, _, { dataSources }) => {
            return dataSources.db.getContestantsByCompetitionId(id);
        },
        events: async({ id }, _, { dataSources }) => {
            return dataSources.db.getEventsByCompetitionId(id);
        },
        eventQueue: async ({ id }, _, { dataSources }) => {
            return dataSources.db.getEventQueueByCompetitionId(id);
        }
    }
}