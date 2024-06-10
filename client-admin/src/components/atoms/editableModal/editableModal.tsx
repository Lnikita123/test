import { useUnitStore } from "@/store/useUnitStore";
import React from "react";
import Switch from "react-switch";
import { AiOutlineClose } from "react-icons/ai";

const EditableModal = ({
  InputChange,
  handleChange,
  editableUnit,
  editUnit,
}: any) => {
  const isEditable = useUnitStore((s) => s.isEditable);
  const setIsEditable = useUnitStore((s) => s.setIsEditable);
  const selectedId = useUnitStore((s) => s.selectedId);
  const units = useUnitStore((s) => s.units);
  const setEditableUnit = useUnitStore((s) => s.setEditableUnit);
  function closeModal() {
    setIsEditable(!isEditable);
  }
  React.useEffect(() => {
    const unit = units.find((unit) => unit.id === selectedId);
    // Assuming there is a setEditableUnit function in your store
    setEditableUnit(unit);
  }, [selectedId]);

  return (
    <>
      {isEditable && (
        <div className="w-100 h-100 fixed top-1/2 left-1/2 right-1/2 bottom-1/2">
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 leading-5 bg-gray-100 p-4 rounded-md max-w-600 min-w-300">
            <div className="flex justify-between">
              <div>
                <label className="font-semibold">Unit Name</label>
                <br />
                <input
                  type="text"
                  className="px-2 py-2 border rounded-md border-1 border-black"
                  value={editableUnit?.unitName || ""}
                  name="unitName"
                  onChange={InputChange}
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
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="font-semibold my-1">Unit Number</label>
                <input
                  type="text"
                  className="px-2 py-2 rounded-md border border-1 border-black w-3/4 h-1/2"
                  value={editableUnit?.unitNumber || null}
                  name="unitNumber"
                  onChange={InputChange}
                />
              </div>
              <div>
                <p className="font-semibold my-2"> Published</p>
                <label>
                  <Switch
                    onChange={handleChange}
                    checked={editableUnit?.isPublished || false}
                    onColor="#70C448"
                    offColor="#ccc"
                    onHandleColor="#70C448"
                    handleDiameter={20}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    height={20}
                    width={64}
                  />
                </label>
              </div>
              <br />
            </div>
            <br />

            <div className="relative flex flex-col items-start">
              <div className="flex justify-between w-full">
                <label className="text-md font-semibold text-black mt-2 mb-1">
                  Add level
                </label>
              </div>
              <div className="flex">
                <select
                  name="levels"
                  className="my-1 px-2 py-1 border rounded-md w-96 mr-2"
                  onChange={InputChange}
                  value={editableUnit?.levels || "beginner"}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="my-5 ">
              <button
                onClick={() => editUnit(selectedId, editableUnit)}
                type="button"
                className="bg-blue-700 rounded-md text-white px-2 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableModal;
