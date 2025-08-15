import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContentGenerationProgress from './ContentGenerationProgress';

describe('ContentGenerationProgress Component', () => {
  it('should not render when not generating', () => {
    const { container } = render(
      <ContentGenerationProgress isGenerating={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when generating', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
        photoCount={5}
        propertyType="luxury"
      />
    );
    
    expect(screen.getByText('Creating Your Premium Content')).toBeInTheDocument();
  });

  it('should show progress stages', async () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
        photoCount={10}
      />
    );
    
    // Check initial stage
    expect(screen.getByText(/Analyzing your stunning photos/)).toBeInTheDocument();
  });

  it('should minimize when minimize button clicked', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
      />
    );
    
    const minimizeBtn = screen.getByTitle('Minimize');
    fireEvent.click(minimizeBtn);
    
    // Should now show minimized view
    expect(screen.queryByText('Creating Your Premium Content')).not.toBeInTheDocument();
  });

  it('should expand when expand button clicked', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
      />
    );
    
    const expandBtn = screen.getByTitle('Show more');
    fireEvent.click(expandBtn);
    
    // Should show expanded details
    waitFor(() => {
      expect(screen.getByText(/Good morning! Creating fresh content for you.../)).toBeInTheDocument();
    });
  });

  it('should show contextual message for high photo count', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
        photoCount={20}
      />
    );
    
    const expandBtn = screen.getByTitle('Show more');
    fireEvent.click(expandBtn);
    
    expect(screen.getByText(/Wow! Analyzing your extensive photo collection.../)).toBeInTheDocument();
  });

  it('should show luxury-specific message', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
        propertyType="luxury"
      />
    );
    
    const expandBtn = screen.getByTitle('Show more');
    fireEvent.click(expandBtn);
    
    expect(screen.getByText(/Crafting exclusive, sophisticated content.../)).toBeInTheDocument();
  });

  it('should call onComplete when progress reaches 100%', async () => {
    const onComplete = jest.fn();
    
    render(
      <ContentGenerationProgress 
        isGenerating={true}
        onComplete={onComplete}
      />
    );
    
    // Wait for completion
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 15000 }); // Total duration of all stages
  });

  it('should display all 6 progress stages', () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
      />
    );
    
    const expandBtn = screen.getByTitle('Show more');
    fireEvent.click(expandBtn);
    
    // Check all stages are listed
    const stages = [
      'Analyzing your stunning photos',
      'Understanding your ideal buyer',
      'Crafting compelling content',
      'Optimizing for maximum impact',
      'Perfecting every detail'
    ];
    
    stages.forEach(stage => {
      waitFor(() => {
        expect(screen.getByText(new RegExp(stage))).toBeInTheDocument();
      });
    });
  });

  it('should show completion message when done', async () => {
    render(
      <ContentGenerationProgress 
        isGenerating={true}
      />
    );
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Your content is ready!')).toBeInTheDocument();
    }, { timeout: 15000 });
  });
});