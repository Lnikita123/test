import mongoose from "mongoose";

import { Schema } from "mongoose";
const { Mixed } = Schema.Types;

interface IPage {
  id: string;
  chapterId: string;
  meta: string;
  hint: string;
  unitId: string;
  fenstring: string;
  position?: [Object];
  pieceMove?: [Object];
  board?: Object;
  dropPieces?: [Object];
  pageIndex?: [object];
  isDeleted?: Boolean;
}

const pageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // default: uuid,
    },
    chapterId: {
      type: String,
      // required: true,
    },

    unitId: {
      type: String,
      //required: true,
    },
    pageIndex: {
      type: [Object],
    },
    fenstring: {
      type: String,
    },
    meta: {
      type: [String],
    },
    hint: {
      type: [String],
    },
    position: [
      {
        fenString: { type: String },
        pieces: [
          {
            location: { type: String },
            pieceName: { type: String },
          },
        ],
        arrows: [
          {
            start: { type: Object },
            end: { type: Object },
            color: { type: String },
          },
        ],
        lines: [
          {
            start: { type: Object },
            end: { type: Object },
            color: { type: String },
          },
        ],
        arrowsPercentage: [
          {
            start: { type: Object },
            end: { type: Object },
            color: { type: String },
          },
        ],
        linesPercentage: [
          {
            start: { type: Object },
            end: { type: Object },
            color: { type: String },
          },
        ],
        brush: [
          {
            position: { type: String },
            color: { type: String },
          },
        ],
        screen: [
          {
            position: { type: String },
            color: { type: String },
            animate: { type: Boolean },
          },
        ],
      },
    ],

    pieceMove: [
      {
        user: {
          color: String,
          piece: String,
          from: String,
          to: String,
          flags: String,
          san: String,
        },
        system: {
          color: String,
          piece: String,
          from: String,
          to: String,
          flags: String,
          san: String,
        },
      },
    ],
    board: {
      id: {
        type: String,
      },
      AddedBlocks: {
        type: Array,
      },
    },

    dropPieces: [
      {
        optionNumber: {
          type: Number,
        },
        imageName: {
          type: String,
        },
        isChecked: {
          type: Boolean,
        },
        location: {
          type: String,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const pageDetails = mongoose.model<IPage>("Page", pageSchema);

export { pageDetails };
