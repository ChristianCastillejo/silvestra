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
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);
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
      .min(1, translate("validation.emailRequired"))
      .email(translate("validation.emailInvalid")),
    name: z.string().min(1, translate("validation.nameRequired")),
    message: z.string().min(1, translate("validation.messageRequired")),
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
          `${translate("errors.serverError")}: ${text || response.statusText}`
        );
        return;
      }

      const data = (await response.json()) as {
        message?: string;
        error?: unknown;
      };

      if (!response.ok) {
        const errorMessage = data.message ?? translate("errors.failedToSend");
        toast.error(errorMessage);
        return;
      }

      setMessage(data.message ?? translate("success.messageSent"));
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : translate("errors.unknownError");
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
            placeholder={translate("form.namePlaceholder")}
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
            placeholder={translate("form.emailPlaceholder")}
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
        placeholder={translate("form.messagePlaceholder")}
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
        {translate("form.sendButton")}
      </Button>
      {message && <p className="text-gray">{message}</p>}
    </div>
  );
}
