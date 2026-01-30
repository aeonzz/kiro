import * as React from "react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NodeApi, type TCodeBlockElement, type TCodeSyntaxLeaf } from "platejs";
import {
  PlateElement,
  PlateLeaf,
  useEditorRef,
  useElement,
  useReadOnly,
  type PlateElementProps,
  type PlateLeafProps,
} from "platejs/react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopupInput,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/components/copy-button";

export function CodeBlockElement(props: PlateElementProps<TCodeBlockElement>) {
  const { element } = props;

  return (
    <PlateElement
      className="group/code-block py-1 **:[.hljs-addition]:bg-[#f0fff4] **:[.hljs-addition]:text-[#22863a] dark:**:[.hljs-addition]:bg-[#3c5743] dark:**:[.hljs-addition]:text-[#ceead5] **:[.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable]:text-[#005cc5] dark:**:[.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable]:text-[#6596cf] **:[.hljs-built\\\\_in,.hljs-symbol]:text-[#e36209] dark:**:[.hljs-built\\\\_in,.hljs-symbol]:text-[#c3854e] **:[.hljs-bullet]:text-[#735c0f] **:[.hljs-comment,.hljs-code,.hljs-formula]:text-[#6a737d] dark:**:[.hljs-comment,.hljs-code,.hljs-formula]:text-[#6a737d] **:[.hljs-deletion]:bg-[#ffeef0] **:[.hljs-deletion]:text-[#b31d28] dark:**:[.hljs-deletion]:bg-[#473235] dark:**:[.hljs-deletion]:text-[#e7c7cb] **:[.hljs-emphasis]:italic **:[.hljs-keyword,.hljs-doctag,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language\\\\_]:text-[#d73a49] dark:**:[.hljs-keyword,.hljs-doctag,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language\\\\_]:text-[#ee6960] **:[.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo]:text-[#22863a] dark:**:[.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo]:text-[#36a84f] **:[.hljs-regexp,.hljs-string,.hljs-meta_.hljs-string]:text-[#032f62] dark:**:[.hljs-regexp,.hljs-string,.hljs-meta_.hljs-string]:text-[#3593ff] **:[.hljs-section]:font-bold **:[.hljs-section]:text-[#005cc5] dark:**:[.hljs-section]:text-[#61a5f2] **:[.hljs-strong]:font-bold **:[.hljs-title,.hljs-title.class\\\\_,.hljs-title.class\\\\_.inherited\\\\_\\\\_,.hljs-title.function\\\\_]:text-[#6f42c1] dark:**:[.hljs-title,.hljs-title.class\\\\_,.hljs-title.class\\\\_.inherited\\\\_\\\\_,.hljs-title.function\\\\_]:text-[#a77bfa]"
      {...props}
    >
      <div className="shadow-border-sm bg-sidebar/60 relative rounded-md">
        <pre className="overflow-x-auto font-mono text-sm leading-[normal] [tab-size:2] print:break-inside-avoid">
          <code className="block w-fit min-w-full p-4">{props.children}</code>
        </pre>
        <div
          className="absolute top-3 right-3 flex gap-0.5 select-none group-hover/code-block:opacity-100"
          contentEditable={false}
        >
          <CodeBlockCombobox />
          <CopyButton value={() => NodeApi.string(element)} />
        </div>
      </div>
    </PlateElement>
  );
}

function CodeBlockCombobox() {
  const readOnly = useReadOnly();
  const editor = useEditorRef();
  const element = useElement<TCodeBlockElement>();
  const ref = React.useRef<HTMLButtonElement>(null);

  const value = element.lang || "plaintext";
  const selectedLanguage =
    languages.find((l) => l.value === value) || languages[1];

  if (readOnly) return null;

  return (
    <Combobox
      items={languages}
      value={selectedLanguage}
      onValueChange={(val) => {
        if (val) {
          editor.tf.setNodes<TCodeBlockElement>(
            { lang: val.value },
            { at: element }
          );
        }
      }}
    >
      <ComboboxTrigger
        ref={ref}
        render={
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground h-6 justify-between gap-1 px-2 text-xs select-none"
          />
        }
      >
        <ComboboxValue>
          {(val: Language) => val?.label ?? "Plain Text"}
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent align="end" className="w-[200px]" anchor={ref.current}>
        <ComboboxPopupInput placeholder="Search language..." />
        <ComboboxEmpty>No language found.</ComboboxEmpty>
        <ComboboxList className="max-h-[344px]">
          {(item: Language) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function CodeLineElement(props: PlateElementProps) {
  return <PlateElement {...props} />;
}

export function CodeSyntaxLeaf(props: PlateLeafProps<TCodeSyntaxLeaf>) {
  const tokenClassName = props.leaf.className as string;

  return <PlateLeaf className={tokenClassName} {...props} />;
}

type Language = {
  value: string;
  label: string;
};

const languages: Language[] = [
  { value: "auto", label: "Auto" },
  { value: "plaintext", label: "Plain Text" },
  { value: "abap", label: "ABAP" },
  { value: "agda", label: "Agda" },
  { value: "arduino", label: "Arduino" },
  { value: "ascii", label: "ASCII Art" },
  { value: "x86asm", label: "Assembly" },
  { value: "bash", label: "Bash" },
  { value: "basic", label: "BASIC" },
  { value: "bnf", label: "BNF" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "clojure", label: "Clojure" },
  { value: "coffeescript", label: "CoffeeScript" },
  { value: "coq", label: "Coq" },
  { value: "css", label: "CSS" },
  { value: "dart", label: "Dart" },
  { value: "dhall", label: "Dhall" },
  { value: "diff", label: "Diff" },
  { value: "dockerfile", label: "Docker" },
  { value: "ebnf", label: "EBNF" },
  { value: "elixir", label: "Elixir" },
  { value: "elm", label: "Elm" },
  { value: "erlang", label: "Erlang" },
  { value: "fsharp", label: "F#" },
  { value: "flow", label: "Flow" },
  { value: "fortran", label: "Fortran" },
  { value: "gherkin", label: "Gherkin" },
  { value: "glsl", label: "GLSL" },
  { value: "go", label: "Go" },
  { value: "graphql", label: "GraphQL" },
  { value: "groovy", label: "Groovy" },
  { value: "haskell", label: "Haskell" },
  { value: "hcl", label: "HCL" },
  { value: "html", label: "HTML" },
  { value: "idris", label: "Idris" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "julia", label: "Julia" },
  { value: "kotlin", label: "Kotlin" },
  { value: "latex", label: "LaTeX" },
  { value: "less", label: "Less" },
  { value: "lisp", label: "Lisp" },
  { value: "livescript", label: "LiveScript" },
  { value: "llvm", label: "LLVM IR" },
  { value: "lua", label: "Lua" },
  { value: "makefile", label: "Makefile" },
  { value: "markdown", label: "Markdown" },
  { value: "markup", label: "Markup" },
  { value: "matlab", label: "MATLAB" },
  { value: "mathematica", label: "Mathematica" },
  { value: "mermaid", label: "Mermaid" },
  { value: "nix", label: "Nix" },
  { value: "notion", label: "Notion Formula" },
  { value: "objectivec", label: "Objective-C" },
  { value: "ocaml", label: "OCaml" },
  { value: "pascal", label: "Pascal" },
  { value: "perl", label: "Perl" },
  { value: "php", label: "PHP" },
  { value: "powershell", label: "PowerShell" },
  { value: "prolog", label: "Prolog" },
  { value: "protobuf", label: "Protocol Buffers" },
  { value: "purescript", label: "PureScript" },
  { value: "python", label: "Python" },
  { value: "r", label: "R" },
  { value: "racket", label: "Racket" },
  { value: "reasonml", label: "Reason" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
  { value: "scala", label: "Scala" },
  { value: "scheme", label: "Scheme" },
  { value: "scss", label: "SCSS" },
  { value: "shell", label: "Shell" },
  { value: "smalltalk", label: "Smalltalk" },
  { value: "solidity", label: "Solidity" },
  { value: "sql", label: "SQL" },
  { value: "swift", label: "Swift" },
  { value: "toml", label: "TOML" },
  { value: "typescript", label: "TypeScript" },
  { value: "verilog", label: "Verilog" },
  { value: "vhdl", label: "VHDL" },
  { value: "vbnet", label: "Visual Basic" },
  { value: "wasm", label: "WebAssembly" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
];
