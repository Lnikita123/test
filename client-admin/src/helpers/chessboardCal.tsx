export const calcWidth = ({ screenWidth, screenHeight }: any) => {
  return Math.min(screenWidth, screenHeight) * 0.65;
};

export const renderRowNumber = (rowIndex: number, colIndex: number) => {
  if (colIndex === 0) {
    return (
      <div className="text-xs justify-start text-gray-600">{8 - rowIndex}</div>
    );
  }
  return null;
};

export const renderColumnLetter = (rowIndex: number, colIndex: number) => {
  if (rowIndex === 7) {
    return (
      <div className="text-xs text-gray-600">
        {String.fromCharCode(97 + colIndex)}
      </div>
    );
  }
  return null;
};
