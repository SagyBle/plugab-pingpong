import ApiService from "./api.frontendService";

interface UpdateScoreData {
  matchId: string;
  player1Score: number;
  player2Score: number;
}

class MatchFrontendService {
  static async updateScore(data: UpdateScoreData) {
    return await ApiService.put("/matches/update-score", data);
  }
}

export default MatchFrontendService;
