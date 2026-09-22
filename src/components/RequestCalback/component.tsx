"use client";
import React, { Fragment, useEffect } from "react";
import { BiMessageDetail } from "react-icons/bi";
import useContactModal from "@/hooks/useContactFoemModal";
import { ContactModal } from "@/components/Modals/ContactModal";

interface RequestCallBackProps {
  autoOpen?: boolean;
  showButton?: boolean;
  delay?: number; // optional delay before auto open (in ms)
  title?: string; // modal title
}

const RequestCallBack: React.FC<RequestCallBackProps> = ({
  autoOpen = false,
  showButton = true,
  delay = 0,
  title = "Find the Perfect School for Your Child",
}) => {
  const contactModal = useContactModal();

  useEffect(() => {
    if (!autoOpen) return;

    // Only auto-open the popup a few times per browser (max 3). After that it
    // stays available via the buttons, but stops popping up on its own.
    const MAX_AUTO_POPUPS = 3;
    let count = 0;
    try {
      count = parseInt(localStorage.getItem("ep_auto_popup_count") || "0", 10) || 0;
    } catch {
      count = 0;
    }
    if (count >= MAX_AUTO_POPUPS) return;

    const timer = setTimeout(() => {
      contactModal.onOpen();
      try {
        localStorage.setItem("ep_auto_popup_count", String(count + 1));
      } catch {
        /* ignore */
      }
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen, delay]);

  return (
    <Fragment>
      {showButton ? (
        // Center-bottom pill CTA
        <button
          onClick={() => contactModal.onOpen()}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 rounded-full bg-gradient-to-r from-green-600 to-green-500 py-3 px-6 md:px-10 font-semibold text-white shadow-lg hover:opacity-90 transition"
        >
          Get Admission Help
        </button>
      ) : (
        // Bottom-right chat FAB (sits above the back-to-top button)
        <button
          onClick={() => contactModal.onOpen()}
          className="group fixed bottom-24 right-6 z-40 flex items-center"
          title="Quick Enquiry"
        >
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-blacky-light px-3 py-1.5 text-xs font-semibold text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg">
            Quick Enquiry
          </span>
          <span className="h-14 w-14 rounded-full bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <BiMessageDetail size={26} />
          </span>
        </button>
      )}

      <ContactModal name="quick-enquiry" title={title} />
    </Fragment>
  );
};

export default RequestCallBack;
