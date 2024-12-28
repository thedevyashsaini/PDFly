"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Subjects } from "@/subjects";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "./ui/separator";
import { logout } from "@/app/actions";

interface NavBarProps {
  subject: Subjects;
}

export default function Navbar({ subject }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-black text-white p-4 border-b-[0.5px] border-[#303030]">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          PDFly
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/"
            className={pathname.endsWith("app") ? "white" : "text-white-600"}
          >
            Home
          </Link>
          <Button variant="ghost" className={`text-white text-gray-400`}>
            New Chat <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full px-1 hover:bg-[#303030]">
                <Image
                  src={subject.properties.pfp}
                  alt="Profile"
                  className="rounded-full w-8 h-8"
                  width={320}
                  height={320}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white b-[0.5px] border-[#303030]">
              <DropdownMenuItem>
                <span>{subject.properties.name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>{subject.properties.email}</DropdownMenuItem>
              <Separator className="bg-[#303030] my-2" />
              <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                  Log out <ChevronRight />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-black bl-[0.5px] border-[#303030] text-white"
          >
            <DialogTitle asChild>
              <VisuallyHidden>Menu</VisuallyHidden>
            </DialogTitle>
            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="justify-start"
              >
                <Plus className="mr-2 h-4 w-4" /> New Chat
              </Button>
              <Separator className="bg-[#303030]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start py-6">
                    <Image
                      src={subject.properties.pfp}
                      alt="Profile"
                      className="mr-2 w-8 rounded-full"
                      width={1080}
                      height={1080}
                    />
                    <span>{subject.properties.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-black border-black">
                  <DropdownMenuItem className="text-white">
                    {subject.properties.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white cursor-pointer" onClick={() => logout()}>
                    Log out <ChevronRight />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
