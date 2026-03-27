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
  ListGroup,
  RevisePlan,
  FeedbackModal,
  SectionCard,
} from "@/components/sections/media-planning";
import {
  useApproveMediaPlan,
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { push } = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const { RefetchMedia, RefetchSingleMedia } = useInvalidateMedia();

  // const { data: singlePlan, isLoading } = useGetMediaPlan({
  //   mediaPlanId: media_id,
  // });

  const { data: single, isLoading } = useGetPlan({
    campaignId: media_id,
  });

  const plans: any[] = useMemo(() => {
    return single?.data?.data?.mediaPlans || [];
  }, [single]);

  const campaign = useMemo(() => {
    return single?.data?.data?.campaign;
  }, [single]);

  // The latest plan is the last one (ordered by createdAt ASC from API)
  const latestPlan = plans.length > 0 ? plans[plans.length - 1] : null;

  // Show action buttons only on the latest plan if user hasn't approved yet
  const showActionButtons = latestPlan && campaign?.userApprovalStatus !== 'approved';

  // Parse bigIdea for each plan
  const parseBigIdea = (bigIdea: any) => {
    if (!bigIdea) return null;
    try {
      return typeof bigIdea === 'string' ? JSON.parse(bigIdea) : bigIdea;
    } catch {
      return bigIdea;
    }
  };

  const { mutate: approvePlan } = useApproveMediaPlan({
    campaignId: latestPlan?.campaignId,
    mediaPlanId: latestPlan?.id,
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
      ) : plans.length === 0 ? (
        <div className="mt-10 p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Media Plan Not Found</h2>
          <p className="text-muted-foreground mb-6">
            No media plan has been generated for this campaign yet.
          </p>
          <Button
            className="text-sm font-medium py-2 px-4 bg-primary rounded-lg text-white"
            text="Go Back"
            onClick={() => push(Routes?.MEDIA_PLANNING)}
          />
        </div>
      ) : (
        <>
          {/* Top action buttons — only for latest plan */}
          {showActionButtons && (
            <div className="mt-10 mx-5 sm:mx-20 flex gap-3 justify-end">
              <Button
                className="text-sm font-medium py-1.5 px-3.5 bg-green-600 rounded-lg text-white w-fit text-center"
                text="Approve Plan"
                onClick={handleApprove}
                loading={isApproving}
              />

              <Button
                className="text-sm font-medium py-1.5 px-3.5 bg-orange-600 rounded-lg text-white w-32 text-center"
                text="Send Feedback"
                onClick={() => {
                  setFeedbackOpen(true);
                }}
              />
            </div>
          )}
          <FeedbackModal openModal={feedbackOpen} setOpenModal={setFeedbackOpen} data={latestPlan} />
          <RevisePlan openModal={isOpen} setOpenModal={setIsOpen} data={latestPlan} />

          {/* Render ALL plan versions */}
          {plans.map((plan, index) => {
            const isLatest = index === plans.length - 1;
            const isUpdated = index > 0;
            const versionLabel = plans.length > 1 ? `Version ${index + 1}` : null;
            const parsedBigIdea = parseBigIdea(plan.bigIdea);

            return (
              <div key={plan.id} className="w-full mx-auto max-w-6xl p-3 md:p-6 space-y-8 overflow-hidden">
                {/* VERSION SEPARATOR — shown between plans */}
                {index > 0 && (
                  <hr className="border-t-2 border-dashed border-muted-foreground/30" />
                )}

                {/* HEADER */}
                <div className="bg-card shadow rounded-xl p-3 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                      <FaBullhorn className="text-primary" /> {plan?.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      {versionLabel && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {versionLabel}
                        </span>
                      )}
                      {isUpdated && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          <FaCheckCircle className="text-blue-500" />
                          Updated
                        </span>
                      )}
                      {isLatest && plans.length > 1 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    {plan?.executiveSummary}
                  </p>
                </div>

                {/* OBJECTIVES */}
                {plan?.objectives && plan?.objectives.length > 0 && (
                  <SectionCard title="Campaign Objectives" icon={<FaFlag />}>
                    {plan?.objectives?.map((o: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <InfoRow label="Metric" value={o?.metric} />
                        <InfoRow label="Objective" value={o?.objective} />
                        <InfoRow label="Description" value={o?.description} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* AUDIENCE INSIGHTS */}
                {plan?.audienceInsights && plan?.audienceInsights.length > 0 && (
                  <SectionCard title="Audience Insights" icon={<FaUsers />}>
                    {plan?.audienceInsights?.map((a: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <h3 className="font-semibold text-primary">{a?.persona}</h3>
                        <ListGroup label="Behaviors" items={a?.behaviors} />
                        <ListGroup label="Pain Points" items={a?.painPoints} />
                        <ListGroup label="Motivations" items={a?.motivations} />
                        <InfoRow label="Age Range" value={a?.demographics?.ageRange} />
                        <InfoRow label="Location" value={a?.demographics?.location} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* MESSAGING & BIG IDEA */}
                <SectionCard title="Messaging Strategy" icon={<FaLightbulb />}>
                  <InfoRow label="Key Messaging" value={plan?.keyMessaging} />
                  {parsedBigIdea && typeof parsedBigIdea === 'object' ? (
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg mb-2">Big Idea</h3>
                      <InfoRow label="Campaign Name" value={parsedBigIdea?.campaignName} />
                      <InfoRow label="Tagline" value={parsedBigIdea?.tagline} />
                      <InfoRow label="Concept" value={parsedBigIdea?.concept} />
                      <InfoRow label="Rationale" value={parsedBigIdea?.rationale} />
                      {parsedBigIdea?.proofPoints && (
                        <ListGroup label="Proof Points" items={parsedBigIdea.proofPoints} />
                      )}
                      <InfoRow label="Tone of Voice" value={parsedBigIdea?.toneOfVoice} />
                      <InfoRow label="Visual Direction" value={parsedBigIdea?.visualDirection} />
                    </div>
                  ) : (
                    <InfoRow label="Big Idea" value={plan?.bigIdea} />
                  )}
                </SectionCard>

                {/* CHANNEL STRATEGY */}
                {plan?.channelStrategy && plan?.channelStrategy.length > 0 && (
                  <SectionCard title="Channel Strategy" icon={<FaChartLine />}>
                    {plan?.channelStrategy?.map((c: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <h3 className="text-lg font-semibold">{c?.channel}</h3>
                        <ListGroup label="Tactics" items={c?.tactics} />
                        <InfoRow label="Rationale" value={c?.rationale} />
                        <InfoRow label="Budget Percentage" value={`${c?.percentage}%`} />
                        <InfoRow label="Expected Reach" value={c?.expectedReach} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* EXECUTION TIMELINE */}
                {plan?.executionTimeline && plan?.executionTimeline.length > 0 && (
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
                )}

                {/* BUDGET */}
                {plan?.budgetAllocation && plan?.budgetAllocation.length > 0 && (
                  <SectionCard title="Budget Allocation" icon={<FaMoneyBillWave />}>
                    {plan?.budgetAllocation?.map((b: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <h3 className="text-lg font-semibold">{b?.channel}</h3>
                        <InfoRow label="Amount" value={`₦${b?.amount?.toLocaleString()}`} />
                        <InfoRow label="Percentage" value={`${b?.percentage}%`} />
                        <InfoRow label="Justification" value={b?.justification} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* CONTENT STRATEGY */}
                {plan?.contentStrategy && plan?.contentStrategy.length > 0 && (
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
                )}

                {/* INFLUENCER STRATEGY */}
                {plan?.influencerStrategy && plan?.influencerStrategy.length > 0 && (
                  <SectionCard title="Influencer Strategy" icon={<FaUsers />}>
                    {plan?.influencerStrategy?.map((iS: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <InfoRow label="Tier" value={iS?.tier} />
                        <InfoRow label="Count" value={iS?.count} />
                        <InfoRow label="Budget" value={`₦${iS?.budget?.toLocaleString()}`} />
                        <ListGroup label="Niches" items={iS?.niches} />
                        <ListGroup label="Content Types" items={iS?.contentTypes} />
                        <InfoRow label="Target Followers" value={iS?.targetFollowers} />
                        <InfoRow label="Expected Engagement" value={iS?.expectedEngagement} />
                        <ListGroup label="Recommended Profiles" items={iS?.recommendedProfiles} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* KPIs */}
                {plan?.kpis && plan?.kpis.length > 0 && (
                  <SectionCard title="Key Performance Indicators (KPIs)" icon={<FaChartLine />}>
                    {plan?.kpis?.map((k: any, i: number) => (
                      <div key={i} className="border-b py-4 last:border-0">
                        <InfoRow label="Metric" value={k?.metric} />
                        <InfoRow label="Target" value={k?.target} />
                        <InfoRow label="Channel" value={k?.channel} />
                        <InfoRow label="Measurement" value={k?.measurement} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* MEASUREMENT PLAN */}
                {plan?.measurementPlan && plan?.measurementPlan.length > 0 && (
                  <SectionCard title="Measurement Plan" icon={<FaClipboardList />}>
                    {plan?.measurementPlan?.map((m: any, i: number) => (
                      <div key={i}>
                        <InfoRow label="Tool" value={m?.tool} />
                        <ListGroup label="Metrics" items={m?.metrics} />
                        <InfoRow label="Frequency" value={m?.frequency} />
                        <InfoRow label="Reporting Schedule" value={m?.reportingSchedule} />
                      </div>
                    ))}
                  </SectionCard>
                )}

                {/* RECOMMENDATIONS */}
                {plan?.recommendations && (
                  <SectionCard title="Recommendations" icon={<FaLightbulb />}>
                    <p className="text-muted-foreground">{plan?.recommendations}</p>
                  </SectionCard>
                )}

                {/* ACTION BUTTONS — only at bottom of latest plan */}
                {isLatest && showActionButtons && (
                  <div className="flex gap-3 justify-center py-6">
                    <Button
                      className="text-sm font-medium py-2.5 px-6 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                      text="Approve Media Plan"
                      onClick={handleApprove}
                      loading={isApproving}
                    />

                    <Button
                      className="text-sm font-medium py-2.5 px-6 bg-orange-600 hover:bg-orange-700 rounded-lg text-white"
                      text="Send Feedback"
                      onClick={() => {
                        setFeedbackOpen(true);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

export default SingleMediaPlan;
