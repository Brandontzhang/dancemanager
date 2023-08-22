import { Resolvers } from "./types";

export const resolvers: Resolvers = {
    Query: {
        competitions: async (_, __, { dataSources }) => {
            return dataSources.db.getCompetitions();
        },
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