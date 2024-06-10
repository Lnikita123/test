import React from "react";

const SaveButtonTopBottom = ({ createPost, isSubmitting }: any) => {
  return (
    <button
      onClick={createPost}
      className={`px-3 py-2 ${
        isSubmitting ? "bg-green-500" : "bg-blue-500"
      } text-white rounded`}
    >
      Save
    </button>
  );
};

export default SaveButtonTopBottom;
