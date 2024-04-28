import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../constants/customStyles";
import { ReactAceThemes } from "../constants/ReactAceThemes";

const ThemeDropdown = ({ handleThemeChange, theme }) => {
  return (
    <Select
      placeholder={`Select Theme`}
      // options={languageOptions}
      // options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
      //   label: themeName,
      //   value: themeId,
      //   key: themeId,
      // }))}
      options={ReactAceThemes.map((theme) => ({
        label: theme,
        value: theme,
        key: theme,
      }))}
      value={theme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropdown;
