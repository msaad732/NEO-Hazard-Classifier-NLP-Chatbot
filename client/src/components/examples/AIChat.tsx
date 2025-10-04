import { AIChat } from '../AIChat';
import { CosmicBackground } from '../CosmicBackground';

export default function AIChatExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div className="max-w-3xl w-full">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
