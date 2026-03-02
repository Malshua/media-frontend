import React from "react";

const Display = ({
  label,
  color,
  background,
  dot,
}: {
  label: string;
  background: string;
  color: string;
  dot: string;
}) => {
  return (
    <div
      className="w-fit py-1 px-2 flex items-center gap-2 rounded-2xl"
      style={{ background: background }}
    >
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: dot }}
      />
      <span className="text-xs capitalize" style={{ color: color }}>
        {label}
      </span>
    </div>
  );
};

const GetStatusBadge = ({ status }: { status: string }) => {
  const DisplayStatus = (key: string) => {
    const statusArray = [
      "confirmed",
      "paid",
      "success",
      "completed",
      "approved",
      "accepted",
      "active",
      "yes",
    ];

    let component;

    if (statusArray.includes(key)) {
      component = (
        <Display
          label={key}
          color="#027A48"
          background="#ECFDF3"
          dot="#12B76A"
        />
      );
    } else {
      switch (key) {
        case "pending":
          component = (
            <Display
              label={key}
              color="#B54708"
              background="#FFFAEB"
              dot="#F79009"
            />
          );
          break;

        case "processing":
          component = (
            <Display
              label={key}
              color="#344054"
              background="#F2F4F7"
              dot="#667085"
            />
          );
          break;

        case "suspended":
        case "declined":
        case "cancelled":
          component = (
            <Display
              label={key}
              color="#C01048"
              background="#FFF1F3"
              dot="#F63D68"
            />
          );
          break;

        case "failed":
        case "no":
          component = (
            <Display
              label={key}
              color="#B42318"
              background="#FEF3F2"
              dot="#F04438"
            />
          );
          break;

        case "not paid":
          component = (
            <Display
              label="not paid"
              color="#B42318"
              background="#FEF3F2"
              dot="#F04438"
            />
          );
          break;

        case "rejected":
          component = (
            <Display
              label="rejected"
              color="#C01048"
              background="#FFF1F3"
              dot="#F63D68"
            />
          );
          break;

        case "cancelled":
          component = (
            <Display
              label="cancelled"
              color="#B42318"
              background="#FEF3F2"
              dot="#F04438"
            />
          );
          break;

        case "overdue":
          component = (
            <Display
              label="overdue"
              color="#B42318"
              background="#FEF3F2"
              dot="#F04438"
            />
          );
          break;

        case "due":
          component = (
            <Display
              label="due"
              color="#175CD3"
              background="#EFF8FF"
              dot="#2E90FA"
            />
          );
          break;

        default:
          break;
      }
    }

    return component;
  };

  return <div>{DisplayStatus(status)}</div>;
};

export default GetStatusBadge;
