import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

import { useCallback, useMemo } from 'react';
import { Engine } from 'tsparticles-engine';

const ParticlesComponent = () => {
  const options = useMemo(() => {
    return {
      fullscreen: {
        enable: true,
        zIndex: -1,
      },
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
      },
      particles: {
        color: {
          value: '#FFF',
        },
        links: {
          color: {
            value: '#777',
          },
          enable: true,
        },
        move: {
          enable: true,
          speed: { min: 1, max: 1 },
        },
        opacity: {
          value: { min: 0.3, max: 0.4 },
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
    };
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    loadSlim(engine);
  }, []);

  return <Particles init={particlesInit} options={options} />;
};

export default ParticlesComponent;
