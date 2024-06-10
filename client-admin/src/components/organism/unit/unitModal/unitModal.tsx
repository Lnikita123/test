import CreateButton from "@/components/atoms/createButton/createButton";
import EditableModal from "@/components/atoms/editableModal/editableModal";
import NoUnit from "@/components/atoms/unit/noUnit/noUnit";
import UnitName from "@/components/atoms/unit/unitName/unitName";
import UnitNumber from "@/components/atoms/unit/unitNumber/unitNumber";
import UnitPublished from "@/components/atoms/unit/unitPublished/unitPublished";
import { getUnitsApi } from "@/pages/api/pageTopBottomApi";
import { IuseUnitStore, useUnitStore } from "@/store/useUnitStore";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

const Modal = ({ unitId }: any) => {
  const modal = useUnitStore((s) => s.modal);
  const isEditable = useUnitStore((s) => s.isEditable);
  const setEditableUnit = useUnitStore((s) => s.setEditableUnit);
  const units = useUnitStore((s) => s.units);
  const editableUnit = useUnitStore((s) => s.editableUnit);
  const setModal = useUnitStore((s) => s.setModal);
  const setChecked = useUnitStore((s) => s.setChecked);
  const setUnits = useUnitStore((s) => s.setUnits);
  const setIsEditable = useUnitStore((s) => s.setIsEditable);
  const updateEditableUnit = useUnitStore((s) => s.updateEditableUnit);
  const [data, setData] = useState<IuseUnitStore[]>([]);
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }

  const createPost = async () => {
    try {
      const response = await fetch("https://staging.api.playalvis.com/v1/units", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUnit),
      });

      const res = await response.json();
      console.log("post", res);
      if (
        res.message.includes(
          "A unit with this unitNumber and level already exists"
        )
      ) {
        alert(res.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const updateUnit = async (
    selectedId: string,
    editableUnit: IuseUnitStore
  ) => {
    try {
      const unitToUpdate = units.find((unit) => unit.id === selectedId);
      if (!unitToUpdate) {
        throw new Error(`Unit with id ${selectedId} not found`);
      }

      // Update unitToUpdate with new values
      const updatedUnit = {
        id: selectedId,
        unitName: editableUnit.unitName,
        unitNumber: editableUnit.unitNumber,
        isPublished: editableUnit.isPublished,
        levels: editableUnit.levels,
      };

      // Update the units array with the updated unit
      const updatedUnits = Array.isArray(units)
        ? units.map((unit) => (unit.id === selectedId ? updatedUnit : unit))
        : [];
      setUnits(updatedUnits);
      console.log("updated unit", updatedUnit);
      // Make the PUT request to update the API with the updated unit
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/units/${selectedId}`,
        {
          mode: "cors",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUnit),
        }
      );
      const res = await response.json();
      console.log("put", res);
      if (
        res &&
        res.message &&
        res.message.includes(
          "A unit with this unitNumber and level already exists"
        )
      ) {
        alert(res.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const editUnit = async (selectedId: any, editableUnit: IuseUnitStore) => {
    // Check if a unit with the same unitNumber and levels already exists
    const existingUnit = units.find(
      (unit) =>
        unit.id !== selectedId &&
        unit.unitNumber === editableUnit.unitNumber &&
        unit.levels === editableUnit.levels
    );
    console.log("existingUnit", existingUnit);
    if (existingUnit !== undefined) {
      alert("A unit with the same unitNumber and level already exists.");
      return;
    } else if (existingUnit === undefined) {
      await updateUnit(selectedId, editableUnit);
      toggleEditModal();
      console.log("selectedId", selectedId);
      useUnitStore.getState().updateUnitById(selectedId, editableUnit);
      console.log("editable", editableUnit);
      setUnits(useUnitStore.getState().units);
      // Retrieve the updated data after getUnitsApi
      const updatedData = await getUnitsApi();
      setData(updatedData);
    }
  };
  const [newUnit, setNewUnit] = useState<IuseUnitStore>({
    id: uuidv4(),
    unitName: "",
    unitNumber: null,
    isPublished: false,
    levels: "beginner",
  });
  // This function only updates newUnit state for creating a new unit
  const handleCreateChange = (checked: boolean) => {
    setNewUnit((prev) => ({ ...prev, isPublished: checked }));
    setChecked(checked);
  };

  // This function only updates editableUnit state for editing an existing unit
  const handleEditChange = (checked: boolean) => {
    updateEditableUnit("isPublished", checked);
    setChecked(checked);
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleEditModal = () => {
    setIsEditable(!isEditable);
  };
  // This function only updates newUnit state for creating a new unit
  const handleCreateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    let updatedValue = name === "unitNumber" ? Number(value) : value;
    setNewUnit((prev) => ({ ...prev, [name]: updatedValue }));
  };

  // This function only updates editableUnit state for editing an existing unit
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    let updatedValue = name === "unitNumber" ? Number(value) : value;
    updateEditableUnit(name, updatedValue);
    const updatedEditableUnit = { ...editableUnit, [name]: updatedValue };
    setEditableUnit(updatedEditableUnit);
  };
  const createUnit = async () => {
    await createPost();
    setEditableUnit(newUnit);
    useUnitStore.getState().addUnit(newUnit);
    toggleModal();
    setNewUnit({
      id: uuidv4(),
      unitName: "",
      unitNumber: null,
      isPublished: false,
      levels: "beginner",
    });
  };

  useEffect(() => {
    console.log("units", units);
  }, [units]);
  function closeModal() {
    setModal(!modal);
  }
  return (
    <>
      {modal && (
        <div className="w-100 h-100 fixed top-1/2 left-1/2 right-1/2 bottom-1/2 shadow-xl">
          <div
            onClick={toggleModal}
            className="fixed top-0 left-0 w-full h-full bg-[#FFFFFF] bg-opacity-80 "
          ></div>
          <div
            id="editable-modal"
            className="shadow-xl absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 leading-5 bg-[#DDF4FF] p-4 rounded-md max-w-600 min-w-300"
          >
            <div className="flex justify-between">
              <div>
                <UnitName
                  newUnit={newUnit}
                  InputChange={handleCreateInputChange}
                />
              </div>
              <div>
                <button
                  onClick={closeModal}
                  className="bg-red-300 rounded-md text-white px-2 py-2"
                >
                  <AiOutlineClose />
                </button>
              </div>
            </div>
            <br />
            <div className="flex">
              <div className="flex flex-col my-2">
                <UnitNumber
                  newUnit={newUnit}
                  InputChange={handleCreateInputChange}
                />
              </div>
              <div>
                <p className="font-bold my-4"> Published</p>
                <UnitPublished
                  newUnit={newUnit}
                  handleChange={handleCreateChange}
                />
              </div>
            </div>
            <br />
            <div className="my-2">
              <CreateButton create={createUnit} />
            </div>
          </div>
        </div>
      )}
      <EditableModal
        InputChange={handleEditInputChange}
        handleChange={handleEditChange}
        editableUnit={editableUnit}
        editUnit={editUnit}
      />
      <NoUnit units={units} modal={modal} />
    </>
  );
};

export default Modal;
