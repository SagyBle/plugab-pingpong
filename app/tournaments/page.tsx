"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TournamentFrontendService from "@/app/frontendServices/tournament.frontendService";
import PlayerFrontendService from "@/app/frontendServices/player.frontendService";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ArrowLeft,
  Clock,
  Award,
  Target,
  Search,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";

interface Tournament {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endOfRegistration: string;
  format: string;
  location: string;
  prizePool: string;
  maxPlayers: number;
  players: any[];
  matches: any[];
  status: string;
  mainImage: string;
  winner: any;
}

export default function TournamentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("id");

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  // Player search state
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setSelectedTournament(null); // Reset selected tournament

    if (tournamentId) {
      fetchTournamentById(tournamentId);
      fetchAllPlayers(); // Fetch players for autocomplete
    } else {
      fetchTournaments();
    }
  }, [tournamentId]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await TournamentFrontendService.getTournaments(true);
      if (response.success && response.data) {
        setTournaments(response.data as Tournament[]);
      } else {
        toast.error("Failed to load tournaments");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentById = async (id: string) => {
    try {
      const response = await TournamentFrontendService.getTournamentById(id);
      if (response.success && response.data) {
        setSelectedTournament(response.data as Tournament);
      } else {
        toast.error("Tournament not found");
        router.push("/tournaments");
      }
    } catch (error) {
      toast.error("An error occurred");
      router.push("/tournaments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const response = await PlayerFrontendService.getPlayers();
      if (response.success && response.data) {
        setAllPlayers(response.data as any[]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleAddPlayerToTournament = async () => {
    if (!selectedPlayer || !selectedTournament) return;

    setAddingPlayer(true);
    try {
      const response = await TournamentFrontendService.addPlayerToTournament(
        selectedPlayer._id,
        selectedTournament._id
      );

      if (response.success) {
        toast.success(`${selectedPlayer.name} added to tournament!`);
        // Refresh tournament data
        await fetchTournamentById(selectedTournament._id);
        setSearchQuery("");
        setSelectedPlayer(null);
      } else {
        toast.error(response.error || "Failed to add player");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setAddingPlayer(false);
      setShowConfirmDialog(false);
    }
  };

  const handlePlayerSelect = (player: any) => {
    setSelectedPlayer(player);
    setShowSuggestions(false);
    setShowConfirmDialog(true);
  };

  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const notAlreadyInTournament = !selectedTournament?.players?.some(
      (p: any) => p._id === player._id
    );
    return matchesSearch && notAlreadyInTournament;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "ONGOING":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "COMPLETED":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
      case "CANCELLED":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Show tournament detail view
  if (selectedTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Navigation */}
        <nav className="border-b bg-white/90 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Plugab Ping-Pong
              </span>
            </Link>
            <div className="flex gap-3">
              <Link href="/tournaments">
                <Button variant="ghost" className="font-medium">
                  Tournaments
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link href="/tournaments">
              <Button variant="ghost" className="mb-6 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Tournaments
              </Button>
            </Link>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">
                  Loading tournament details...
                </p>
              </div>
            ) : (
              <>
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white mb-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${getStatusBadge(
                            selectedTournament.status
                          )}`}
                        >
                          <Target className="w-4 h-4" />
                          {selectedTournament.status}
                        </div>
                        <h1 className="text-5xl font-bold mb-4">
                          {selectedTournament.name}
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl">
                          {selectedTournament.description}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                        <Trophy className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-semibold">
                            {format(
                              new Date(selectedTournament.startDate),
                              "PPP"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(selectedTournament.startDate),
                              "p"
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                          <Clock className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Registration Ends
                          </p>
                          <p className="font-semibold">
                            {format(
                              new Date(selectedTournament.endOfRegistration),
                              "PPP"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(selectedTournament.endOfRegistration),
                              "p"
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-3 rounded-xl">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Players</p>
                          <p className="font-semibold text-2xl">
                            {selectedTournament.players?.length || 0}
                            {selectedTournament.maxPlayers > 0 && (
                              <span className="text-base text-gray-500">
                                {" "}
                                / {selectedTournament.maxPlayers}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-xl">
                          <Award className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prize Pool</p>
                          <p className="font-semibold text-2xl">
                            {selectedTournament.prizePool || "TBA"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Details Section */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Tournament Info */}
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">
                          Tournament Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Format</p>
                          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                            {selectedTournament.format.toUpperCase()}
                          </span>
                        </div>

                        {selectedTournament.location && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Location
                            </p>
                            <div className="flex items-center gap-2 text-lg">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span>{selectedTournament.location}</span>
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Total Matches
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedTournament.matches?.length || 0}
                          </p>
                        </div>

                        {selectedTournament.winner && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Champion 🏆
                            </p>
                            <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 rounded-xl border-2 border-amber-300">
                              <p className="text-xl font-bold text-amber-900">
                                {selectedTournament.winner.name || "TBA"}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Players List */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Participants
                        </CardTitle>
                        <CardDescription>
                          {selectedTournament.players?.length || 0} registered
                          players
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Add Player Input - Only show for UPCOMING tournaments */}
                        {selectedTournament.status === "UPCOMING" && (
                          <div className="mb-4" ref={searchRef}>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="Search players to add..."
                                value={searchQuery}
                                onChange={(e) => {
                                  setSearchQuery(e.target.value);
                                  setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className="pl-9 pr-4"
                              />

                              {/* Suggestions Dropdown */}
                              {showSuggestions && searchQuery && (
                                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {filteredPlayers.length > 0 ? (
                                    filteredPlayers.map((player) => (
                                      <button
                                        key={player._id}
                                        onClick={() =>
                                          handlePlayerSelect(player)
                                        }
                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 flex items-center gap-3"
                                      >
                                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                                          <UserPlus className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">
                                            {player.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {player.email}
                                          </p>
                                        </div>
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                      No players found
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {selectedTournament.players &&
                        selectedTournament.players.length > 0 ? (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedTournament.players.map(
                              (player: any, index: number) => (
                                <div
                                  key={player._id || index}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{player.name}</p>
                                    {player.email && (
                                      <p className="text-xs text-gray-500">
                                        {player.email}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm">
                              No players registered yet
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog
                  open={showConfirmDialog}
                  onOpenChange={setShowConfirmDialog}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Player to Tournament</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to add this player to the
                        tournament?
                      </DialogDescription>
                    </DialogHeader>

                    {selectedPlayer && (
                      <div className="py-4">
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          <p className="font-semibold text-lg mb-1">
                            {selectedPlayer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedPlayer.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedPlayer.phoneNumber}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <Trophy className="w-4 h-4 text-blue-600" />
                          <span>
                            Tournament:{" "}
                            <strong>{selectedTournament?.name}</strong>
                          </span>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowConfirmDialog(false);
                          setSelectedPlayer(null);
                        }}
                        disabled={addingPlayer}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddPlayerToTournament}
                        disabled={addingPlayer}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {addingPlayer ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Player
                          </span>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Show tournaments list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Plugab Ping-Pong
            </span>
          </Link>
          <div className="flex gap-3">
            <Link href="/tournaments">
              <Button variant="ghost" className="font-medium">
                Tournaments
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tournaments
            </h1>
            <p className="text-xl text-gray-600">
              Browse and join exciting competitions
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading tournaments...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-16 text-center">
                <Trophy className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-600 mb-2">
                  No tournaments available
                </p>
                <p className="text-sm text-gray-500">
                  Check back soon for upcoming events!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <Card
                  key={tournament._id}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 hover:-translate-y-1"
                  onClick={() =>
                    router.push(`/tournaments?id=${tournament._id}`)
                  }
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {tournament.name}
                      </CardTitle>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                          tournament.status
                        )}`}
                      >
                        {tournament.status}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2 text-base">
                      {tournament.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>
                        {format(new Date(tournament.startDate), "PPP")}
                      </span>
                    </div>
                    {tournament.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>{tournament.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>
                        {tournament.players?.length || 0}
                        {tournament.maxPlayers > 0 &&
                          ` / ${tournament.maxPlayers}`}{" "}
                        players
                      </span>
                    </div>
                    {tournament.prizePool && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold">
                          {tournament.prizePool}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full font-medium">
                        {tournament.format.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto group-hover:text-blue-600 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
