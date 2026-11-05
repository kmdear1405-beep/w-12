
"use client";

import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Color = "green" | "red" | "blue";
type Operator = "+" | "-" | "*" | "/" | null;
type CalcState = "first" | "operator" | "second";

const colors: Record<Color, string> = {
  green: "bg-[rgb(4,146,4)] hover:brightness-110",
  red: "bg-[rgb(231,99,99)] hover:brightness-110",
  blue: "bg-[rgb(143,143,212)] hover:brightness-110",
};

type BtnProps = {
  color: Color;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

function Btn({
  color,
  children,
  disabled = false,
  onClick,
  className = "",
}: BtnProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`h-[60px] w-[60px] shrink-0 rounded-[12px] border-2 border-gray-500 text-2xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${colors[color]} ${className}`}
    >
      {children}
    </button>
  );
}

const formatNumber = (value: string) => {
  if (value === "" || value === "-") return value;

  const [integer, decimal] = value.split(".");
  const formattedInteger = integer.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );

  return decimal !== undefined
    ? `${formattedInteger}.${decimal}`
    : formattedInteger;
};

export default function Page() {
  const router = useRouter()
    useEffect(()=>checkLogin(router,'/calculator'),[router])


  const [display, setDisplay] = useState("0");
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [operator, setOperator] = useState<Operator>(null);
  const [calcState, setCalcState] = useState<CalcState>("first");
  const [lastChar, setLastChar] = useState("");
  const [memory, setMemory] = useState(0);
  const [repeatOperator, setRepeatOperator] =
  useState<Operator>(null);

  const calculate = useCallback(
    (a: number, b: number, op: Operator): number => {
      switch (op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return b === 0 ? NaN : a / b;
        default:
          return b;
      }
    },
    [],
  );

  const showNumber = (value: number) => {
    if (!Number.isFinite(value)) {
      setDisplay("Error");
      setFirst(0);
      setSecond(0);
      setOperator(null);
      setCalcState("first");
      setLastChar("equal");
      return;
    }

    const rounded = Number(value.toPrecision(10));
    const text = String(rounded);

    // จำกัดความยาวตัวเลขที่แสดง
    setDisplay(text.length > 15 ? rounded.toExponential(6) : text);
  };
const init = useCallback(() => {
  setDisplay("0");
  setFirst(0);
  setSecond(0);
  setOperator(null);
  setCalcState("first");
  setLastChar("");
  setRepeatOperator(null);
}, []);

  const numberClick = useCallback(
    (num: string) => {
      if (display === "Error") {
        setDisplay(num);
        setFirst(0);
        setSecond(0);
        setOperator(null);
        setCalcState("first");
        setLastChar("number");
        return;
      }

      // หลังจากกด = ให้เริ่มป้อนตัวเลขชุดใหม่
      if (lastChar === "equal") {
        setDisplay(num);
        setFirst(0);
        setSecond(0);
        setOperator(null);
        setCalcState("first");
        setLastChar("number");
        return;
      }

      if (calcState === "operator") {
        setDisplay(num);
        setCalcState("second");
      } else {
        if (display.replace("-", "").replace(".", "").length >= 9) {
          return;
        }

        setDisplay((current) =>
          current === "0" ? num : current + num,
        );
      }

      setLastChar("number");
    },
    [calcState, display, lastChar],
  );

  const operatorClick = useCallback(
    (op: Operator) => {
      if (!op || display === "Error") return;

      const current = Number(display);

      if (lastChar === "equal" || operator === null) {
        setFirst(current);
        setOperator(op);
        setCalcState("operator");
      } else if (calcState === "operator") {
        // กดเปลี่ยนเครื่องหมายก่อนใส่เลขตัวที่สอง
        setOperator(op);
      } else {
        const result = calculate(first, current, operator);
        showNumber(result);
        setFirst(result);
        setSecond(current);
        setOperator(op);
        setCalcState("operator");
      }

      setLastChar("operator");
    },
    [calcState, calculate, display, first, lastChar, operator],
  );

  
const equalClick = useCallback(() => {
  if (display === "Error") return;

  // ถ้ากด = ซ้ำ ให้ใช้เลขและเครื่องหมายเดิม
  if (lastChar === "equal") {
    if (repeatOperator === null) return;

    const result = calculate(
      Number(display),
      second,
      repeatOperator,
    );

    showNumber(result);
    setFirst(result);
    setLastChar("equal");
    return;
  }

  if (operator === null) return;

  let b = Number(display);

  if (calcState === "operator") {
    b = first;
  } else if (calcState === "first") {
    return;
  }

  const result = calculate(first, b, operator);

  setSecond(b);
  setRepeatOperator(operator);
  showNumber(result);
  setFirst(result);
  setOperator(null);
  setCalcState("first");
  setLastChar("equal");
}, [
  calculate,
  calcState,
  display,
  first,
  operator,
  lastChar,
  repeatOperator,
  second,
  showNumber,
]);


  const clearEntry = useCallback(() => {
    if (calcState === "second" && operator !== null) {
      setDisplay("0");
      setLastChar("");
    } else {
      init();
    }
  }, [calcState, init, operator]);

  const decimalClick = useCallback(() => {
    if (display === "Error" || lastChar === "equal") {
      setDisplay("0.");
      setFirst(0);
      setOperator(null);
      setCalcState("first");
      setLastChar("number");
      return;
    }

    if (calcState === "operator") {
      setDisplay("0.");
      setCalcState("second");
      setLastChar("number");
      return;
    }

    if (!display.includes(".")) {
      setDisplay((current) => current + ".");
    }

    setLastChar("number");
  }, [calcState, display, lastChar]);

  const unaryClick = (action: "sign" | "sqrt" | "percent" | "reciprocal") => {
    if (display === "Error") return;

    const value = Number(display);
    let result = value;

    switch (action) {
      case "sign":
        result = -value;
        break;
      case "sqrt":
        result = value < 0 ? NaN : Math.sqrt(value);
        break;
      case "percent":
        result = value / 100;
        break;
      case "reciprocal":
        result = value === 0 ? NaN : 1 / value;
        break;
    }

    showNumber(result);
    setLastChar("number");
  };

  const memoryClear = () => setMemory(0);

  const memoryRecall = () => {
    showNumber(memory);
    setLastChar("number");
  };

  const memoryAdd = () => {
    if (display !== "Error") {
      setMemory((current) => current + Number(display));
    }
  };

  const memorySubtract = () => {
    if (display !== "Error") {
      setMemory((current) => current - Number(display));
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        numberClick(event.key);
      } else if (event.key === ".") {
        event.preventDefault();
        decimalClick();
      } else if (event.key === "+") {
        event.preventDefault();
        operatorClick("+");
      } else if (event.key === "-") {
        event.preventDefault();
        operatorClick("-");
      } else if (event.key === "*") {
        event.preventDefault();
        operatorClick("*");
      } else if (event.key === "/") {
        event.preventDefault();
        operatorClick("/");
      } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        equalClick();
      } else if (event.key === "Escape") {
        init();
      } else if (event.key === "Backspace") {
        setDisplay((current) =>
          current === "Error" || current.length <= 1
            ? "0"
            : current.slice(0, -1),
        );
      }
    },
    [decimalClick, equalClick, init, numberClick, operatorClick],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex justify-center px-2 py-6 text-center font-sans font-bold">
      <div className="rounded-t-[22px] border-[4px] border-black bg-[rgb(100,98,98)]">
        <div className="rounded-[18px] border-[6px] border-[rgb(81,78,78)] bg-[rgb(201,201,197)] p-[14px]">
          <div
            aria-live="polite"
            className="flex h-16 w-[332px] max-w-full items-center justify-end overflow-hidden rounded-[12px] bg-[rgb(198,249,249)] px-3 text-[2rem] tabular-nums"
          >
            <span className="truncate">{formatNumber(display)}</span>
          </div>

          <div className="mt-[14px] flex gap-2">
            <Btn color="green" onClick={memoryClear}disabled>MC</Btn>
            <Btn color="green" onClick={memoryRecall}disabled>MR</Btn>
            <Btn color="green" onClick={memoryAdd}disabled>M+</Btn>
            <Btn color="green" onClick={memorySubtract}disabled>M-</Btn>
            <Btn color="red" onClick={clearEntry}>CE</Btn>
          </div>

          <div className="mt-2 flex gap-2">
            <Btn color="blue" onClick={() => numberClick("7")}>7</Btn>
            <Btn color="blue" onClick={() => numberClick("8")}>8</Btn>
            <Btn color="blue" onClick={() => numberClick("9")}>9</Btn>
            <Btn color="green" onClick={() => operatorClick("/")}disabled>÷</Btn>
            <Btn color="green" onClick={() => unaryClick("sqrt")}disabled>√</Btn>
          </div>

          <div className="mt-2 flex gap-2">
            <Btn color="blue" onClick={() => numberClick("4")}>4</Btn>
            <Btn color="blue" onClick={() => numberClick("5")}>5</Btn>
            <Btn color="blue" onClick={() => numberClick("6")}>6</Btn>
            <Btn color="green" onClick={() => operatorClick("*")}disabled>x</Btn>
            <Btn color="green" onClick={() => unaryClick("percent")}disabled>%</Btn>
          </div>

          <div className="mt-2 flex gap-2">
            <Btn color="blue" onClick={() => numberClick("1")}>1</Btn>
            <Btn color="blue" onClick={() => numberClick("2")}>2</Btn>
            <Btn color="blue" onClick={() => numberClick("3")}>3</Btn>
            <Btn color="green" onClick={() => operatorClick("-")}>-</Btn>
            <Btn color="green" onClick={() => unaryClick("reciprocal")}disabled>1/x</Btn>
          </div>

          <div className="mt-2 flex gap-2">
            <Btn color="blue" onClick={() => numberClick("0")}>0</Btn>
            <Btn color="blue" onClick={decimalClick} disabled>.</Btn>
            <Btn color="blue" onClick={() => unaryClick("sign")}disabled>+/-</Btn>
            <Btn color="green" onClick={() => operatorClick("+")}>+</Btn>
            <Btn color="green" onClick={equalClick}>=</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
