import { X } from 'lucide-react';
import { useGameStore, PlanetData } from '@/store/gameStore';
import { useEffect, useState } from 'react';

export const PlanetInfoModal = () => {
  const { selectedPlanet, setSelectedPlanet } = useGameStore();
  const [isVisible, setIsVisible] = useState(false);
  const [displayPlanet, setDisplayPlanet] = useState<PlanetData | null>(null);

  useEffect(() => {
    if (selectedPlanet) {
      setDisplayPlanet(selectedPlanet);
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setTimeout(() => setDisplayPlanet(null), 300);
    }
  }, [selectedPlanet]);

  if (!displayPlanet) return null;

  return (
    <div
      className={`fixed top-1/2 right-4 md:right-8 -translate-y-1/2 z-40 w-80 md:w-96 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="glass-panel-strong p-6">
        {/* Close button */}
        <button
          onClick={() => setSelectedPlanet(null)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary/20 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-primary" />
        </button>

        {/* Planet indicator */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-4 h-4 rounded-full planet-glow"
            style={{ backgroundColor: displayPlanet.color }}
          />
          <span className="font-exo text-sm text-muted-foreground uppercase tracking-wider">
            {displayPlanet.name}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-orbitron text-2xl font-bold text-primary glow-text-subtle mb-3">
          {displayPlanet.title}
        </h2>

        {/* Description */}
        <p className="font-exo text-muted-foreground text-sm mb-6 leading-relaxed">
          {displayPlanet.description}
        </p>

        {/* Details list */}
        <div className="space-y-2">
          {displayPlanet.details.map((detail, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/50 border border-primary/10 transition-all duration-200 hover:border-primary/30 hover:bg-secondary/70"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-exo text-sm text-foreground/90">
                {detail}
              </span>
            </div>
          ))}
        </div>

        {/* Ring data for Saturn */}
        {displayPlanet.hasRings && displayPlanet.ringData && (
          <div className="mt-6 pt-4 border-t border-primary/20">
            <h3 className="font-orbitron text-sm text-primary mb-3">
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {displayPlanet.ringData.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-exo rounded-full bg-primary/20 text-primary border border-primary/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
