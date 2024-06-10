import React from "react";
import Switch from "react-switch";

const UnitPublished = ({ handleChange, newUnit }: any) => {
  return (
    <>
      <label className="flex items-center">
        <Switch
          onChange={handleChange}
          checked={newUnit?.isPublished || false}
          onColor="#70C448"
          offColor="#ccc"
          onHandleColor="#70C448"
          handleDiameter={20}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
        />
      </label>
    </>
  );
};

export default UnitPublished;
