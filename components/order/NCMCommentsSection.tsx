import { MailIcon, SendIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";

import { renderSFSymbolIcon } from "@/lib/icon-mapper";
import {
  createNCMComment,
  getNCMOrderComments,
  NCMOrderComment,
} from "@/lib/ncm-helpers";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================================================
// TYPES
// ============================================================================

interface NCMCommentsSectionProps {
  ncmOrderId: number;
  refreshTrigger?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NCMCommentsSection: React.FC<NCMCommentsSectionProps> = ({
  ncmOrderId,
  refreshTrigger,
}) => {
  const [comments, setComments] = useState<NCMOrderComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments from NCM
  const fetchComments = useCallback(async () => {
    if (!ncmOrderId) return;

    setLoading(true);
    try {
      const result = await getNCMOrderComments(ncmOrderId);
      if (result.success && result.data) {
        // Ensure data is an array before processing
        const commentsArray = Array.isArray(result.data) ? result.data : [];
        // Sort by added_time descending (newest first)
        const sorted = commentsArray.sort(
          (a, b) =>
            new Date(b.added_time).getTime() - new Date(a.added_time).getTime(),
        );
        setComments(sorted);
      }
    } catch (error) {
      console.error("Error fetching NCM comments:", error);
    } finally {
      setLoading(false);
    }
  }, [ncmOrderId]);

  // Load comments when expanded
  useEffect(() => {
    if (expanded && comments.length === 0) {
      fetchComments();
    }
  }, [expanded, fetchComments, comments.length]);

  // Refetch when parent triggers refresh (pull-to-refresh)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0 && expanded) {
      fetchComments();
    }
  }, [refreshTrigger, expanded, fetchComments]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    if (newComment.length > 500) {
      Alert.alert("Error", "Comment must be less than 500 characters");
      return;
    }

    setSubmitting(true);
    Keyboard.dismiss();

    try {
      const result = await createNCMComment(ncmOrderId, newComment.trim());

      if (result.success) {
        setNewComment("");
        // Refresh comments list
        await fetchComments();
      } else {
        Alert.alert("Error", result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding NCM comment:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get badge color based on who added the comment
  const getAuthorConfig = (addedBy: string) => {
    if (addedBy === "NCM Staff") {
      return {
        color: "#2563EB",
        bgColor: "rgba(37, 99, 235, 0.1)",
        label: "NCM Staff",
      };
    }
    return {
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)",
      label: "You",
    };
  };

  return (
    <View className="mt-4">
      {/* Section Header */}
      <Typography variation="label"
        style={{ fontSize: 15, marginBottom: 10, color: "#374151" }}
      >
        NCM Comments
      </Typography>

      {/* Card Container */}
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Expandable Header */}
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center justify-between px-4 py-3.5"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MailIcon width={16} height={16} color="#9CA3AF" style={{ marginRight: 10 }} />
            <Typography variation="body" style={{ color: "#6B7280", fontSize: 14 }}>
              Communication with NCM
            </Typography>
          </View>
          <View className="flex-row items-center">
            {loading ? (
              <ActivityIndicator size="small" color="#9CA3AF" />
            ) : (
              <>
                <Typography variation="caption" style={{ color: "#9CA3AF", marginRight: 4 }}>
                  {comments.length > 0 ? `${comments.length} messages` : "View"}
                </Typography>
                {renderSFSymbolIcon(expanded ? "chevron.up" : "chevron.down", {
                  size: 12,
                  color: "#9CA3AF",
                })}
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Comments Content (when expanded) */}
        {expanded && (
          <View style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
            {/* Add Comment Input */}
            <View className="px-4 py-3" style={{ backgroundColor: "#F9FAFB" }}>
              <View
                className="flex-row items-end rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Add a comment..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={500}
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 14,
                    color: "#1F2937",
                    maxHeight: 80,
                  }}
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  className="px-3 py-2.5"
                  style={{
                    opacity: submitting || !newComment.trim() ? 0.5 : 1,
                  }}
                  activeOpacity={0.7}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#3B82F6" />
                  ) : (
                    <SendIcon width={18} height={18} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              </View>
              <Typography variation="caption"
                style={{ color: "#9CA3AF", marginTop: 4, textAlign: "right" }}
              >
                {newComment.length}/500
              </Typography>
            </View>

            {/* Comments List */}
            <View className="px-4 pb-4">
              {loading ? (
                <View className="py-6 items-center">
                  <ActivityIndicator size="small" color="#9CA3AF" />
                  <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 8 }}>
                    Loading comments...
                  </Typography>
                </View>
              ) : comments.length === 0 ? (
                <View className="py-6 items-center">
                  <MailIcon width={32} height={32} color="#D1D5DB" />
                  <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 8 }}>
                    No comments yet
                  </Typography>
                  <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 2 }}>
                    Add a comment to communicate with NCM
                  </Typography>
                </View>
              ) : (
                <View className="mt-3">
                  {comments.map((comment, index) => {
                    const authorConfig = getAuthorConfig(comment.addedBy);
                    const isLast = index === comments.length - 1;

                    return (
                      <View
                        key={`${comment.orderid}-${comment.added_time}-${index}`}
                        className={`py-3 ${!isLast ? "border-b border-[#F3F4F6]" : ""}`}
                      >
                        {/* Comment Header */}
                        <View className="flex-row items-center justify-between mb-2">
                          <View
                            className="px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: authorConfig.bgColor }}
                          >
                            <Typography variation="caption"
                              style={{
                                color: authorConfig.color,
                                fontSize: 11,
                              }}
                            >
                              {authorConfig.label}
                            </Typography>
                          </View>
                          <Typography variation="caption" style={{ color: "#9CA3AF" }}>
                            {dayjs(comment.added_time).format("DD MMM, h:mm A")}
                          </Typography>
                        </View>

                        {/* Comment Content */}
                        <Typography variation="body"
                          style={{
                            color: "#374151",
                            fontSize: 14,
                            lineHeight: 20,
                          }}
                        >
                          {comment.comments}
                        </Typography>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
