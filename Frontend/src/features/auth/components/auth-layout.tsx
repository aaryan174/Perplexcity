"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { EyeBall, Pupil } from "./animated-eyes";

// ─── Shared hook: mouse tracking ────────────────────────────

export function useMousePosition() {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { mouseX, mouseY };
}

// ─── Shared hook: random blinking ───────────────────────────

export function useBlinking() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  return isBlinking;
}

// ─── Shared: calculate character position from mouse ────────

export function useCharacterPosition(
  ref: React.RefObject<HTMLDivElement | null>,
  mouseX: number,
  mouseY: number
) {
  if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

  const rect = ref.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;

  const faceX = Math.max(-15, Math.min(15, deltaX / 20));
  const faceY = Math.max(-10, Math.min(10, deltaY / 30));
  const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

  return { faceX, faceY, bodySkew };
}

// ─── Animated Characters Panel (Left Side) ──────────────────

interface AnimatedCharactersPanelProps {
  password: string;
  showPassword: boolean;
  isTyping: boolean;
}

export function AnimatedCharactersPanel({
  password,
  showPassword,
  isTyping,
}: AnimatedCharactersPanelProps) {
  const { mouseX, mouseY } = useMousePosition();
  const isPurpleBlinking = useBlinking();
  const isBlackBlinking = useBlinking();
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  // Looking at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple peeking when password visible
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };
      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const purplePos = useCharacterPosition(purpleRef, mouseX, mouseY);
  const blackPos = useCharacterPosition(blackRef, mouseX, mouseY);
  const yellowPos = useCharacterPosition(yellowRef, mouseX, mouseY);
  const orangePos = useCharacterPosition(orangeRef, mouseX, mouseY);

  const pwVisible = password.length > 0 && showPassword;
  const pwHidden = password.length > 0 && !showPassword;

  return (
    <div
      className="relative hidden lg:flex flex-col justify-between p-12"
      style={{ backgroundColor: "#7F7F7F", color: "#ffffff" }}
    >
      <div className="relative z-20">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div
            className="size-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Sparkles className="size-4" />
          </div>
          <span>F.R.I.D.A.Y</span>
        </div>
      </div>

      <div className="relative z-20 flex items-end justify-center h-[500px]">
        <div className="relative" style={{ width: "550px", height: "400px" }}>
          {/* Purple character */}
          <div
            ref={purpleRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "70px",
              width: "180px",
              height: isTyping || pwHidden ? "440px" : "400px",
              backgroundColor: "#6C3FF5",
              borderRadius: "10px 10px 0 0",
              zIndex: 1,
              transform: pwVisible
                ? "skewX(0deg)"
                : isTyping || pwHidden
                  ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                  : `skewX(${purplePos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-8 transition-all duration-700 ease-in-out"
              style={{
                left: pwVisible ? "20px" : isLookingAtEachOther ? "55px" : `${45 + purplePos.faceX}px`,
                top: pwVisible ? "35px" : isLookingAtEachOther ? "65px" : `${40 + purplePos.faceY}px`,
              }}
            >
              <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={pwVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={pwVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
              <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={pwVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={pwVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
            </div>
          </div>

          {/* Black character */}
          <div
            ref={blackRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "240px",
              width: "120px",
              height: "310px",
              backgroundColor: "#2D2D2D",
              borderRadius: "8px 8px 0 0",
              zIndex: 2,
              transform: pwVisible
                ? "skewX(0deg)"
                : isLookingAtEachOther
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : isTyping || pwHidden
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                    : `skewX(${blackPos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-6 transition-all duration-700 ease-in-out"
              style={{
                left: pwVisible ? "10px" : isLookingAtEachOther ? "32px" : `${26 + blackPos.faceX}px`,
                top: pwVisible ? "28px" : isLookingAtEachOther ? "12px" : `${32 + blackPos.faceY}px`,
              }}
            >
              <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={pwVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={pwVisible ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
              <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={pwVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={pwVisible ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
            </div>
          </div>

          {/* Orange character */}
          <div
            ref={orangeRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "0px",
              width: "240px",
              height: "200px",
              zIndex: 3,
              backgroundColor: "#FF9B6B",
              borderRadius: "120px 120px 0 0",
              transform: pwVisible ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-8 transition-all duration-200 ease-out"
              style={{
                left: pwVisible ? "50px" : `${82 + (orangePos.faceX || 0)}px`,
                top: pwVisible ? "85px" : `${90 + (orangePos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
            </div>
          </div>

          {/* Yellow character */}
          <div
            ref={yellowRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "310px",
              width: "140px",
              height: "230px",
              backgroundColor: "#E8D754",
              borderRadius: "70px 70px 0 0",
              zIndex: 4,
              transform: pwVisible ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-6 transition-all duration-200 ease-out"
              style={{
                left: pwVisible ? "20px" : `${52 + (yellowPos.faceX || 0)}px`,
                top: pwVisible ? "35px" : `${40 + (yellowPos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
            </div>
            <div
              className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
              style={{
                left: pwVisible ? "10px" : `${40 + (yellowPos.faceX || 0)}px`,
                top: pwVisible ? "88px" : `${88 + (yellowPos.faceY || 0)}px`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>

      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-1/4 right-1/4 size-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(5,5,5,0.05)" }} />
      <div className="absolute bottom-1/4 left-1/4 size-96 rounded-full blur-3xl" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

// ─── Auth Page Layout ───────────────────────────────────────

interface AuthPageLayoutProps {
  password: string;
  showPassword: boolean;
  isTyping: boolean;
  children: React.ReactNode;
}

export function AuthPageLayout({
  password,
  showPassword,
  isTyping,
  children,
}: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AnimatedCharactersPanel
        password={password}
        showPassword={showPassword}
        isTyping={isTyping}
      />
      <div
        className="flex items-center justify-center p-8"
        style={{ backgroundColor: "#000000ff", color: "#ffffff" }}
      >
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
