import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Zap, Award, TrendingUp } from "lucide-react";

export default function Home() {
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
            <Link href="/tournament/register">
              <Button variant="ghost" className="font-medium">
                Register
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Admin Login
              </Button>
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 animate-bounce">
              <Trophy className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Join the Ultimate
            <span className="block mt-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ping-Pong Tournament
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Register for exciting tournaments, compete with the best players,
            and track your journey to becoming a champion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tournament/register">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Register Now
                <Zap className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-sm text-gray-600 mt-1">Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                200+
              </div>
              <div className="text-sm text-gray-600 mt-1">Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                $10K+
              </div>
              <div className="text-sm text-gray-600 mt-1">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Upcoming Events
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Browse and register for upcoming tournaments with various formats
              and prize pools. Never miss an opportunity!
            </p>
          </div>
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Compete & Connect
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Play against skilled opponents in league, knockout, or mixed
              format tournaments. Build your network!
            </p>
          </div>
          <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Win Big Prizes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Compete for glory and exciting prizes in our professionally
              organized tournaments with amazing rewards!
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-500/30">
          <Award className="w-16 h-16 mx-auto text-white/90 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of players competing for glory and prizes
          </p>
          <Link href="/tournament/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-50 shadow-xl"
            >
              Register for Tournament
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Plugab Ping-Pong
              </span>
            </div>
            <p className="text-gray-600">
              &copy; 2025 Plugab Ping-Pong. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
