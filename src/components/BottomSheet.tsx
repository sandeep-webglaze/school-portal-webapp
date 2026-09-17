import React from "react";

let startPosition = 0;
let currentPosition = 0;
let oldTranslateBy = 0;
let translateBy = 0;

export default function BottomSheet({ show, onHide, children }: any) {
  const [translateStyle, setTranslateStyle] = React.useState("0");
  const [dragging, setDragging] = React.useState(false);

  const handleRelease = () => {
    if (translateBy <= oldTranslateBy && translateBy !== 0) {
      translateBy = 0;
      setTranslateStyle("0");
      onHide();
    } else {
      setTranslateStyle(`-100% - 20px`);
      translateBy = 0;
      oldTranslateBy = 0;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    handleRelease();
  };

  const handleMove = (y: any) => {
    if (startPosition === 0 && currentPosition === 0) {
      startPosition = y;
    }

    let newPosition = startPosition - currentPosition;

    if (newPosition >= 0) {
      currentPosition = startPosition;
      newPosition = 0;
    }

    if (newPosition !== oldTranslateBy && newPosition !== translateBy) {
      oldTranslateBy = translateBy;
    }

    translateBy = newPosition;

    setTranslateStyle(`-100% - 20px - ${newPosition}px`);
    currentPosition = y;
  };

  const handleMouseMove = (e: any) => {
    const y = e.clientY;
    if (y !== currentPosition) {
      handleMove(e.clientY);
    }
  };

  return (
    <React.Fragment>
      <div
        className={`${
          show
            ? " opacity-100   w-full h-screen  overflow-x-hidden overflow-y-auto fixed inset-0  z-30 outline-none focus:outline-none bg-neutral-800/70  "
            : "opacity-0 "
        } `}
        onClick={onHide}
      />
      <div
        style={
          show
            ? {
                transform: `translateY(calc(${translateStyle}))`,
                zIndex: 50,
              }
            : {}
        }
        className={`bottom-sheet${show ? " show" : ""}${
          dragging ? " dragging" : ""
        }`}
      >
        <div className="bottom-sheet-grip">
          <div />
        </div>
        {children}
      </div>
    </React.Fragment>
  );
}
