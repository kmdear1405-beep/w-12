"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

const fieldImage = "/BG.jpg";
const basketballImg = "/bask.png";
const footballImg = "/football.png";
const volleyballImg = "/vol.png";
const faceImg = "/Thanawat.jpg";

type BallType = "none" | "basketball" | "football" | "volleyball" | "face";

interface AnimationProps {
  fieldWidth?: number;
  fieldHeight?: number;
  ballRadius?: number;
  ballVelocity?: number;
  keyEvent: KeyboardEvent | null;
}

const ballImages: Record<BallType, string> = {
  none: "",
  basketball: basketballImg,
  football: footballImg,
  volleyball: volleyballImg,
  face: faceImg,
};

const Animation = ({
  fieldWidth,
  fieldHeight,
  ballRadius,
  ballVelocity,
  keyEvent,
}: AnimationProps) => {
  //default
  const _fieldWidth = fieldWidth || 680;
  const _fieldHeight = fieldHeight || 500;
  const _ballRadius = ballRadius || 50;
  const _ballVelocity = ballVelocity || 200;
  //internal calculate
  const _ballDiameter = 2 * _ballRadius;
  const maxX = _fieldWidth - _ballDiameter - 10;
  const maxY = _fieldHeight - _ballDiameter - 10;
  const xVelocity = Math.round(_ballVelocity * Math.sqrt(2));
  const yVelocity = Math.round(_ballVelocity * Math.sqrt(2));
  const frameRate = 25;
  const frameTime = 1 / frameRate;

  const ballRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ballType, setBallType] = useState<BallType>("none");
  const [running, setRunning] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [moveLeft, setMoveLeft] = useState(true);
  const [moveDown, setMoveDown] = useState(true);
  const [rotations, setRotations] = useState(0);

  useEffect(() => {
    if (!keyEvent) return;
    if (keyEvent.key === " ") setRunning((r) => !r);
    else if (keyEvent.key === "1") setBallType("none");
    else if (keyEvent.key === "2") setBallType("basketball");
    else if (keyEvent.key === "3") setBallType("football");
    else if (keyEvent.key === "4") setBallType("volleyball");
    else if (keyEvent.key === "5") setBallType("face");
  }, [keyEvent]);

  useEffect(() => {
    if (!ballRef.current) return;
    const img = ballImages[ballType];
    ballRef.current.style.backgroundImage = img ? `url(${img})` : "";
  }, [ballType]);

  useEffect(() => {
    if (running) {
      timer.current = setTimeout(() => {
        calculateNextFrame();
      }, frameTime * 1000);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  });

  const calculateNextFrame = () => {
    //x axis
    if (moveLeft) {
      setX((x) => x + xVelocity / frameRate);
      if (x >= maxX) {
        setX((x) => x - (x - maxX));
        setMoveLeft(false);
        return maxX;
      }
      setRotations((rotations) => rotations + 20);
    } else {
      setX((x) => x - xVelocity / frameRate);
      if (x <= 0) {
        setX((x) => -x);
        setMoveLeft(true);
        return maxX;
      }
      setRotations((rotations) => rotations - 20);
    }

    //y axis
    if (moveDown) {
      setY((y) => y + yVelocity / frameRate);
      if (y >= maxY) {
        setY((y) => y - (y - maxY));
        setMoveDown(false);
      }
    } else {
      setY((y) => y - yVelocity / frameRate);
      if (y <= 0) {
        setY((y) => -y);
        setMoveDown(true);
      }
    }
  };
  const router = useRouter()
    useEffect(()=>checkLogin(router,'/animation'),[router])

  return (
    //animation container
    <div className="mx-auto mt-3" style={{ width: "fit-content" }}>
      {/* field */}
      <div
        className="relative rounded-xl border-2 border-black"
        style={{
          width: `${_fieldWidth}px`,
          height: `${_fieldHeight}px`,
          backgroundImage: `url(${fieldImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/* ball */}
        <div
          className="absolute rounded-full border border-black"
          style={{
            width: `${_ballDiameter}px`,
            height: `${_ballDiameter}px`,
            top: `${y}px`,
            left: `${x}px`,
            backgroundColor: "lightblue",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `rotate(${rotations}deg)`,
          }}
          ref={ballRef}
        ></div>
      </div>

      {/* button row */}
      <div className="mt-3 flex justify-between gap-4">
        <Button
          variant={running ? "danger" : "success"}
          appearance="fill"
          size="lg"
          className="text-lg"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Run"}
        </Button>
        {/* ball type */}
        <div className="flex justify-end gap-2">
          <Button
            className=" text-lg"
            size="lg"
            appearance={ballType === "none" ? "fill" : "outline"}
            onClick={() => setBallType("none")}
          >
            None
          </Button>
          <Button
           className=" text-lg"
            size="lg"
            appearance={ballType === "basketball" ? "fill" : "outline"}
            onClick={() => setBallType("basketball")}
          >
            Basketball
          </Button>
          <Button
            className=" text-lg"
            size="lg"
            appearance={ballType === "football" ? "fill" : "outline"}
            onClick={() => setBallType("football")}
          >
            Football
          </Button>
          <Button
            className=" text-lg"
            size="lg"
            appearance={ballType === "volleyball" ? "fill" : "outline"}
            onClick={() => setBallType("volleyball")}
          >
            Volleyball
          </Button>
          <Button
            size="lg"
            className="text-lg"
            appearance={ballType === "face" ? "fill" : "outline"}
            onClick={() => setBallType("face")}
          >
            Face
          </Button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => setKeyEvent(e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Animation keyEvent={keyEvent} />
      {/* <Animation fieldHeight={200} fieldWidth={300} ballRadius={25} /> */}
    </>
  );
}

export default App;
