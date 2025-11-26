import ApiService from "./api.frontendService";

interface MatchData {
  tournament: string;
  player1: string;
  player2: string;
  player1Score?: number;
  player2Score?: number;
  winner?: string | null;
  textNotes?: string;
  image?: string;
  status?: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
}

class MatchFrontendService {
  static async createMatch(data: MatchData) {
    return await ApiService.post("/matches/create", data);
  }

  static async getMatchById(id: string) {
    return await ApiService.get(`/matches/${id}`);
  }

  static async updateMatch(id: string, data: Partial<MatchData>) {
    return await ApiService.put(`/matches/${id}`, data);
  }

  static async deleteMatch(id: string) {
    return await ApiService.delete(`/matches/${id}`);
  }
}

export default MatchFrontendService;

