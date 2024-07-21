import { RefObject, useRef } from "react";

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formRef = useRef<HTMLFormElement>(null);
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };
  return { formRef, onKeyDown };
}
