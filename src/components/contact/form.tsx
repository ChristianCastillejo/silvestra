"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/utils/cn";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactSchema = z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    name: z.string().min(1, t("validation.nameRequired")),
    message: z.string().min(1, t("validation.messageRequired")),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlesubmit = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    setErrors({});
    const validationResult = contactSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);

      const firstError = validationResult.error.issues[0];
      if (firstError) {
        toast.error(firstError.message);
      }
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        toast.error(
          `${t("errors.serverError")}: ${text || response.statusText}`
        );
        return;
      }

      const data = (await response.json()) as {
        message?: string;
        error?: unknown;
      };

      if (!response.ok) {
        const errorMessage = data.message ?? t("errors.failedToSend");
        toast.error(errorMessage);
        return;
      }

      setMessage(data.message ?? t("success.messageSent"));
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.unknownError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t("form.namePlaceholder")}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            type="email"
            placeholder={t("form.emailPlaceholder")}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <Textarea
        rows={8}
        placeholder={t("form.messagePlaceholder")}
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        error={!!errors.message}
        required
      />
      {errors.message && (
        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
      )}
      <Button
        onClick={handlesubmit}
        variant="fill"
        isLoading={loading}
        className={cn("!w-fit !px-10")}
      >
        {t("form.sendButton")}
      </Button>
      {message && <p className="text-gray">{message}</p>}
    </div>
  );
}
