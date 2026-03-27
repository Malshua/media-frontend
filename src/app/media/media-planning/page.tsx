"use client";
import { MediaPlanTable } from "@/components/sections/media-planning";
import React from "react";
import { motion } from "framer-motion";

const MediaPlanning = () => {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Media Plans</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage your AI-generated media plans
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.08,
        }}
        className="mt-6"
      >
        <MediaPlanTable />
      </motion.div>
    </div>
  );
};

export default MediaPlanning;
