import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { buildToggleIndex, TogglePlugin } from "@platejs/toggle/react";
import { KEYS, type Value } from "platejs";
import { BlockPlaceholderPlugin, createPlateEditor } from "platejs/react";

// EditorKit imports node components with styles; transforms need no CSS in Node.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".css")) {
      return { format: "module", source: "", shortCircuit: true };
    }

    return nextLoad(url, context);
  },
});

const { EditorKit } = await import("../editor-kit");
const { getBlockType, insertBlock, setBlockType } =
  await import("../transforms");

for (const type of [KEYS.h1, KEYS.h2, KEYS.h3]) {
  for (const selectedBlock of [0, 1]) {
    test(`Choosing ${type} removes the placeholder from toggle block ${selectedBlock}`, () => {
      const value: Value = [
        { id: "section", type: KEYS.toggle, children: [{ text: "" }] },
        { id: "body", type: KEYS.p, indent: 1, children: [{ text: "" }] },
      ];
      const editor = createPlateEditor({ plugins: EditorKit, value });
      editor.tf.select({ path: [selectedBlock, 0], offset: 0 });
      assert.ok(
        editor.getOption(
          BlockPlaceholderPlugin,
          "placeholder",
          editor.children[selectedBlock]
        )
      );

      insertBlock(editor, type, { upsert: true });

      assert.equal(getBlockType(editor.children[selectedBlock]), type);
      assert.equal(
        editor.getOption(
          BlockPlaceholderPlugin,
          "placeholder",
          editor.children[selectedBlock]
        ),
        undefined
      );
      assert.ok(
        editor.getOption(
          BlockPlaceholderPlugin,
          "placeholder",
          editor.children[1 - selectedBlock]
        )
      );
    });
  }
}

for (const title of ["", "Section"]) {
  for (const command of ["insert", "format", "shortcut"] as const) {
    for (const type of [
      KEYS.h1,
      KEYS.h2,
      KEYS.h3,
      KEYS.ul,
      KEYS.ol,
      KEYS.listTodo,
      KEYS.codeBlock,
      KEYS.blockquote,
    ]) {
      test(`${command} ${type} on ${title ? "populated" : "empty"} toggle title preserves the section`, () => {
        const value: Value = [
          {
            id: "section",
            type: KEYS.toggle,
            indent: 1,
            children: [{ text: title }],
          },
          { id: "body", type: KEYS.p, indent: 2, children: [{ text: "Body" }] },
          { id: "outside", type: KEYS.p, children: [{ text: "Outside" }] },
        ];
        const editor = createPlateEditor({ plugins: EditorKit, value });
        editor.tf.select({ path: [0, 0], offset: title.length });

        if (command === "insert") insertBlock(editor, type, { upsert: true });
        else if (command === "format") setBlockType(editor, type);
        else editor.tf.toggleBlock(type);

        const heading = [KEYS.h1, KEYS.h2, KEYS.h3].includes(type as "h1");
        assert.deepEqual(editor.children, [
          { ...value[0], ...(heading ? { toggleHeading: type } : {}) },
          ...value.slice(1),
        ]);
        assert.equal(
          getBlockType(editor.children[0]),
          heading ? type : KEYS.toggle
        );
        assert.deepEqual(buildToggleIndex(editor.children).get("body"), [
          "section",
        ]);
        assert.deepEqual(editor.selection?.anchor, {
          path: [0, 0],
          offset: title.length,
        });
      });
    }
  }
}

test("A heading title can return to plain text without removing its toggle", () => {
  const value: Value = [
    { id: "section", type: KEYS.toggle, children: [{ text: "Title" }] },
    { id: "body", type: KEYS.p, indent: 1, children: [{ text: "" }] },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.tf.select({ path: [0, 0], offset: 5 });
  editor.tf.toggleBlock(KEYS.h2);
  assert.equal(editor.children[0].toggleHeading, KEYS.h2);
  editor.tf.toggleBlock(KEYS.h2);
  assert.deepEqual(editor.children, value);
  setBlockType(editor, KEYS.h1);
  setBlockType(editor, KEYS.p);
  assert.deepEqual(editor.children, value);
});

test("Enter on a heading title reuses its blank body", () => {
  const value: Value = [
    { id: "section", type: KEYS.toggle, children: [{ text: "Title" }] },
    { id: "body", type: KEYS.p, indent: 1, children: [{ text: "" }] },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["section"], true);
  editor.tf.select({ path: [0, 0], offset: 5 });
  insertBlock(editor, KEYS.h3, { upsert: true });
  editor.tf.insertBreak();
  assert.equal(editor.children.length, 2);
  assert.equal(editor.children[0].type, KEYS.toggle);
  assert.deepEqual(editor.selection?.anchor, { path: [1, 0], offset: 0 });
});

test("Deleting list text preserves its marker until Backspace on the empty item", () => {
  const value: Value = [
    { id: "section", type: KEYS.toggle, children: [{ text: "Section" }] },
    {
      id: "item",
      type: KEYS.p,
      indent: 2,
      listStyleType: KEYS.ul,
      children: [{ text: "x" }],
    },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["section"], true);
  editor.tf.select({ path: [1, 0], offset: 1 });

  editor.tf.deleteBackward("character");
  assert.equal(editor.api.string([1]), "");
  assert.equal(editor.children[1][KEYS.listType], KEYS.ul);

  editor.tf.deleteBackward("character");
  assert.equal(editor.children[1][KEYS.listType], undefined);
  assert.equal(editor.children[1].indent, 1);
  assert.deepEqual(editor.selection?.anchor, { path: [1, 0], offset: 0 });
  assert.deepEqual(buildToggleIndex(editor.children).get("item"), ["section"]);
});

for (const listStyleType of [KEYS.ul, KEYS.ol, KEYS.listTodo]) {
  for (const selectedBlock of [1, 2]) {
    test(`Backspace removes an empty ${listStyleType} marker at item ${selectedBlock} inside a toggle`, () => {
      const value: Value = [
        { id: "section", type: KEYS.toggle, children: [{ text: "" }] },
        {
          id: "first",
          type: KEYS.p,
          indent: 2,
          listStyleType,
          children: [{ text: "" }],
        },
        {
          id: "second",
          type: KEYS.p,
          indent: 2,
          listStyleType,
          children: [{ text: "" }],
        },
        { id: "outside", type: KEYS.p, children: [{ text: "Outside" }] },
      ];
      const editor = createPlateEditor({ plugins: EditorKit, value });
      editor.getApi(TogglePlugin).toggle.toggleIds(["section"], true);
      editor.tf.select({ path: [selectedBlock, 0], offset: 0 });

      editor.tf.deleteBackward("character");

      const node = editor.children[selectedBlock];
      assert.equal(node[KEYS.listType], undefined);
      assert.equal(node.indent, 1);
      assert.equal(editor.children.length, 4);
      assert.deepEqual(
        buildToggleIndex(editor.children).get(node.id as string),
        ["section"]
      );
      assert.deepEqual(editor.selection, {
        anchor: { path: [selectedBlock, 0], offset: 0 },
        focus: { path: [selectedBlock, 0], offset: 0 },
      });
      assert.equal(
        editor.children[selectedBlock === 1 ? 2 : 1][KEYS.listType],
        listStyleType
      );
    });
  }
}

for (const type of [
  KEYS.h1,
  KEYS.h2,
  KEYS.h3,
  KEYS.blockquote,
  KEYS.codeBlock,
  KEYS.ul,
  KEYS.ol,
  KEYS.listTodo,
  KEYS.toggle,
]) {
  for (const sourceIsList of [false, true]) {
    for (const action of ["insert", "convert"]) {
      test(`${action} ${type} from ${sourceIsList ? "a list" : "a paragraph"} inside a toggle preserves enclosure`, () => {
        const value: Value = [
          { id: "section", type: KEYS.toggle, children: [{ text: "Section" }] },
          {
            id: "content",
            type: KEYS.p,
            indent: sourceIsList ? 2 : 1,
            ...(sourceIsList ? { listStyleType: KEYS.ul } : {}),
            children: [{ text: "" }],
          },
          {
            id: "following",
            type: KEYS.p,
            indent: 1,
            children: [{ text: "Keep inside" }],
          },
          { id: "outside", type: KEYS.p, children: [{ text: "Outside" }] },
        ];
        const editor = createPlateEditor({ plugins: EditorKit, value });
        editor.getApi(TogglePlugin).toggle.toggleIds(["section"], true);
        editor.tf.select({ path: [1, 0], offset: 0 });

        if (action === "insert") insertBlock(editor, type, { upsert: true });
        else setBlockType(editor, type);

        const block = editor.api.block({ highest: true });
        assert.ok(block);
        assert.equal(getBlockType(block[0]), type);
        const index = buildToggleIndex(editor.children);
        assert.deepEqual(index.get(block[0].id as string), ["section"]);
        assert.deepEqual(index.get("following"), ["section"]);
        assert.deepEqual(index.get("outside"), []);
        if (type === KEYS.toggle) {
          const content = editor.children[block[1][0] + 1];
          assert.deepEqual(index.get(content.id as string), [
            "section",
            block[0].id,
          ]);
        }
        editor.setOption(TogglePlugin, "toggleIndex", index);
        editor.getApi(TogglePlugin).toggle.toggleIds(["section"], false);
        assert.equal(editor.api.isSelectable(block[0]), false);
        const following = editor.children.find(
          (node) => node.id === "following"
        );
        const outside = editor.children.find((node) => node.id === "outside");
        assert.ok(following);
        assert.ok(outside);
        assert.equal(editor.api.isSelectable(following), false);
        assert.equal(editor.api.isSelectable(outside), true);
      });
    }
  }
}

for (const type of [KEYS.codeBlock, KEYS.ul, KEYS.toggle]) {
  test(`Inserting ${type} after existing content preserves text and nesting`, () => {
    const value: Value = [
      { id: "section", type: KEYS.toggle, children: [{ text: "Section" }] },
      {
        id: "content",
        type: KEYS.p,
        indent: 1,
        children: [{ text: "Existing" }],
      },
      { id: "outside", type: KEYS.p, children: [{ text: "Outside" }] },
    ];
    const editor = createPlateEditor({ plugins: EditorKit, value });
    editor.getApi(TogglePlugin).toggle.toggleIds(["section"], true);
    editor.tf.select({ path: [1, 0], offset: 8 });

    insertBlock(editor, type, { upsert: true });

    const block = editor.api.block({ highest: true });
    assert.ok(block);
    assert.equal(getBlockType(block[0]), type);
    assert.deepEqual(editor.children[1], value[1]);
    const index = buildToggleIndex(editor.children);
    assert.deepEqual(index.get(block[0].id as string), ["section"]);
    assert.deepEqual(index.get("outside"), []);
    if (type === KEYS.toggle) {
      assert.deepEqual(
        index.get(editor.children[block[1][0] + 1].id as string),
        ["section", block[0].id]
      );
    }
  });
}

for (const action of ["insert", "convert"]) {
  test(`${action} code at the document end keeps its following paragraph inside the toggle`, () => {
    const value: Value = [
      { id: "section", type: KEYS.toggle, children: [{ text: "Section" }] },
      { id: "content", type: KEYS.p, indent: 1, children: [{ text: "" }] },
    ];
    const editor = createPlateEditor({ plugins: EditorKit, value });
    editor.tf.select({ path: [1, 0], offset: 0 });

    if (action === "insert")
      insertBlock(editor, KEYS.codeBlock, { upsert: true });
    else setBlockType(editor, KEYS.codeBlock);

    assert.equal(editor.children[1].type, KEYS.codeBlock);
    assert.equal(editor.children[2].type, KEYS.p);
    assert.equal(editor.children[2].indent, 1);
    assert.deepEqual(
      buildToggleIndex(editor.children).get(editor.children[2].id as string),
      ["section"]
    );
  });
}

for (const title of ["", "Title"]) {
  test(`Enter on a newly created ${title ? "filled" : "empty"} toggle title reuses its blank content`, () => {
    const value: Value = [
      { id: "before", type: KEYS.p, children: [{ text: "Before" }] },
      { id: "title", type: KEYS.p, children: [{ text: title }] },
    ];
    const editor = createPlateEditor({ plugins: EditorKit, value });
    editor.tf.select({ path: [1, 0], offset: title.length });
    setBlockType(editor, KEYS.toggle);
    const original = structuredClone(editor.children);

    editor.tf.insertBreak();

    assert.deepEqual(editor.children, original);
    assert.deepEqual(editor.selection, {
      anchor: { path: [2, 0], offset: 0 },
      focus: { path: [2, 0], offset: 0 },
    });
    assert.equal(
      editor.getOption(
        BlockPlaceholderPlugin,
        "placeholder",
        editor.children[2]
      ),
      "Add section content..."
    );
  });
}

test("Enter adds an empty line inside a toggle, then exits on the next Enter", () => {
  const value: Value = [
    { id: "toggle", type: KEYS.toggle, children: [{ text: "Title" }] },
    { id: "content", type: KEYS.p, indent: 1, children: [{ text: "" }] },
    { id: "after", type: KEYS.p, children: [{ text: "After" }] },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["toggle"], true);
  editor.tf.select({ path: [1, 0], offset: 0 });

  assert.equal(
    editor.getOption(BlockPlaceholderPlugin, "placeholder", editor.children[1]),
    "Add section content..."
  );

  editor.tf.insertBreak();

  assert.equal(editor.children.length, 4);
  assert.equal(editor.children[1].indent, 1);
  assert.equal(editor.children[2].indent, 1);
  for (const node of editor.children.slice(1, 3)) {
    assert.equal(
      editor.getOption(BlockPlaceholderPlugin, "placeholder", node),
      undefined
    );
  }
  assert.deepEqual(editor.selection?.anchor, { path: [2, 0], offset: 0 });

  editor.tf.insertBreak();

  assert.equal(editor.children.length, 4);
  assert.equal(editor.children[1].indent, 1);
  assert.equal(editor.children[2].indent ?? 0, 0);
  assert.equal(editor.children[2].type, KEYS.p);
  assert.equal(editor.children[3].id, "after");
  assert.deepEqual(editor.selection?.anchor, { path: [2, 0], offset: 0 });
});

test("Enter exits a nested toggle into its parent after reloading two empty lines", () => {
  const value: Value = [
    { id: "outer", type: KEYS.toggle, children: [{ text: "Outer" }] },
    {
      id: "inner",
      type: KEYS.toggle,
      indent: 1,
      children: [{ text: "Inner" }],
    },
    { id: "blank", type: KEYS.p, indent: 2, children: [{ text: "" }] },
    { id: "current", type: KEYS.p, indent: 2, children: [{ text: "" }] },
    { id: "after", type: KEYS.p, indent: 1, children: [{ text: "Keep" }] },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["outer", "inner"], true);
  editor.tf.select({ path: [3, 0], offset: 0 });

  editor.tf.insertBreak();

  assert.equal(editor.children.length, 5);
  assert.equal(editor.children[2].indent, 2);
  assert.equal(editor.children[3].indent, 1);
  assert.deepEqual(buildToggleIndex(editor.children).get("current"), ["outer"]);
  assert.deepEqual(editor.children[4], value[4]);
  assert.deepEqual(editor.selection?.anchor, { path: [3, 0], offset: 0 });
});

test("Two Enters exit an empty toggle at the end of the document", () => {
  const value: Value = [
    { id: "toggle", type: KEYS.toggle, children: [{ text: "Title" }] },
    { id: "content", type: KEYS.p, indent: 1, children: [{ text: "" }] },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["toggle"], true);
  editor.tf.select({ path: [1, 0], offset: 0 });

  editor.tf.insertBreak();
  assert.equal(editor.children[2].indent, 1);
  editor.tf.insertBreak();

  assert.equal(editor.children.length, 3);
  assert.equal(editor.children[1].indent, 1);
  assert.equal(editor.children[2].indent ?? 0, 0);
  assert.deepEqual(editor.selection?.anchor, { path: [2, 0], offset: 0 });
});

test("Enter on empty lines before more toggle content keeps that content enclosed", () => {
  const value: Value = [
    { id: "toggle", type: KEYS.toggle, children: [{ text: "Title" }] },
    { id: "blank", type: KEYS.p, indent: 1, children: [{ text: "" }] },
    { id: "current", type: KEYS.p, indent: 1, children: [{ text: "" }] },
    {
      id: "later",
      type: KEYS.p,
      indent: 1,
      children: [{ text: "Keep inside" }],
    },
  ];
  const editor = createPlateEditor({ plugins: EditorKit, value });
  editor.getApi(TogglePlugin).toggle.toggleIds(["toggle"], true);
  editor.tf.select({ path: [2, 0], offset: 0 });

  editor.tf.insertBreak();

  assert.equal(editor.children[3].indent, 1);
  assert.deepEqual(buildToggleIndex(editor.children).get("later"), ["toggle"]);
  assert.deepEqual(editor.selection?.anchor, { path: [3, 0], offset: 0 });
});

test("Backspace removes a toggle created by the block menu", () => {
  const value: Value = [
    { type: KEYS.p, children: [{ text: "Before" }] },
    { type: KEYS.p, children: [{ text: "" }] },
  ];
  const editor = createPlateEditor({
    plugins: EditorKit,
    nodeId: { normalizeInitialValue: true },
    value,
  });
  editor.tf.select({ path: [1, 0], offset: 0 });
  setBlockType(editor, KEYS.toggle);
  editor.setOption(
    TogglePlugin,
    "toggleIndex",
    buildToggleIndex(editor.children)
  );

  editor.tf.deleteBackward("character");

  assert.equal(
    editor.children.some((node) => node.type === KEYS.toggle),
    false
  );
  assert.equal(
    editor.children.some((node) => node.indent === 1),
    false
  );
});

for (const previousText of ["Before", ""]) {
  for (const staleIndex of [false, true]) {
    test(`Backspace removes an empty toggle after ${JSON.stringify(previousText)} (stale index: ${staleIndex})`, () => {
      const editor = createPlateEditor({
        plugins: EditorKit,
        value: [
          { id: "before", type: KEYS.p, children: [{ text: previousText }] },
          { id: "toggle", type: KEYS.toggle, children: [{ text: "" }] },
          { id: "content", type: KEYS.p, indent: 1, children: [{ text: "" }] },
          { id: "after", type: KEYS.p, children: [{ text: "After" }] },
        ],
      });
      const original = structuredClone(editor.children);
      if (!staleIndex) {
        editor.setOption(
          TogglePlugin,
          "toggleIndex",
          buildToggleIndex(editor.children)
        );
      }
      editor.getApi(TogglePlugin).toggle.toggleIds(["toggle"], true);
      editor.tf.select({ path: [1, 0], offset: 0 });

      editor.tf.deleteBackward("character");

      assert.deepEqual(editor.children, [
        { id: "before", type: KEYS.p, children: [{ text: previousText }] },
        { id: "after", type: KEYS.p, children: [{ text: "After" }] },
      ]);
      assert.deepEqual(editor.selection, {
        anchor: { path: [0, 0], offset: previousText.length },
        focus: { path: [0, 0], offset: previousText.length },
      });

      editor.tf.undo();
      assert.deepEqual(editor.children, original);
      editor.tf.redo();
      assert.deepEqual(
        editor.children.map((node) => node.id),
        ["before", "after"]
      );
    });
  }
}

test("Backspace removes nested enclosed blocks and preserves the next toggle", () => {
  const editor = createPlateEditor({
    plugins: EditorKit,
    value: [
      { id: "before", type: KEYS.p, children: [{ text: "Before" }] },
      { id: "toggle", type: KEYS.toggle, children: [{ text: "" }] },
      {
        id: "nested",
        type: KEYS.toggle,
        indent: 1,
        children: [{ text: "Nested" }],
      },
      {
        id: "content",
        type: KEYS.p,
        indent: 2,
        children: [{ text: "Content" }],
      },
      { id: "next", type: KEYS.toggle, children: [{ text: "Next" }] },
      {
        id: "next-content",
        type: KEYS.p,
        indent: 1,
        children: [{ text: "Keep" }],
      },
    ],
  });
  const expected = [editor.children[0], ...editor.children.slice(4)];
  editor.tf.select({ path: [1, 0], offset: 0 });

  editor.tf.deleteBackward("character");

  assert.deepEqual(editor.children, expected);
});

for (const selectedBlock of [2, 3]) {
  test(`Backspace from block ${selectedBlock} preserves the empty content line`, () => {
    const editor = createPlateEditor({
      plugins: EditorKit,
      value: [
        { id: "before", type: KEYS.p, children: [{ text: "Before" }] },
        { id: "toggle", type: KEYS.toggle, children: [{ text: "Title" }] },
        { id: "content", type: KEYS.p, indent: 1, children: [{ text: "" }] },
        { id: "after", type: KEYS.p, children: [{ text: "After" }] },
      ],
    });
    const original = structuredClone(editor.children);
    editor.setOption(
      TogglePlugin,
      "toggleIndex",
      buildToggleIndex(editor.children)
    );
    editor.getApi(TogglePlugin).toggle.toggleIds(["toggle"], true);
    editor.tf.select({ path: [selectedBlock, 0], offset: 0 });

    editor.tf.deleteBackward("character");

    assert.deepEqual(editor.children, original);
    const point = {
      path: [selectedBlock - 1, 0],
      offset: selectedBlock === 2 ? 5 : 0,
    };
    assert.deepEqual(editor.selection, { anchor: point, focus: point });
  });
}
