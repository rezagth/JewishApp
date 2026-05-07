export const THEME = {
  dark: {
    colors: {
      background: '#0C1322',
      surface: '#161F33',
      primary: '#F1D77A',
      secondary: '#E9C349',
      text: '#DCE2F7',
      textSecondary: '#96A0B6',
      border: 'rgba(255, 255, 255, 0.08)',
      card: 'rgba(255, 255, 255, 0.04)',
      accent: '#6366F1',
      success: '#10B981',
      error: '#EF4444',
      glass: 'rgba(255, 255, 255, 0.03)',
      highlight: 'rgba(233, 195, 73, 0.14)',
    },
    shadows: {
      sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
      md: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
    }
  },
  light: {
    colors: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      primary: '#1B5E87',
      secondary: '#E8A537',
      text: '#0F172A',
      textSecondary: '#64748B',
      border: 'rgba(0, 0, 0, 0.06)',
      card: '#FFFFFF',
      accent: '#4F46E5',
      success: '#059669',
      error: '#DC2626',
      glass: 'rgba(255, 255, 255, 0.7)',
      highlight: 'rgba(27, 94, 135, 0.08)',
    },
    shadows: {
      sm: { shadowColor: '#64748B', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
      md: { shadowColor: '#64748B', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 10 },
    }
  }
};

export type AppTheme = typeof THEME.dark;
