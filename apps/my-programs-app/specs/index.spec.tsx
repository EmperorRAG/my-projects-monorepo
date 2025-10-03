import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';
import { describe, it, expect } from '@jest/globals';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
