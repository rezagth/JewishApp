import { useAppSelector } from './useRedux';
import { THEME, AppTheme } from '@constants/theme';

export const useTheme = (): AppTheme => {
  const isDarkMode = useAppSelector((state) => state.user.preferences.isDarkMode);
  return isDarkMode ? THEME.dark : THEME.light;
};

export default useTheme;
