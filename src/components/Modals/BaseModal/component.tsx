"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

import { Button } from "../../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  large?: boolean;
  willClose?: boolean;
  primaryBtn?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  large = true,
  willClose = true,
  primaryBtn = true,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      setShowModal(true);
      window.history.pushState(null, "", "#modalOpen");
    } else {
      document.body.classList.remove("modal-open");
      setShowModal(false);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#modalOpen") {
        // Set showModal to true when hash is #modalOpen
        setShowModal(true);
        document.body.classList.add("modal-open");
      } else {
        if (disabled || !willClose) return;

        // Set showModal to false when hash is anything else
        setShowModal(false);
        document.body.classList.remove("modal-open");
        setTimeout(() => {
          onClose(); // Close the modal
        }, 300);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
    // `disabled` and `willClose` are read inside handleHashChange — they
    // need to be in deps so we re-bind the listener with fresh values when
    // the parent toggles either.
  }, [onClose, disabled, willClose]);

  useEffect(() => {
    if (isOpen) {
      window.location.hash = "modalOpen"; // Update hash when modal is open
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled || !willClose) {
      return;
    }
    window.history.back();
    // `willClose` is read in the early-return guard — must be in deps for
    // handleClose to see updates from the parent. `onClose` is not actually
    // called here (we trigger a hashchange via window.history.back() and
    // let the hashchange listener handle close), but kept for parity.
  }, [onClose, disabled, willClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }
  const modalContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 ">{body}</div>
      {primaryBtn && (
        <div className="flex flex-col px-6 pb-6 shadow border-t">
          <div className="flex flex-row items-center gap-4 w-full">
            {secondaryAction && secondaryActionLabel && (
              <Button
                disabled={disabled}
                fullWidth
                large={large}
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
                outline
              />
            )}
            <Button
              disabled={disabled}
              fullWidth
              large={large}
              label={actionLabel}
              onClick={handleSubmit}
            />
          </div>
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70 overflow-hidden">
        <div className="relative w-full md:w-3/5 lg:w-2/4 xl:w-2/6 my-6 mx-auto h-full lg:h-auto md:h-auto">
          <div
            className={`translate duration-300 h-full ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate h-full border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute right-9"
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              <div className="flex-1 flex flex-col overflow-auto">
                <div className="flex-1">{modalContent}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Modal };
