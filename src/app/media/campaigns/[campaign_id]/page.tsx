"use client";

import { useGetSIngleCampaigns } from "@/hooks/campaignHooks";
import { useParams } from "next/navigation";
import { CiClock2 } from "react-icons/ci";
import { IoMdDoneAll } from "react-icons/io";
import { PiRadioactive } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import { IoCalendarOutline } from "react-icons/io5";
import { FaToolbox } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import React, { useMemo } from "react";
import { getDayDifference, moneyFormat } from "@/utilities/helpers";
import { PageLoader } from "@/components/elements";
import { FaNairaSign } from "react-icons/fa6";

const CampaignDetails = () => {
  const { campaign_id } = useParams();

  const { data: singleCampaign, isLoading } = useGetSIngleCampaigns({
    campaign_id,
  });

  const data = useMemo(() => {
    return singleCampaign?.data?.data;
  }, [singleCampaign]);

  const fast = (data?.targetAudience ?? [])
    .map((item: any) => item?.replace(/_/g, "-") ?? "")
    .join(", ");

  const days = getDayDifference(data?.startDate, data?.endDate);

  const headData = [
    {
      icon: <TbTargetArrow className="text-xl" />,
      heading: "Objective",
      text: `${data?.primaryGoal.replace(/_/g, " ")}`,
    },
    {
      icon: <SlPeople className="text-xl" />,
      heading: "Target Audience",
      text: `${fast}`,
    },
    {
      icon: <IoCalendarOutline className="text-xl" />,
      heading: "Timeline",
      text: `${days}`,
    },
    {
      icon: <FaNairaSign className="text-xl" />,
      heading: "Total Budget",
      text: `₦${moneyFormat(data?.totalBudget)}`,
    },
    {
      icon: <IoLocationOutline className="text-xl" />,
      heading: "Location",
      text: `${data?.location}`,
    },
  ];

  return (
    <>
      {isLoading ? (
        <div className="mt-10">
          <PageLoader />
        </div>
      ) : (
        <div className="mx-3 mb-5 mt-10 border rounded-sm p-3 md:p-10">
          <div className="flex items-start gap-3 justify-between flex-wrap">
            <div>
              <h1 className="text-base md:text-xl font-semibold">
                {data?.campaignName}
              </h1>
              <p className="text-xs md:text-sm">{data?.campaignDescription}</p>
            </div>

            <div>
              {" "}
              <div
                className={`${
                  data?.status == "active"
                    ? "text-green-500"
                    : data?.status == "pending"
                    ? "text-amber-300"
                    : data?.status == "completed"
                    ? "text-red-500"
                    : ""
                } py-1 flex items-center gap-2 font-medium px-2.5 border rounded-full text-xs w-fit`}
              >
                {data?.status == "pending" ? (
                  <CiClock2 className="text-base" />
                ) : data?.status == "active" ? (
                  <PiRadioactive className="text-base" />
                ) : data?.status == "completed" ? (
                  <IoMdDoneAll className="text-base" />
                ) : null}{" "}
                <span>{data?.status}</span>
              </div>
            </div>
          </div>

          <div className="py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 border-b">
            {headData.map((item, i) => (
              <div className="flex items-center gap-2" key={i}>
                <span>{item?.icon}</span>

                <div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {item?.heading}
                  </h3>
                  <p className="capitalize text-xs md:text-sm">{item?.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 px-2">
            <div className="flex gap-2 items-center">
              <FaToolbox className="text-xl" />
              <h3 className="text-xl font-semibold">Platforms</h3>
            </div>

            <div className="flex items-center justify-between gap-5 flex-wrap mt-2">
              {data?.mediaSelections?.map((item: any, i: number) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <p>{item?.channel.replace(/_/g, " ")}</p>
                  <p className="px-2.5 py-1 bg-gray-100 rounded-full w-fit text-sm font-medium">
                    {item?.option.replace(/_/g, " ")}
                  </p>
                  <p>
                    <span className="text-sm font-medium">Duration:</span>{" "}
                    <span className="text-xs">{item?.duration}</span>
                  </p>
                  <span className="text-sm font-medium">
                    Price: ₦{moneyFormat(item?.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignDetails;
