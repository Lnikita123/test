import mongoose from "mongoose";

interface ITopsection {
  chapterId: string;
  pageId: string;
  unitId: string;
  text?: Object;
  oneImage?: Object;
  twoImages?: Object;
  videos?: Object;
  mcq?: Object;
  hint: string;
  isDeleted: Boolean;
}
const optionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    required: true,
  },
});
const topsectionSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      // required: true,
    },
    pageId: {
      type: String,
      // required: true,
    },
    unitId: {
      type: String,
    },
    id: {
      type: String,
      // default: uuid,
    },
    text: {
      heading: {
        type: String,
      },
      body: {
        type: String,
      },
      headingStyles: {
        type: Object,
      },
      bodyStyles: {
        type: Object,
      },
    },
    oneImage: {
      heading: {
        type: String,
      },
      body: {
        type: String,
      },
      headingStyles: {
        type: Object,
      },
      bodyStyles: {
        type: Object,
      },
      image: {
        type: String,
      },
    },
    twoImages: {
      heading: {
        type: String,
      },
      headingStyles: {
        type: Object,
      },
      image1: {
        type: String,
      },
      image2: {
        type: String,
      },
      body1: {
        type: String,
      },
      bodyStyles1: {
        type: Object,
      },
      body2: {
        type: String,
      },
      bodyStyles2: {
        type: Object,
      },
    },
    videos: {
      heading: {
        type: String,
      },
      body: {
        type: String,
      },
      headingStyles: {
        type: Object,
      },
      bodyStyles: {
        type: Object,
      },
      video: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    mcq: {
      heading: {
        type: String,
      },
      headingStyles: {
        type: Object,
      },
      options: [optionSchema],
    },
    hint: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const topsectionDetails = mongoose.model<ITopsection>("Top", topsectionSchema);

export { topsectionDetails };
