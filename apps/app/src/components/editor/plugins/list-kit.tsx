import { ListPlugin } from "@platejs/list/react";
import { KEYS } from "platejs";
import { Key } from "platejs/react";

import { setBlockType } from "../transforms";
import { BlockList } from "../ui/block-list";
import { IndentKit } from "./indent-kit";

export const ListKit = [
  ...IndentKit,
  ListPlugin.extendTransforms(({ editor }) => ({
    toggleBulletedList: () => setBlockType(editor, KEYS.ul),
    toggleNumberedList: () => setBlockType(editor, KEYS.ol),
    toggleTodoList: () => setBlockType(editor, KEYS.listTodo),
  }))
    .extend({
      shortcuts: {
        toggleBulletedList: {
          keys: [[Key.Mod, Key.Shift, "4"]],
        },
        toggleNumberedList: {
          keys: [[Key.Mod, Key.Shift, "5"]],
        },
        toggleTodoList: {
          keys: [[Key.Mod, Key.Shift, "6"]],
        },
      },
    })
    .configure({
      inject: {
        targetPlugins: [
          ...KEYS.heading,
          KEYS.p,
          KEYS.blockquote,
          KEYS.codeBlock,
          KEYS.toggle,
          KEYS.img,
        ],
      },
      render: {
        belowNodes: BlockList,
      },
    }),
];
