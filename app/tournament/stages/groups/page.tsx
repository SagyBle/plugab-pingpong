"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import GroupFrontendService from "@/app/frontendServices/group.frontendService";
import { toast } from "sonner";
import {
  Trophy,
  Users,
  ArrowLeft,
  Shuffle,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface Tournament {
  _id: string;
  name: string;
  description: string;
  players: any[];
  groups: any[];
  status: string;
}

interface GroupPlayer {
  player: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
  points: number;
  wins: number;
  losses: number;
  pointDifference: number;
  matchesPlayed: number;
}

interface Group {
  _id: string;
  name: string;
  players: GroupPlayer[];
  standings: GroupPlayer[];
  matches: any[];
  status: string;
  numberOfAdvancingPlayers: number;
}

function GroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("tournamentId");

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [playersPerGroup, setPlayersPerGroup] = useState<number>(4);
  const [generating, setGenerating] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      const response = await TournamentFrontendService.getTournamentById(
        tournamentId!
      );
      if (response.success && response.data) {
        setTournament(response.data as Tournament);
      } else {
        toast.error("הטורניר לא נמצא");
        router.push("/tournament/register");
      }
    } catch (error) {
      toast.error("אירעה שגיאה");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await GroupFrontendService.getGroupsByTournament(
        tournamentId!
      );
      if (response.success && response.data) {
        setGroups(response.data as Group[]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleGenerateGroups = async () => {
    if (groups.length > 0) {
      setShowWarningDialog(true);
      return;
    }
    await generateGroups();
  };

  const generateGroups = async () => {
    setGenerating(true);
    try {
      const response = await GroupFrontendService.createGroups({
        tournamentId: tournamentId!,
        playersPerGroup,
      });

      if (response.success) {
        toast.success("הקבוצות נוצרו בהצלחה!");
        await fetchGroups();
        setShowWarningDialog(false);
      } else {
        toast.error(response.error || "נכשל ביצירת קבוצות");
      }
    } catch (error) {
      toast.error("אירעה שגיאה");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteGroups = async () => {
    setDeleting(true);
    try {
      const response = await GroupFrontendService.deleteGroups(tournamentId!);

      if (response.success) {
        toast.success("כל הקבוצות נמחקו");
        setGroups([]);
        setShowDeleteDialog(false);
      } else {
        toast.error(response.error || "נכשל במחיקת קבוצות");
      }
    } catch (error) {
      toast.error("אירעה שגיאה");
    } finally {
      setDeleting(false);
    }
  };

  if (!tournamentId) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="max-w-md mx-3">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-3" />
            <p className="text-lg text-gray-600 mb-2">לא נבחר טורניר</p>
            <p className="text-sm text-gray-500 mb-4">
              אנא בחר טורניר מרשימת הטורנירים
            </p>
            <Link href="/tournament/register">
              <Button>חזרה לטורנירים</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white fixed w-full top-0 z-50" dir="rtl">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <Image
                src="/icons/liviatan.png"
                alt="Leviathan Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              פינג פונג לוויתן
            </span>
          </Link>
          <div className="flex gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                כניסת מנהל
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/tournament/register">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-sm"
              dir="rtl"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              חזרה
            </Button>
          </Link>

          {loading ? (
            <div className="text-center py-12" dir="rtl">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-3 text-sm text-center">טוען...</p>
            </div>
          ) : (
            <>
              {/* Tournament Header */}
              <div
                className="bg-white rounded-lg p-4 sm:p-6 mb-4 border"
                dir="rtl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold mb-1 text-gray-900 text-right">
                      {tournament?.name}
                    </h1>
                    <p className="text-sm text-gray-600 text-right">
                      שלב הקבוצות - {tournament?.players?.length || 0} שחקנים
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <Card className="border mb-6">
                <CardHeader className="pb-3" dir="rtl">
                  <CardTitle className="text-lg text-right">
                    יצירת קבוצות
                  </CardTitle>
                  <CardDescription className="text-sm text-right">
                    הגדר כמה שחקנים בכל קבוצה וצור קבוצות באופן אקראי
                  </CardDescription>
                </CardHeader>
                <CardContent dir="rtl">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    <div className="w-full sm:w-40">
                      <Label
                        htmlFor="playersPerGroup"
                        className="text-right block mb-1.5"
                      >
                        שחקנים לקבוצה
                      </Label>
                      <Input
                        id="playersPerGroup"
                        type="number"
                        min="2"
                        max="10"
                        value={playersPerGroup}
                        onChange={(e) =>
                          setPlayersPerGroup(Number(e.target.value))
                        }
                        className="text-center"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={handleGenerateGroups}
                        disabled={generating || !tournament?.players?.length}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        {generating ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-3.5 w-3.5"
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
                            יוצר...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            צור קבוצות
                            <Shuffle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </Button>
                      {groups.length > 0 && (
                        <Button
                          onClick={() => setShowDeleteDialog(true)}
                          variant="destructive"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Trash2 className="w-3.5 h-3.5 ml-1.5" />
                          מחק הכל
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Groups Display */}
              {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map((group) => (
                    <Card key={group._id} className="border">
                      <CardHeader className="pb-3" dir="rtl">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-right">
                            {group.name}
                          </CardTitle>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              group.status === "NOT_STARTED"
                                ? "bg-gray-100 text-gray-700"
                                : group.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {group.status}
                          </span>
                        </div>
                        <CardDescription className="text-sm text-right">
                          {group.players.length} שחקנים ·{" "}
                          {group.numberOfAdvancingPlayers} עולים
                        </CardDescription>
                      </CardHeader>
                      <CardContent dir="rtl">
                        {/* Standings Table */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold mb-2 text-right">
                            טבלה
                          </h3>
                          <div className="border rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 grid grid-cols-6 gap-2 px-3 py-2 text-xs font-medium text-gray-700">
                              <div className="text-right">#</div>
                              <div className="col-span-2 text-right">שחקן</div>
                              <div className="text-center">נק׳</div>
                              <div className="text-center">הפרש</div>
                              <div className="text-center">משחקים</div>
                            </div>
                            {/* Table Body */}
                            {group.standings.map((playerData, index) => (
                              <div
                                key={playerData.player._id}
                                className={`grid grid-cols-6 gap-2 px-3 py-2.5 text-sm border-t ${
                                  index < group.numberOfAdvancingPlayers
                                    ? "bg-green-50"
                                    : ""
                                }`}
                              >
                                <div className="text-right font-medium">
                                  {index + 1}
                                </div>
                                <div className="col-span-2 text-right truncate">
                                  {playerData.player.name}
                                </div>
                                <div className="text-center font-semibold">
                                  {playerData.points}
                                </div>
                                <div className="text-center">
                                  {playerData.pointDifference > 0 ? "+" : ""}
                                  {playerData.pointDifference}
                                </div>
                                <div className="text-center text-gray-600">
                                  {playerData.matchesPlayed}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Matches Section */}
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-right">
                            משחקים
                          </h3>
                          {group.matches.length > 0 ? (
                            <div className="space-y-2">
                              {group.matches.map(
                                (match: any, index: number) => (
                                  <div
                                    key={match._id || index}
                                    className="bg-gray-50 rounded-lg p-2.5 text-sm"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-right flex-1">
                                        {match.player1?.name || "שחקן 1"}
                                      </span>
                                      <span className="px-2 text-gray-500">
                                        vs
                                      </span>
                                      <span className="text-left flex-1">
                                        {match.player2?.name || "שחקן 2"}
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
                              טרם נוצרו משחקים
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border">
                  <CardContent className="py-12 text-center" dir="rtl">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-lg text-gray-600 mb-2">
                      טרם נוצרו קבוצות
                    </p>
                    <p className="text-sm text-gray-500">
                      הגדר כמה שחקנים בכל קבוצה וצור קבוצות
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Warning Dialog for Regeneration */}
              <Dialog
                open={showWarningDialog}
                onOpenChange={setShowWarningDialog}
              >
                <DialogContent
                  className="w-[calc(100%-2rem)] sm:max-w-md"
                  dir="rtl"
                >
                  <DialogHeader>
                    <DialogTitle className="text-base text-right flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      אזהרה
                    </DialogTitle>
                    <DialogDescription className="text-sm text-right">
                      כבר קיימות {groups.length} קבוצות. יצירת קבוצות חדשות תמחק
                      את הקבוצות הקיימות ואת כל המשחקים. האם להמשיך?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowWarningDialog(false)}
                      disabled={generating}
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      ביטול
                    </Button>
                    <Button
                      onClick={async () => {
                        await handleDeleteGroups();
                        await generateGroups();
                      }}
                      disabled={generating}
                      className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      כן, צור מחדש
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <DialogContent
                  className="w-[calc(100%-2rem)] sm:max-w-md"
                  dir="rtl"
                >
                  <DialogHeader>
                    <DialogTitle className="text-base text-right flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      מחיקת כל הקבוצות
                    </DialogTitle>
                    <DialogDescription className="text-sm text-right">
                      פעולה זו תמחק את כל {groups.length} הקבוצות ואת המשחקים
                      שלהן. האם אתה בטוח?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={deleting}
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      ביטול
                    </Button>
                    <Button
                      onClick={handleDeleteGroups}
                      disabled={deleting}
                      variant="destructive"
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      {deleting ? "מוחק..." : "כן, מחק הכל"}
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

export default function GroupsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">טוען...</div>
        </div>
      }
    >
      <GroupsPage />
    </Suspense>
  );
}
