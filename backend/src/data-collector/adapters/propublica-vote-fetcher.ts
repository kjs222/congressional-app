import * as axios from "axios";
import {
  propublicaRecentVotesSchema,
  propublicaVoteResultSchema,
  RecentVotesResponse,
  VoteResult,
} from "../../types/propublica-schemas";
import { VoteFetcher } from "../ports/vote-fetcher";
import { Chamber } from "../../types";

export class ProPublicaVoteFetcher implements VoteFetcher {
  private readonly _apiKey: string;
  private readonly _axios: axios.AxiosInstance;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
    this._axios = axios.default.create({
      baseURL: "https://api.propublica.org/congress/v1/",
      headers: {
        "X-API-Key": this._apiKey,
      },
    });
  }

  async getRecentVotes(
    chamber: string,
    offset: number = 0
  ): Promise<RecentVotesResponse> {
    const query = offset ? `?offset=${offset}` : "";
    const response = await this._axios.get(
      `${chamber}/votes/recent.json${query}`
    );
    const results = response.data.results;
    return propublicaRecentVotesSchema.parse(results);
  }

  async getVote(
    congress: number,
    chamber: Chamber,
    session: number,
    rollCall: number
  ): Promise<VoteResult> {
    const response = await this._axios.get(
      `${congress}/${chamber}/sessions/${session}/votes/${rollCall}.json`
    );
    const results = response.data.results;
    return propublicaVoteResultSchema.parse(results);
  }
}
