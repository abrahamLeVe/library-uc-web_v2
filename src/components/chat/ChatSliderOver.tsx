"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Messages } from "@/lib/validations/message";
import { Message, useChat } from "@ai-sdk/react";
import { AlertCircle, CornerDownLeft, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useContext, useEffect, useRef } from "react";

import { MessagesContext } from "@/providers/messages.provider";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import EmojiPopup from "./EmojiPopup";
import MarkdownLite from "./MarkdownLite";

export default function ChatSliderOver() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    messages: messagesCtx,
    addMessage,
    addAssistantMessage,
  } = useContext(MessagesContext);

  // ✅ Hook en el nivel superior (sin useMemo)
  const { input, handleInputChange, handleSubmit, status, messages, error } =
    useChat({
      onFinish: (message: Message) => {
        addAssistantMessage(message.content);
      },
    });

  useEffect(() => {
    if (error) console.error("Error completo en frontend:", error);
  }, [error]);

  const displayedMessages = messages.length === 0 ? messagesCtx : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const isStreaming = status === "submitted" || status === "streaming";
  const isBlocked = isStreaming || input.trim() === "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBlocked) return;

    const newMessage: Messages = {
      id: nanoid(),
      role: "user",
      content: input.slice(0, 100),
      createdAt: new Date().toISOString(),
    };

    addMessage(newMessage);
    handleSubmit(e);
  };

  const handleEmojiClick = (emoji: string) => {
    const newValue = input + emoji;
    handleInputChange({
      target: { value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="p-2 rounded-full h-full" title="BiblioBot">
          <img
            src="/bot.png"
            alt="chat bot"
            className="w-[60px] h-[60px]"
            loading="lazy"
          />
          Chatear
        </Button>
      </SheetTrigger>

      <SheetContent className="pt-20">
        <SheetHeader className="flex flex-row fixed top-0 w-full border-b-2  z-10">
          <img
            src="/botProfile.png"
            alt="chat bot"
            className="w-[40px] h-[40px]"
            loading="lazy"
          />
          <div>
            <SheetTitle className="text-yellow-500">BiblioBot</SheetTitle>
            <SheetDescription>Soporte y búsqueda</SheetDescription>
          </div>
        </SheetHeader>

        <div className="h-full flex flex-col justify-between px-4">
          <ScrollArea className="overflow-auto mt-4">
            {displayedMessages.map((message) => (
              <Card
                key={message.id}
                className={cn("relative my-4 w-fit", {
                  "ml-auto": message.role === "user",
                  "bg-gray-950 text-white": message.role === "assistant",
                })}
              >
                <CardContent>
                  {message.role === "assistant" && (
                    <Avatar className="absolute -top-4 left-0 overflow-visible">
                      <AvatarImage src="/botMessage.png" alt="chat bot" />
                      <AvatarFallback>BB</AvatarFallback>
                    </Avatar>
                  )}
                  <SheetClose asChild>
                    <MarkdownLite text={message.content} />
                  </SheetClose>
                </CardContent>
              </Card>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="flex flex-col justify-between">
            {error?.message && (
              <Alert variant="destructive" className="text-red-500">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <SheetFooter className="flex flex-row">
              <EmojiPopup onSelectEmoji={handleEmojiClick} />
              <form onSubmit={onSubmit} className="w-full relative">
                <Input
                  id="message"
                  onChange={handleInputChange}
                  value={input}
                  maxLength={100}
                  ref={inputRef}
                  autoFocus
                  placeholder="Escribe un mensaje..."
                  className="bg-white/50 placeholder:text-gray-500 focus:bg-white/80 focus:ring-0 focus:border-yellow-500"
                />
                <Button
                  variant="outline"
                  className="pointer-events-none absolute inset-y-0 right-0"
                  type="submit"
                  disabled={isBlocked}
                >
                  {isStreaming ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CornerDownLeft />
                  )}
                </Button>
              </form>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
