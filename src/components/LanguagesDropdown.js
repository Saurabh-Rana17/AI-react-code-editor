import React from "react";
import Select from "react-select";
import { customStyles } from "../constants/customStyles";
import { languageOptions } from "../constants/languageOptions";
import languageConstant from "../constants/languageConstant";

const LanguagesDropdown = ({ onSelectChange, isOffline }) => {
  const options = [
    { name: "javascript", label: "Javascipt" },
    { name: "python", label: "Python" },
    { name: "java", label: "Java" },
  ];
  if (isOffline) {
    return (
      <Select
        className="text-black w-44"
        placeholder="Javascript"
        onChange={(selectedOption) => onSelectChange(selectedOption)}
        defaultValue={"javascript"}
        styles={customStyles}
        options={options}
      />
    );
  }
  return (
    <Select
      className="text-black w-44"
      placeholder={`Filter By Category`}
      options={languageConstant}
      styles={customStyles}
      defaultValue={languageConstant[54]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguagesDropdown;
