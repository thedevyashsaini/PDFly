"use client";

import React from "react";
import { login } from "../app/actions";
import { redirect } from "next/navigation";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { subjects } from "@/subjects";
import { cn } from "@/lib/utils";

interface InteractiveDivProps {
  subject:
    | {
        type: "user";
        properties: {};
      }
    | false;
}

const InteractiveDiv: React.FC<InteractiveDivProps> = ({ subject }) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        subject ? redirect("/app") : login();
      }}
    >
      <AnimatedGradientText className="mt-8">
        🎉
        <span
          className={cn(
            `ml-1 inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
          )}
        >
          Get Started | For Free
        </span>
        <ChevronRight className="ml-1 size-5 fill-white transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </div>
  );
};

export default InteractiveDiv;
