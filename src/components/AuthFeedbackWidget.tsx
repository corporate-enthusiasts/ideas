"use client";

import { useAuth } from "@/lib/useAuth";
import FeedbackWidget from "./FeedbackWidget";

export default function AuthFeedbackWidget() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <FeedbackWidget />;
}
