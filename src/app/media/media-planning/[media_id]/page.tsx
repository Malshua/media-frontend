"use client";

import {
  FaBullhorn,
  FaUsers,
  FaChartLine,
  FaFlag,
  FaLightbulb,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import {
  InfoRow,
  KeyValue,
  ListGroup,
  RevisePlan,
  SectionCard,
} from "@/components/sections/media-planning";
import {
  useApproveMediaPlan,
  useGetMediaPlan,
  useGetPlan,
} from "@/hooks/mediaHooks";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Button, PageLoader } from "@/components/elements";
import { toast } from "react-toastify";
import { useInvalidateMedia } from "@/hooks/useInvalidateQueries";
import { Routes } from "@/utilities/routes";

function SingleMediaPlan() {
  const { media_id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const { RefetchMedia, RefetchSingleMedia } = useInvalidateMedia();

  // const { data: singlePlan, isLoading } = useGetMediaPlan({
  //   mediaPlanId: media_id,
  // });

  const { data: single, isLoading } = useGetPlan({
    campaignId: media_id,
  });

  const plan = useMemo(() => {
    return single?.data?.data?.mediaPlan;
  }, [single]);

  const { mutate: approvePlan } = useApproveMediaPlan({
    campaignId: plan?.campaignId,
    mediaPlanId: plan?.id,
  });

  const handleApprove = () => {
    const payload: any = {};

    setIsApproving(true);
    approvePlan(payload, {
      onSuccess: (response) => {
        setIsApproving(true);
        toast.success(response?.data?.message || "Plan approved successfully!");
        RefetchSingleMedia();
        RefetchMedia();
        push(Routes?.MEDIA_PLANNING);
      },
      onError: (error: any) => {
        setIsApproving(true);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  console.log(isOpen);

  return (
    <>
      {isLoading ? (
        <div className="mt-10">
          <PageLoader />
        </div>
      ) : (
        <>
          {!plan?.isApproved && (
            <div className="mt-10 mx-5 sm:mx-20 flex gap-3 justify-end">
              <Button
                className="text-sm font-medium py-1.5 px-3.5 bg-green-600 rounded-lg text-white w-fit text-center"
                text="Approve Plan"
                onClick={handleApprove}
                loading={isApproving}
              />

              <Button
                className="text-sm font-medium py-1.5 px-3.5 bg-orange-600 rounded-lg text-white w-32 text-center"
                text="Revise Plan"
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            </div>
          )}
          <RevisePlan openModal={isOpen} setOpenModal={setIsOpen} data={plan} />
          <div className="w-full mx-auto max-w-6xl p-6 space-y-8">
            {/* HEADER */}
            <div className="bg-white shadow rounded-xl p-6">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaBullhorn className="text-primary" /> {plan?.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {plan?.executiveSummary}
              </p>
            </div>

            {/* BASIC INFO
      <SectionCard title="Campaign Overview" icon={<FaClipboardList />}>
        <KeyValue label="Campaign ID" value={plan?.campaignId} />
        <KeyValue label="Media Plan ID" value={plan?.id} />
        <KeyValue label="Created By" value={plan?.createdBy} />
        <KeyValue
          label="Created At"
          value={new Date(plan?.createdAt).toLocaleString()}
        />
        <KeyValue
          label="Last Updated"
          value={new Date(plan?.updatedAt).toLocaleString()}
        />
        <KeyValue label="AI Version" value={plan?.aiVersion} />
      </SectionCard> */}

            {/* OBJECTIVES */}
            <SectionCard title="Campaign Objectives" icon={<FaFlag />}>
              {plan?.objectives?.map((o: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <InfoRow label="Metric" value={o?.metric} />
                  <InfoRow label="Objective" value={o?.objective} />
                  <InfoRow label="Description" value={o?.description} />
                </div>
              ))}
            </SectionCard>

            {/* AUDIENCE INSIGHTS */}
            <SectionCard title="Audience Insights" icon={<FaUsers />}>
              {plan?.audienceInsights?.map((a: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <h3 className="font-semibold text-primary">{a?.persona}</h3>
                  <ListGroup label="Behaviors" items={a?.behaviors} />
                  <ListGroup label="Pain Points" items={a?.painPoints} />
                  <ListGroup label="Motivations" items={a?.motivations} />
                  <InfoRow
                    label="Age Range"
                    value={a?.demographics?.ageRange}
                  />
                  <InfoRow label="Location" value={a?.demographics?.location} />
                </div>
              ))}
            </SectionCard>

            {/* MESSAGING & BIG IDEA */}
            <SectionCard title="Messaging Strategy" icon={<FaLightbulb />}>
              <InfoRow label="Key Messaging" value={plan?.keyMessaging} />
              <InfoRow label="Big Idea" value={plan?.bigIdea} />
            </SectionCard>

            {/* CHANNEL STRATEGY */}
            <SectionCard title="Channel Strategy" icon={<FaChartLine />}>
              {plan?.channelStrategy?.map((c: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <h3 className="text-lg font-semibold">{c?.channel}</h3>
                  <ListGroup label="Tactics" items={c?.tactics} />
                  <InfoRow label="Rationale" value={c?.rationale} />
                  <InfoRow
                    label="Budget Percentage"
                    value={`${c?.percentage}%`}
                  />
                  <InfoRow label="Expected Reach" value={c?.expectedReach} />
                </div>
              ))}
            </SectionCard>

            {/* EXECUTION TIMELINE */}
            <SectionCard title="Execution Timeline" icon={<FaCalendarAlt />}>
              {plan?.executionTimeline?.map((t: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <h3 className="text-lg font-semibold">{t?.phase}</h3>
                  <InfoRow label="Duration" value={t?.duration} />
                  <ListGroup label="Activities" items={t?.activities} />
                  <ListGroup label="Milestones" items={t?.milestones} />
                  <ListGroup label="Deliverables" items={t?.deliverables} />
                </div>
              ))}
            </SectionCard>

            {/* BUDGET */}
            <SectionCard title="Budget Allocation" icon={<FaMoneyBillWave />}>
              {plan?.budgetAllocation?.map((b: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <h3 className="text-lg font-semibold">{b?.channel}</h3>
                  <InfoRow
                    label="Amount"
                    value={`₦${b?.amount?.toLocaleString()}`}
                  />
                  <InfoRow label="Percentage" value={`${b?.percentage}%`} />
                  <InfoRow label="Justification" value={b?.justification} />
                </div>
              ))}
            </SectionCard>

            {/* CONTENT STRATEGY */}
            <SectionCard title="Content Strategy" icon={<FaBullhorn />}>
              {plan?.contentStrategy?.map((c: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <InfoRow label="Pillar" value={c?.pillar} />
                  <ListGroup label="Formats" items={c?.formats} />
                  <ListGroup label="Examples" items={c?.examples} />
                  <InfoRow label="Frequency" value={c?.frequency} />
                </div>
              ))}
            </SectionCard>

            {/* INFLUENCER STRATEGY */}
            <SectionCard title="Influencer Strategy" icon={<FaUsers />}>
              {plan?.influencerStrategy?.map((iS: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <InfoRow label="Tier" value={iS?.tier} />
                  <ListGroup label="Niches" items={iS?.niches} />
                  <InfoRow
                    label="Target Followers"
                    value={iS?.targetFollowers}
                  />
                  <InfoRow
                    label="Expected Engagement"
                    value={iS?.expectedEngagement}
                  />
                  <ListGroup
                    label="Recommended Influencers"
                    items={iS?.recommendedInfluencers}
                  />
                </div>
              ))}
            </SectionCard>

            {/* KPIs */}
            <SectionCard
              title="Key Performance Indicators (KPIs)"
              icon={<FaChartLine />}
            >
              {plan?.kpis?.map((k: any, i: number) => (
                <div key={i} className="border-b py-4 last:border-0">
                  <InfoRow label="Metric" value={k?.metric} />
                  <InfoRow label="Target" value={k?.target} />
                  <InfoRow label="Channel" value={k?.channel} />
                  <InfoRow label="Measurement" value={k?.measurement} />
                </div>
              ))}
            </SectionCard>

            {/* MEASUREMENT PLAN */}
            <SectionCard title="Measurement Plan" icon={<FaClipboardList />}>
              {plan?.measurementPlan?.map((m: any, i: number) => (
                <div key={i}>
                  <InfoRow label="Tool" value={m?.tool} />
                  <ListGroup label="Metrics" items={m?.metrics} />
                  <InfoRow label="Frequency" value={m?.frequency} />
                  <InfoRow
                    label="Reporting Schedule"
                    value={m?.reportingSchedule}
                  />
                </div>
              ))}
            </SectionCard>

            {/* RECOMMENDATIONS */}
            <SectionCard title="Recommendations" icon={<FaLightbulb />}>
              <p className="text-gray-700">{plan?.recommendations}</p>
            </SectionCard>
          </div>
        </>
      )}
    </>
  );
}

export default SingleMediaPlan;
