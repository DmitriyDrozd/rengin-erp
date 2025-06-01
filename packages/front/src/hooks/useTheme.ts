import { useContext, useEffect, useState } from "react";
import { colorSchemeDarkBlue, iconSetAlpine, themeAlpine } from "ag-grid-enterprise";
import theme from 'antd/es/theme';
import React from "react";
import useLocalStorageState from "./useLocalStorageState";

const { darkAlgorithm } = theme;
const alpineTheme = themeAlpine.withPart(iconSetAlpine);

export const ThemeContext = React.createContext({ 
    isDarkMode: false, 
    setIsDarkMode: null,
    algorithm: null,
    navTheme: null,
    agGridTheme: null,
 });

const getAlgorithm = (isDarkMode: boolean) => isDarkMode ? darkAlgorithm : undefined;
const getNavTheme = (isDarkMode: boolean) => isDarkMode ? 'realDark' : 'light';
const getAgGridTheme = (isDarkMode: boolean) => isDarkMode ? alpineTheme.withPart(colorSchemeDarkBlue) : alpineTheme;

export const useTheme = () => {
    const { isDarkMode, setIsDarkMode, algorithm, navTheme, agGridTheme } = useContext(ThemeContext);

    return {
        algorithm,
        navTheme,
        theme: agGridTheme,
        isDarkMode,
        setIsDarkMode,
    };
}

export const createThemeHook = (defaultIsDarkMode: boolean) => {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState('darkMode', false);
    // Components
    const [algorithm, setAlgorithm] = useState({ algorithm: getAlgorithm(defaultIsDarkMode) });
    // Background
    const [navTheme, setNavTheme] = useState(getNavTheme(defaultIsDarkMode));
    // Grid
    const [agGridTheme, setAgGridTheme] = useState(getAgGridTheme(defaultIsDarkMode));

    useEffect(() => {
        setAlgorithm({ algorithm: getAlgorithm(isDarkMode) });
        setNavTheme(getNavTheme(isDarkMode));
        setAgGridTheme(getAgGridTheme(isDarkMode));
    }, [isDarkMode]);

    return {
        isDarkMode,
        setIsDarkMode,
        algorithm,
        navTheme,
        agGridTheme,
    }
}
