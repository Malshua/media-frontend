"use client";
import { Button, TextArea } from "@/components/elements";
import { Modal } from "@/components/widgets";
import { useSubmitFeedback } from "@/hooks/mediaHooks";
import { useInvalidateMedia } from "@/hooks/useInvalidateQueries";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  comment: string;
};

const FEEDBACK_TYPES = [
  { value: "general", label: "General Feedback" },
  { value: "budget", label: "Budget Concerns" },
  { value: "timeline", label: "Timeline Changes" },
  { value: "strategy", label: "Strategy Adjustments" },
  { value: "content", label: "Content Revisions" },
];

const FeedbackModal = ({
  openModal,
  setOpenModal,
  data,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  data: any;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const { RefetchSingleMedia } = useInvalidateMedia();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate: SubmitFeedback } = useSubmitFeedback({
    mediaPlanId: data?.id,
    campaignId: data?.campaignId,
  });

  const handleSendFeedback = handleSubmit((formData) => {
    const payload: any = {
      comment: formData.comment,
      feedbackType,
    };

    setIsSubmitting(true);
    SubmitFeedback(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast.success(
          response?.data?.message || "Feedback sent successfully!"
        );
        RefetchSingleMedia();
        reset();
        setFeedbackType("general");
        setOpenModal(false);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(
          error?.response?.data?.message || "Failed to send feedback"
        );
      },
    });
  });

  return (
    <Modal
      open={openModal}
      openModal={() => setOpenModal(false)}
      backgroundColor="bg-card"
    >
      <div className="flex sm:w-[28rem] flex-col gap-5 p-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Send Feedback to Admin
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Share your recommendations or corrections for this media plan.
          </p>
        </div>

        {/* Feedback Type Selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Feedback Category
          </label>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFeedbackType(type.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  feedbackType === type.value
                    ? "bg-primary text-white border-primary"
                    : "bg-muted text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Comment */}
        <Controller
          control={control}
          name="comment"
          rules={{
            required: "Please describe your feedback or corrections",
            minLength: {
              value: 10,
              message: "Feedback must be at least 10 characters",
            },
          }}
          render={({ field }) => (
            <TextArea
              label="Your Feedback"
              placeholder="Describe your recommendations, corrections, or concerns about this media plan..."
              error={errors.comment?.message}
              {...field}
            />
          )}
        />

        <div className="flex items-center gap-3">
          <Button
            className="flex-1 bg-muted hover:bg-accent capitalize py-2.5 font-medium text-foreground rounded-lg"
            text="Cancel"
            onClick={() => {
              reset();
              setFeedbackType("general");
              setOpenModal(false);
            }}
          />
          <Button
            className="flex-1 bg-orange-600 hover:bg-orange-700 capitalize py-2.5 font-medium text-white rounded-lg"
            text="Send Feedback"
            loading={isSubmitting}
            onClick={handleSendFeedback}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
