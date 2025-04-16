
import React from "react";
import { Request } from "@/types/request";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface ActionTypeSelectorResult {
  showAcceptButton: boolean;
  showCompleteButton: boolean;
  showClearButton: boolean;
  isPending: boolean;
  isActive: boolean;
  isCompleted: boolean;
}

export const useActionTypeSelector = (request: Request): ActionTypeSelectorResult => {
  const { isSupport } = useProfileAccess();
  
  // Determine which buttons to show based on role and request status
  const isPending = request.status === "pending";
  const isActive = request.status === "active";
  const isCompleted = request.status === "completed";
  
  // Support users should see different buttons based on request status
  const showAcceptButton = isSupport && isPending;
  const showCompleteButton = isSupport && isActive;
  
  // Simplified clear button logic:
  // 1. Support users can ONLY clear completed requests
  // 2. Non-support users can clear pending or active requests
  const showClearButton = 
    (isSupport && isCompleted) ||
    (!isSupport && (isPending || isActive));
    
  return {
    showAcceptButton,
    showCompleteButton,
    showClearButton,
    isPending,
    isActive,
    isCompleted
  };
};
