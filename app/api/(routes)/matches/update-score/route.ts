import { NextRequest } from "next/server";
import DashboardMongoDBService from "@/app/api/backendServices/mongodb/dashboard/dashboardMongodb.backendService";
import BackendApiService from "@/app/api/backendServices/api.backendService";

export async function PUT(request: NextRequest) {
  try {
    const { matchId, player1Score, player2Score } = await request.json();

    if (!matchId) {
      return BackendApiService.errorResponse("Match ID is required", 400);
    }

    if (player1Score === undefined || player2Score === undefined) {
      return BackendApiService.errorResponse("Both scores are required", 400);
    }

    const mongoService = await DashboardMongoDBService.getInstance();

    // Get the match
    const match = await mongoService.Match.findById(matchId)
      .populate("player1", "name")
      .populate("player2", "name")
      .lean();

    if (!match) {
      return BackendApiService.errorResponse("Match not found", 404);
    }

    // Determine winner based on scores
    let winner = null;
    let status = "COMPLETED";

    if (player1Score > player2Score) {
      winner = match.player1?._id || null;
    } else if (player2Score > player1Score) {
      winner = match.player2?._id || null;
    } else {
      // Tie - match not completed
      status = "IN_PROGRESS";
    }

    // Update match
    const updatedMatch = await mongoService.Match.findByIdAndUpdate(
      matchId,
      {
        player1Score,
        player2Score,
        winner,
        status,
      },
      { new: true }
    )
      .populate("player1", "name phoneNumber")
      .populate("player2", "name phoneNumber")
      .populate("winner", "name")
      .lean();

    return BackendApiService.successResponse(
      updatedMatch,
      "Match score updated successfully"
    );
  } catch (error) {
    return BackendApiService.handleError(error);
  }
}
