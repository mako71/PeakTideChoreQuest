export const THEMES = {
  forest: {
    name: "Forest",
    colors: {
      primary: "150 60% 35%",
      secondary: "200 80% 45%",
      accent: "25 95% 55%",
      sidebar: "200 50% 10%",
      sidebarPrimary: "150 60% 35%",
      chart1: "150 60% 35%",
      chart2: "200 80% 45%",
    },
  },
  ocean: {
    name: "Ocean",
    colors: {
      primary: "190 80% 40%",
      secondary: "210 100% 50%",
      accent: "45 100% 60%",
      sidebar: "190 60% 15%",
      sidebarPrimary: "190 80% 40%",
      chart1: "190 80% 40%",
      chart2: "210 100% 50%",
    },
  },
  sunset: {
    name: "Sunset",
    colors: {
      primary: "15 100% 50%",
      secondary: "40 100% 55%",
      accent: "300 100% 60%",
      sidebar: "15 80% 15%",
      sidebarPrimary: "15 100% 50%",
      chart1: "15 100% 50%",
      chart2: "40 100% 55%",
    },
  },
};

export function applyTheme(themeName: string) {
  const theme = THEMES[themeName as keyof typeof THEMES];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    let cssVar = "";
    if (key === "primary") cssVar = "--primary";
    else if (key === "secondary") cssVar = "--secondary";
    else if (key === "accent") cssVar = "--accent";
    else if (key === "sidebar") cssVar = "--sidebar";
    else if (key === "sidebarPrimary") cssVar = "--sidebar-primary";
    else if (key === "chart1") cssVar = "--chart-1";
    else if (key === "chart2") cssVar = "--chart-2";

    if (cssVar) {
      root.style.setProperty(cssVar, value);
    }
  });

  localStorage.setItem("selectedTheme", themeName);
}

export function getSavedTheme() {
  return localStorage.getItem("selectedTheme") || "forest";
}
