import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as ReactDOM from "react-dom";

interface PortalProps extends useRender.ComponentProps<"div"> {
  container?: Element | DocumentFragment | null;
}

function Portal(props: PortalProps) {
  const { container: containerProp, render, className, ...otherProps } = props;

  const [mounted, setMounted] = React.useState(false);

  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null);

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">({ className }, otherProps),
  });

  if (!container || !element) return null;

  return ReactDOM.createPortal(element, container);
}

export { Portal };
export type { PortalProps };
