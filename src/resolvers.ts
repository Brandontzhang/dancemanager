import { Resolvers } from "./types";

export const resolvers: Resolvers = {
    Query: {
        competitions: async (_, __, { dataSources }) => {
            return dataSources.db.getCompetitions();
        },
    },

    Mutation: {
        loginAdmin: (_, { username, password }, { dataSources }) => {
            return dataSources.db.loginAdmin(username, password);
        },
        loginJudge: (_, { username, password, competitionId }, { dataSources }) => {
            return dataSources.db.loginJudge(username, password, competitionId);
        },
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
        },
        createJudges: async (_, { usernames, password, competitionId }, { dataSources }) => {
            try {
                const newJudges = await dataSources.db.createJudges(usernames, password, competitionId);
                return {
                    code: "success",
                    success: true,
                    message: `Successfully created ${usernames.length} new judge`,
                    judges: newJudges.map(judge => {
                        return {
                            id: judge.id,
                            username: judge.username,
                            number: judge.number
                        }
                    })
                }
            } catch (err) {
                return {
                    code: err.code,
                    success: false,
                    message: err,
                    judges: null
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