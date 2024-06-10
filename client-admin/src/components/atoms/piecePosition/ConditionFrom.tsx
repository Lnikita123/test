import { IConditionsStore, usePieceHistory } from "@/store/usePieceHistory";
import Condition from "./Condition";

interface IConditionProps {
  conditionStore: IConditionsStore;
}
const ConditionForm = ({ conditionStore }: IConditionProps) => {
  const activeConditionType = usePieceHistory((s) => s.activeConditionType);

  const setActiveConditionType = usePieceHistory(
    (s) => (type: keyof IConditionsStore) => {
      if (type === "user" || type === "system") {
        s.setActiveConditionType(type);
      }
    }
  );

  return (
    <>
      <div className="bg-[#03A9F4] p-2">
        <div className="border border-1 border-white flex flex-row flex-wrap justify-around bg-[#03A9F4] rounded-lg">
          <h6 className="px-1">Choose Side</h6>
          <div>
            <input
              type="radio"
              checked={activeConditionType === "user"}
              onChange={() => setActiveConditionType("user")}
            />
            <label className="mx-1"> User</label>
          </div>
          <div>
            <input
              type="radio"
              checked={activeConditionType === "system"}
              onChange={() => setActiveConditionType("system")}
            />
            <label className="mx-1">System</label>
          </div>
          <hr />
        </div>
        <br />
        <Condition condition={conditionStore[activeConditionType]} />
      </div>
    </>
  );
};

export default ConditionForm;
