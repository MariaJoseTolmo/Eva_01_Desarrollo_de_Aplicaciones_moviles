/**
 * App.test.tsx
 * Smoke test: verifica que la aplicación renderiza sin crashear.
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('debe renderizar sin errores', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
  });
});
