"use client";
import { Button, TextArea } from "@/components/elements";
import { Modal } from "@/components/widgets";
import { useRequestRevision } from "@/hooks/mediaHooks";
import { useInvalidateMedia } from "@/hooks/useInvalidateQueries";
import { Routes } from "@/utilities/routes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  note: string;
};
const RevisePlan = ({ openModal, setOpenModal, data }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { RefetchMedia, RefetchSingleMedia } = useInvalidateMedia();
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate: RequestRevision } = useRequestRevision({
    mediaPlanId: data?.mediaPlanId,
    campaignId: data?.id,
  });

  const handleReprompt = handleSubmit((data) => {
    const payload: any = {
      feedback: data?.note,
    };

    setIsSubmitting(true);
    RequestRevision(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast?.success(response?.data?.message);
        RefetchSingleMedia();
        RefetchMedia();
        setOpenModal(false);
        push(Routes?.MEDIA_PLANNING);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message);
      },
    });
  });

  return (
    <>
      <Modal
        open={openModal}
        openModal={() => setOpenModal(false)}
        backgroundColor="bg-white"
      >
        <div className="flex sm:w-96 flex-col gap-5 p-3">
          <h2 className="text-lg font-bold text-red-600">Revise Media Plan</h2>

          <Controller
            control={control}
            name="note"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <TextArea
                label=""
                placeholder="Enter revision instructions"
                error={errors.note && "Give instructions to be effected"}
                {...field}
              />
            )}
          />

          <Button
            className="w-full bg-fuchsia-900 hover:bg-[#59044c] capitalize py-2.5 font-medium text-white"
            text="Revise plan"
            loading={isSubmitting}
            onClick={handleReprompt}
          />
        </div>
      </Modal>
    </>
  );
};

export default RevisePlan;
