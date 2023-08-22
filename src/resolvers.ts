import { Resolvers } from "./types";
import { CompetitionModel } from './models'

export const resolvers: Resolvers = {
    Query:  {
        competitions: async (_, __, { dataSources }) => {
            const data : CompetitionModel[] = await dataSources.db.getCompetitions();
            return [];
        },
    }
}