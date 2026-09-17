import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import "./MultiRangeSliderStyles.css";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: Function;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  min,
  max,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  // useEffect(() => {
  //   onChange({ min: minVal, max: maxVal });
  // }, [minVal, maxVal]);

  const generateCustomClassName = (baseClassName: string, conditions: any) => {
    const classNames = [baseClassName];

    for (const [conditionClass, condition] of Object.entries(conditions)) {
      if (condition) {
        classNames.push(conditionClass);
      }
    }

    return classNames.join(" ");
  };

  const customClassName = generateCustomClassName("thumb thumb--zindex-3", {
    "thumb--zindex-5": minVal > max - 100,
  });

  return (
    <div className="relative">
      <p className="my-4  text-gray-900 ">Fees Range</p>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
          onChange({ min: value, max: maxVal });
        }}
        className={customClassName}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
          onChange({ min: minVal, max: value });
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider absolute">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
        <div className="slider__left-value font-bold text-black">
          {formatter.format(minVal)}
        </div>
        <div className="slider__right-value font-bold text-black">
          {formatter.format(maxVal)}
        </div>
      </div>
    </div>
  );
};

export { MultiRangeSlider };
