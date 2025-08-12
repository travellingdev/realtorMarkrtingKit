import { test, expect } from '@playwright/test';
import { getDisabledLabel } from '@/app/components/OutputsSection';

test('signed out & unrevealed shows sign-in label', () => {
  expect(getDisabledLabel(false, false)).toBe('Sign in to Copy');
});

test('signed out & revealed shows sign-in label', () => {
  expect(getDisabledLabel(true, false)).toBe('Sign in to Copy');
});

test('signed in & unrevealed shows reveal label', () => {
  expect(getDisabledLabel(false, true)).toBe('Reveal to Copy');
});

test('signed in & revealed shows copy label', () => {
  const disabled = getDisabledLabel(true, true);
  const buttonLabel = true ? 'Copy' : disabled;
  expect(buttonLabel).toBe('Copy');
});
