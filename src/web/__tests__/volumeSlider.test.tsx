import { render, screen, waitFor } from '@testing-library/react';

import { SongContextProvider, volumeKey } from '../components/hooks/songContext';
import VolumeSlider from '../components/VolumeSlider';

const volumeSliderTestId = 'volume-slider';
const getSlider = () => screen.getByTestId(volumeSliderTestId).querySelector('.MuiSlider-track');

describe('volume slider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads localStorage correctly', async () => {
    localStorage.setItem(volumeKey, JSON.stringify(0.5));

    const { unmount } = render(
      <SongContextProvider>
        <VolumeSlider />
      </SongContextProvider>
    );

    await waitFor(() => {
      expect(getSlider()).toHaveStyle({ width: '50%' });
    });

    unmount();

    localStorage.setItem(volumeKey, JSON.stringify(0.75));

    render(
      <SongContextProvider>
        <VolumeSlider />
      </SongContextProvider>
    );

    await waitFor(() => {
      expect(getSlider()).toHaveStyle({ width: '75%' });
    });
  });
});

export {};
