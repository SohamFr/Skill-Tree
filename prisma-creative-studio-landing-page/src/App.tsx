import { Hero } from "./components/Hero";
import { GitHubAnalyzer } from "./components/GitHubAnalyzer";
import { DeploymentVerifier } from "./components/DeploymentVerifier";
import { ProofLedger } from "./components/ProofLedger";
import { Leaderboard } from "./components/Leaderboard";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="w-full bg-black text-[#DEDBC8] selection:bg-[#DEDBC8] selection:text-black">
      <Hero />
      <GitHubAnalyzer />
      <DeploymentVerifier />
      <ProofLedger />
      <Leaderboard />
      <Footer />
    </div>
  );
}
