import { FormButton } from "@/components/atoms/FormButton";
import { ChangeReferralCodeModal } from "@/components/modals/ChangeReferralCodeModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  changeReferralCode,
  createCustomReferralCode,
  generateReferralCodeSuggestion,
  getMyReferralCode,
  getReferralStats,
  getReferredUsers,
  toggleReferralCode,
} from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReferralCodeScreenProps {
  showBackButton?: boolean;
}

export default function ReferralCodeScreen({
  showBackButton = true,
}: ReferralCodeScreenProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);

  const [code, setCode] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [usedCount, setUsedCount] = useState(0);
  const [stats, setStats] = useState({
    totalReferred: 0,
    activeCommissions: 0,
  });
  const [referredUsers, setReferredUsers] = useState<
    {
      referredUserId: string;
      referredEmail: string;
      storeUsername: string | null;
      profileImage: string | null;
      createdAt: string;
      commissionExpiresAt: string;
    }[]
  >([]);
  const [customCode, setCustomCode] = useState("");
  const [createCodeError, setCreateCodeError] = useState("");
  const [changeCodeValue, setChangeCodeValue] = useState("");
  const [changeCodeError, setChangeCodeError] = useState("");

  const loadReferralData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email || "");

    const [myCode, myStats, users] = await Promise.all([
      getMyReferralCode(user.id),
      getReferralStats(user.id),
      getReferredUsers(user.id),
    ]);

    setCode(myCode.code);
    setIsActive(myCode.isActive);
    setUsedCount(myCode.usedCount);
    setStats(myStats);
    setReferredUsers(users);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const handleCreateCustomCode = async () => {
    if (!userId || !userEmail) return;

    const normalizedCode = customCode.trim().toUpperCase();
    if (!normalizedCode) {
      setCreateCodeError("Enter a custom code first.");
      return;
    }

    setWorking(true);
    const result = await createCustomReferralCode(
      userId,
      userEmail,
      normalizedCode,
    );
    setWorking(false);

    if (!result.success) {
      setCreateCodeError(result.error || "Failed to create custom code.");
      return;
    }

    setCustomCode("");
    setCreateCodeError("");
    await loadReferralData();
  };

  const handleGenerateCreateCodeSuggestion = () => {
    setCustomCode(generateReferralCodeSuggestion());
    setCreateCodeError("");
  };

  const handleOpenChangeModal = () => {
    setChangeCodeValue(code ?? "");
    setChangeCodeError("");
    setChangeModalVisible(true);
  };

  const handleCloseChangeModal = () => {
    if (working) return;
    setChangeModalVisible(false);
    setChangeCodeError("");
  };

  const handleChangeCode = async () => {
    if (!userId) return;

    const normalizedCode = changeCodeValue.trim().toUpperCase();
    if (!normalizedCode) {
      setChangeCodeError("Enter a new referral code.");
      return;
    }

    setWorking(true);
    const result = await changeReferralCode(userId, normalizedCode);
    setWorking(false);

    if (!result.success) {
      setChangeCodeError(result.error || "Please try again.");
      return;
    }

    setChangeModalVisible(false);
    setChangeCodeError("");
    await loadReferralData();
  };

  const handleGenerateNewCodeSuggestion = () => {
    setChangeCodeValue(generateReferralCodeSuggestion());
    setChangeCodeError("");
  };

  const handleToggle = async () => {
    if (!userId) return;
    setWorking(true);

    const result = await toggleReferralCode(userId);
    setWorking(false);

    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to update referral status.");
      return;
    }

    setConfirmVisible(false);
    await loadReferralData();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <CustomHeader title="Referral Code" showBackButton={showBackButton} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </View>
    );
  }

  const renderReferredUser = (
    item: {
      referredUserId: string;
      referredEmail: string;
      storeUsername: string | null;
      profileImage: string | null;
      createdAt: string;
      commissionExpiresAt: string;
    },
    index: number,
  ) => {
    const joined = new Date(item.createdAt).toLocaleDateString();
    const commissionUntil = new Date(
      item.commissionExpiresAt,
    ).toLocaleDateString();

    const displayName =
      item.storeUsername && item.storeUsername.trim().length > 0
        ? `@${item.storeUsername}`
        : item.referredEmail;

    return (
      <View key={`${item.referredUserId}-${index}`}>
        <View className="py-3 px-4 flex-row items-center">
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-[#E5E7EB] items-center justify-center">
              <IconSymbol name="person.fill" size={16} color="#6B7280" />
            </View>
          )}

          <View className="ml-3 flex-1">
            <BodySemiboldText style={{ fontSize: 14 }}>
              {displayName}
            </BodySemiboldText>
            <CaptionText style={{ color: "#6B7280", marginTop: 2 }}>
              Joined {joined} · Commission until {commissionUntil}
            </CaptionText>
          </View>
        </View>
        {index < referredUsers.length - 1 && (
          <View className="h-[1px] bg-[#F3F4F6] ml-14" />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <CustomHeader title="Referral Code" showBackButton={showBackButton} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main card */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          {code ? (
            <>
              <CaptionText style={{ color: "#6B7280", marginBottom: 6 }}>
                Your referral code
              </CaptionText>
              <HeadingBoldText style={{ fontSize: 30, letterSpacing: 1.2 }}>
                {code}
              </HeadingBoldText>
              <View className="flex-row items-center mt-3">
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2" }}
                >
                  <CaptionText
                    style={{ color: isActive ? "#166534" : "#991B1B" }}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </CaptionText>
                </View>
                <CaptionText style={{ color: "#6B7280", marginLeft: 10 }}>
                  Used by {usedCount} user{usedCount === 1 ? "" : "s"}
                </CaptionText>
              </View>
            </>
          ) : (
            <>
              <HeadingBoldText style={{ fontSize: 24 }}>
                Create your referral code
              </HeadingBoldText>
              <BodyRegularText style={{ color: "#6B7280", marginTop: 6 }}>
                You can use a custom code or generate one automatically.
              </BodyRegularText>

              <View className="mt-4">
                <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
                  Custom Code
                </BodySemiboldText>
                <View>
                  <TextInput
                    placeholder="Example: NIKHIL"
                    value={customCode}
                    onChangeText={(text) => {
                      setCustomCode(text.toUpperCase());
                      if (createCodeError) setCreateCodeError("");
                    }}
                    autoCapitalize="characters"
                    editable={!working}
                    className={`h-[58px] px-4 pr-14 rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
                      createCodeError
                        ? "border-[#EF4444] bg-[#FEF2F2]"
                        : working
                          ? "border-[#E5E7EB] bg-[#F9FAFB]"
                          : "border-[#E5E7EB] bg-white"
                    }`}
                    style={{ color: working ? "#6B7280" : "#3B2F2F" }}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={handleGenerateCreateCodeSuggestion}
                    disabled={working}
                    activeOpacity={0.7}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <IconSymbol
                      name="arrow.clockwise"
                      size={20}
                      color={working ? "#D1D5DB" : "#6B7280"}
                    />
                  </TouchableOpacity>
                </View>
                {!!createCodeError && (
                  <CaptionText
                    className="mt-2"
                    style={{ color: "#EF4444", fontSize: 13 }}
                  >
                    {createCodeError}
                  </CaptionText>
                )}
              </View>

              <FormButton
                title="Create Custom Code"
                onPress={handleCreateCustomCode}
                loading={working}
                variant="primary"
                className="mt-2"
              />
            </>
          )}
        </View>

        {code && (
          <>
            <View className="flex-row mb-4" style={{ gap: 10 }}>
              <View className="flex-1 bg-white rounded-2xl p-4">
                <CaptionText style={{ color: "#6B7280" }}>
                  Total Referred
                </CaptionText>
                <HeadingBoldText style={{ fontSize: 24, marginTop: 6 }}>
                  {stats.totalReferred}
                </HeadingBoldText>
              </View>
              <View className="flex-1 bg-white rounded-2xl p-4">
                <CaptionText style={{ color: "#6B7280" }}>
                  Active Commission
                </CaptionText>
                <HeadingBoldText style={{ fontSize: 24, marginTop: 6 }}>
                  {stats.activeCommissions}
                </HeadingBoldText>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 mb-4">
              <BodySemiboldText style={{ fontSize: 15, marginBottom: 8 }}>
                Change Code
              </BodySemiboldText>
              {usedCount > 0 ? (
                <BodyRegularText style={{ color: "#6B7280" }}>
                  This code has already been used, so it cannot be changed.
                </BodyRegularText>
              ) : (
                <>
                  <BodyRegularText style={{ color: "#6B7280" }}>
                    Your code has not been used yet. You can change it once.
                  </BodyRegularText>
                  <FormButton
                    title="Change Code"
                    onPress={handleOpenChangeModal}
                    disabled={working}
                    variant="outline"
                    className="mt-3"
                  />
                </>
              )}
            </View>

            <View className="bg-white rounded-2xl p-4 mb-4">
              <BodySemiboldText style={{ fontSize: 15, marginBottom: 6 }}>
                Referred Users
              </BodySemiboldText>
              {referredUsers.length === 0 ? (
                <BodyRegularText style={{ color: "#6B7280" }}>
                  No users have used your referral code yet.
                </BodyRegularText>
              ) : (
                <View className="bg-[#FAFAFA] rounded-xl mt-1">
                  {referredUsers.map(renderReferredUser)}
                </View>
              )}
            </View>

            <View className="items-center mt-2">
              <TouchableOpacity onPress={() => setConfirmVisible(true)}>
                <BodyRegularText
                  style={{ color: "#6B7280", textDecorationLine: "underline" }}
                >
                  {isActive
                    ? "Deactivate referral code"
                    : "Reactivate referral code"}
                </BodyRegularText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        title={isActive ? "Deactivate Referral" : "Reactivate Referral"}
        message={
          isActive
            ? "New users will not be able to use this code while it is inactive. Existing referrals remain linked."
            : "Users will be able to use this referral code again."
        }
        confirmText={isActive ? "Deactivate" : "Reactivate"}
        cancelText="Cancel"
        onConfirm={handleToggle}
        onCancel={() => setConfirmVisible(false)}
        loading={working}
        variant={isActive ? "danger" : "success"}
        icon={isActive ? "pause.circle.fill" : "play.circle.fill"}
      />

      <ChangeReferralCodeModal
        visible={changeModalVisible}
        value={changeCodeValue}
        error={changeCodeError}
        loading={working}
        onChangeText={(text) => {
          setChangeCodeValue(text);
          if (changeCodeError) setChangeCodeError("");
        }}
        onGenerateSuggestion={handleGenerateNewCodeSuggestion}
        onSave={handleChangeCode}
        onClose={handleCloseChangeModal}
      />
    </View>
  );
}
