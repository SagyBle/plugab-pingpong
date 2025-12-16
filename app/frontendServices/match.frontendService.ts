import ApiService from "./api.frontendService";

interface UpdateScoreData {
  matchId: string;
  player1Score: number;
  player2Score: number;
}

interface CreateCustomMatchData {
  tournamentId: string;
  player1Id: string;
  player2Id: string;
  round: number;
  roundName: string;
}

class MatchFrontendService {
  static async updateScore(data: UpdateScoreData) {
    return await ApiService.put("/matches/update-score", data);
  }

  static async createCustomMatch(data: CreateCustomMatchData) {
    return await ApiService.post("/matches/create-custom", data);
  }
}

export default MatchFrontendService;
