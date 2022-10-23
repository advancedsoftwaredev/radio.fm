import { AddBusinessOutlined } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

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
          speed: { min: 1, max: 2 },
        },
        opacity: {
          value: { min: 0.3, max: 0.4 },
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
    };
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    void loadSlim(engine);
  }, []);

  return <Particles init={particlesInit} options={options} />;
};

export default ParticlesComponent;
