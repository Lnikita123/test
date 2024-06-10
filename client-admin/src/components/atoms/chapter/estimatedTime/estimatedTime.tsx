const EstimatedTime = ({ newChapter, timeDetails }: any) => {
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const timeInMinutes = Number(value);
    timeDetails({
      target: {
        name: "time",
        value: timeInMinutes,
      },
    });
  };

  return (
    <div>
      <label className="font-bold">Estimated time (minutes)</label>
      <br />
      <div className="flex items-center gap-4 my-2">
        <input
          type="number"
          value={newChapter?.time || ""}
          className="rounded-md p-2 w-[10rem] h-[2.5rem] border border-1 border-sky-500"
          onClick={(e) => e.stopPropagation()}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export default EstimatedTime;
