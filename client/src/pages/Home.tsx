import { useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { CustomCursor } from '@/components/CustomCursor';
import { GlassmorphicPanel } from '@/components/GlassmorphicPanel';
import { ImpactSimulator } from '@/components/ImpactSimulator';
import { AIChat } from '@/components/AIChat';
import { AsteroidDashboard } from '@/components/AsteroidDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, MessageSquare, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ cursor: 'none' }}>
      <CosmicBackground />
      <CustomCursor />
      
      <div className="relative z-10">
        <header className="p-6 border-b border-primary/30 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" data-testid="icon-logo" />
                <div>
                  <h1 className="text-2xl font-bold text-primary font-sans tracking-wide">
                    PLANETARY DEFENCE HUB
                  </h1>
                  <p className="text-xs text-muted-foreground font-mono">
                    Advanced Asteroid Impact Monitoring System
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-mono text-sm">ONLINE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <GlassmorphicPanel className="p-2">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
                <TabsTrigger 
                  value="dashboard" 
                  data-testid="tab-dashboard"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="simulator" 
                  data-testid="tab-simulator"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Simulator
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  data-testid="tab-chat"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Analyst
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  data-testid="tab-about"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono"
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
                <GlassmorphicPanel>
                  <h3 className="text-xl font-bold text-primary mb-4 font-sans">
                    Simulation Parameters
                  </h3>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-3 bg-primary/10 border border-primary rounded-md">
                      <p className="text-muted-foreground mb-1">Energy Formula</p>
                      <p className="text-foreground">E = 0.5 × m × v²</p>
                    </div>
                    <div className="p-3 bg-secondary/10 border border-secondary rounded-md">
                      <p className="text-muted-foreground mb-1">Crater Estimation</p>
                      <p className="text-foreground">D = 1.8 × (E^0.29)</p>
                    </div>
                    <div className="p-3 bg-accent/10 border border-accent rounded-md">
                      <p className="text-muted-foreground mb-1">Seismic Impact</p>
                      <p className="text-foreground">M = log₁₀(E) + 3.5</p>
                    </div>
                  </div>
                </GlassmorphicPanel>
              </div>
            </TabsContent>

            <TabsContent value="chat">
              <div className="max-w-4xl mx-auto">
                <AIChat />
              </div>
            </TabsContent>

            <TabsContent value="about">
              <GlassmorphicPanel>
                <h2 className="text-2xl font-bold text-primary mb-6 font-sans">
                  Mission Overview
                </h2>
                <div className="space-y-4 font-mono text-sm">
                  <p className="text-foreground leading-relaxed">
                    The Planetary Defence Hub is an advanced monitoring and simulation system
                    designed to track Near-Earth Objects (NEOs) and assess potential impact
                    scenarios. Our AI-powered analysis provides real-time threat assessment
                    and defensive strategy recommendations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-primary/10 border border-primary rounded-md">
                      <h4 className="text-primary font-bold mb-2">Real-Time Tracking</h4>
                      <p className="text-muted-foreground text-xs">
                        Monitor asteroids using NASA's NeoWs API with live trajectory updates
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/10 border border-secondary rounded-md">
                      <h4 className="text-secondary font-bold mb-2">Impact Simulation</h4>
                      <p className="text-muted-foreground text-xs">
                        Calculate devastation radius, seismic effects, and energy output
                      </p>
                    </div>
                    <div className="p-4 bg-accent/10 border border-accent rounded-md">
                      <h4 className="text-accent font-bold mb-2">AI Analysis</h4>
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

        <footer className="mt-12 p-6 border-t border-primary/30 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground font-mono text-xs">
              Planetary Defence Hub © 2025 | Protecting Earth from cosmic threats
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
