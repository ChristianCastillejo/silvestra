"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { cn } from "@/utils/cn";

interface Props {
  readonly className?: string;
}

interface SubscribeResponse {
  readonly message: string;
}

export default function Newsletter({ className }: Props) {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof (data as Record<string, unknown>).message === "string"
            ? (data as SubscribeResponse).message
            : t("errors.subscribeFailed");
        toast.error(errorMessage);
        return;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as Record<string, unknown>).message === "string"
      ) {
        setMessage((data as SubscribeResponse).message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.unexpectedError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${className ?? ""} flex flex-col`}
    >
      <div className="flex gap-2 mt-5 w-full justify-center">
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          className="px-5 py-4 border text-sm border-border rounded-full outline-none w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
          required
          aria-label={t("ariaLabels.email")}
          aria-required="true"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className={cn(
            "!w-fit !px-10 text-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label={t("ariaLabels.subscribe")}
        >
          {t("signUp")}
        </Button>
      </div>
      {message && (
        <p className="success-msg text-sm" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
