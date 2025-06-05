import HeaderText from "@/components/HeaderText";
import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";
import GameStats from "@/components/GameStats";
import FuturePassWallet from "@/components/FuturePassWallet";
import GameRewards from "@/components/GameRewards";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sharp-black to-[#150012] text-white">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
        <div className="mb-10">
          <GameCarousel />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <MostPlayed />
          </div>
          
          <div className="space-y-6">
            <FuturePassWallet />
            <GameRewards />
          </div>
        </div>
      </div>
    </div>
  );
}
