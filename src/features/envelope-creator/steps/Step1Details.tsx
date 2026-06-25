"use client";

import { useForm } from "react-hook-form";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, FileSignature } from "lucide-react";
import { cn } from "@/lib/utils";

type FormData = {
  title: string;
  description: string;
  expiryDate: string;
  reminderFrequency: "none" | "daily" | "every2days" | "weekly";
};

const REMINDER_OPTIONS = [
  { value: "none",       label: "No reminders" },
  { value: "daily",      label: "Daily" },
  { value: "every2days", label: "Every 2 days" },
  { value: "weekly",     label: "Weekly" },
];

export function Step1Details() {
  const { wizardData, updateWizardData, nextStep } = useEnvelopeStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: wizardData.title,
      description: wizardData.description,
      expiryDate: wizardData.expiryDate,
      reminderFrequency: (wizardData.reminderFrequency as FormData["reminderFrequency"]) || "none",
    },
  });

  const onSubmit = (data: FormData) => {
    updateWizardData(data);
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mb-4 shadow-sm">
          <FileSignature className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold">Envelope Details</h2>
        <p className="text-sm text-muted-foreground mt-1">Fill in the basic information for your signature request</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="envelope-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="envelope-title"
            placeholder="e.g., Employment Agreement - John Smith"
            aria-invalid={!!errors.title}
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "Title must be at least 3 characters" },
            })}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="envelope-description">Description</Label>
          <Textarea
            id="envelope-description"
            placeholder="Brief description of the document purpose..."
            rows={3}
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="envelope-expiry">Expiry Date</Label>
            <Input
              id="envelope-expiry"
              type="date"
              {...register("expiryDate")}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Reminder Frequency */}
          <div className="space-y-2">
            <Label htmlFor="envelope-reminder">Reminder Frequency</Label>
            <Select
              defaultValue={wizardData.reminderFrequency || "none"}
              onValueChange={(v) => setValue("reminderFrequency", v as FormData["reminderFrequency"])}
            >
              <SelectTrigger id="envelope-reminder">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" id="step1-next-btn">
            Continue to Documents
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
