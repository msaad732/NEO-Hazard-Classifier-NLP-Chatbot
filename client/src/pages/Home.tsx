import { useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { CustomCursor } from '@/components/CustomCursor';
import { GlassmorphicPanel } from '@/components/GlassmorphicPanel';
import { ImpactSimulator } from '@/components/ImpactSimulator';
import { AIChat } from '@/components/AIChat';
import { AsteroidDashboard } from '@/components/AsteroidDashboard';
import { MLPredictor } from '@/components/MLPredictor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, MessageSquare, BarChart3, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ cursor: 'none' }}>
      <CosmicBackground />
      <CustomCursor />
      
      <div className="relative z-10">
        <header className="p-6 border-b-2 border-primary/40 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-10 h-10 text-primary animate-pulse-glow" data-testid="icon-logo" />
                <div>
                  <h1 className="text-3xl font-bold text-primary font-sans tracking-wide" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}>
                    NEO-SENTINEL
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono">
                    Empowering Planetary Defense
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary rounded-full animate-pulse-glow">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-mono text-sm font-bold">ONLINE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <GlassmorphicPanel className="p-3">
              <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
                <TabsTrigger 
                  value="dashboard" 
                  data-testid="tab-dashboard"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm sm:text-base transition-all hover:scale-105"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="simulator" 
                  data-testid="tab-simulator"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm sm:text-base transition-all hover:scale-105"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Simulator
                </TabsTrigger>
                <TabsTrigger 
                  value="ml-predictor" 
                  data-testid="tab-ml-predictor"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm sm:text-base transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  ML Predictor
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  data-testid="tab-chat"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm sm:text-base transition-all hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Analyst
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  data-testid="tab-about"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm sm:text-base transition-all hover:scale-105"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  About
                </TabsTrigger>
              </TabsList>
            </GlassmorphicPanel>

            <TabsContent value="dashboard" className="space-y-6">
              <AsteroidDashboard />
            </TabsContent>

            <TabsContent value="simulator">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImpactSimulator />
                <GlassmorphicPanel funky>
                  <h3 className="text-xl font-bold text-primary mb-4 font-sans" style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}>
                    🚀 Simulation Parameters
                  </h3>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg transition-all hover:scale-105 hover:bg-primary/20">
                      <p className="text-muted-foreground mb-2">⚡ Energy Formula</p>
                      <p className="text-foreground text-base">E = 0.5 × m × v²</p>
                    </div>
                    <div className="p-4 bg-secondary/10 border-2 border-secondary rounded-lg transition-all hover:scale-105 hover:bg-secondary/20">
                      <p className="text-muted-foreground mb-2">💥 Crater Estimation</p>
                      <p className="text-foreground text-base">D = 1.8 × (E^0.29)</p>
                    </div>
                    <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg transition-all hover:scale-105 hover:bg-accent/20">
                      <p className="text-muted-foreground mb-2">🌊 Seismic Impact</p>
                      <p className="text-foreground text-base">M = log₁₀(E) + 3.5</p>
                    </div>
                  </div>
                </GlassmorphicPanel>
              </div>
            </TabsContent>

            <TabsContent value="ml-predictor">
              <MLPredictor />
            </TabsContent>

            <TabsContent value="chat">
              <div className="max-w-4xl mx-auto">
                <AIChat />
              </div>
            </TabsContent>

            <TabsContent value="about">
              <GlassmorphicPanel funky>
                <h2 className="text-3xl font-bold text-primary mb-6 font-sans" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}>
                  🛸 Mission Overview
                </h2>
                <div className="space-y-4 font-mono text-sm">
                  <p className="text-foreground leading-relaxed text-base">
                    The Planetary Defence Hub is an advanced monitoring and simulation system
                    designed to track Near-Earth Objects (NEOs) and assess potential impact
                    scenarios. Our AI-powered analysis provides real-time threat assessment
                    and defensive strategy recommendations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-5 bg-primary/10 border-2 border-primary rounded-lg transition-all hover:scale-105 animate-float" style={{ animationDelay: '0s' }}>
                      <h4 className="text-primary font-bold mb-2 text-base">🎯 Real-Time Tracking</h4>
                      <p className="text-muted-foreground text-xs">
                        Monitor asteroids using NASA's NeoWs API with live trajectory updates
                      </p>
                    </div>
                    <div className="p-5 bg-secondary/10 border-2 border-secondary rounded-lg transition-all hover:scale-105 animate-float" style={{ animationDelay: '2s' }}>
                      <h4 className="text-secondary font-bold mb-2 text-base">💥 Impact Simulation</h4>
                      <p className="text-muted-foreground text-xs">
                        Calculate devastation radius, seismic effects, and energy output
                      </p>
                    </div>
                    <div className="p-5 bg-accent/10 border-2 border-accent rounded-lg transition-all hover:scale-105 animate-float" style={{ animationDelay: '4s' }}>
                      <h4 className="text-accent font-bold mb-2 text-base">🤖 AI Analysis</h4>
                      <p className="text-muted-foreground text-xs">
                        Get intelligent threat assessments and defensive recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </GlassmorphicPanel>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="mt-12 p-6 border-t-2 border-primary/40 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground font-mono text-sm">
              🌍 Planetary Defence Hub © 2025 | Protecting Earth from cosmic threats ☄️
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
