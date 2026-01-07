import { useTheme } from "../context/ThemeContext";

export default function useActiveThemeStyles() {
  const { activeTheme } = useTheme();
  return activeTheme?.settings || null;
}
