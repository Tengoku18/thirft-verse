import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { LockIcon } from "@/components/icons";
import AtSignIcon from "@/components/icons/AtSignIcon";
import HangerIcon from "@/components/icons/ClosetIcon";
import ShopIcon from "@/components/icons/StoreIcon";
import LocationIcon from "@/components/icons/locationIcon";
import { ScreenLayout } from "@/components/layouts";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { Typography } from "@/components/ui/Typography";
import { INPUT_COLORS } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { districtsOfNepal } from "@/lib/constants/districts";
import { checkUsernameExists, updateUserProfile } from "@/lib/database-helpers";
import { uploadProfileImage } from "@/lib/storage-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;
const BIO_MAX = 500;

const SELLER_TYPE_INFO = {
  store: {
    label: "Store",
    description: "Professional store seller",
    icon: <ShopIcon />,
  },
  closet: {
    label: "Closet",
    description: "Personal closet seller",
    icon: <HangerIcon />,
  },
};

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.profile) as any;

  // ── Form state ──────────────────────────────────────────────────
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [storeImageUri, setStoreImageUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [storeName, setStoreName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // ── Error state ──────────────────────────────────────────────────
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [saving, setSaving] = useState(false);

  const sellerType: "store" | "closet" | "" = profile?.seller_type ?? "";
  const isStore = sellerType === "store";
  const isCloset = sellerType === "closet";

  // ── District options ──────────────────────────────────────────────
  const districtOptions = useMemo(
    () => districtsOfNepal.map((d) => ({ label: d, value: d })),
    [],
  );

  // ── Seed from Redux profile ───────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    const sd = profile.seller_data ?? {};
    setImageUri(profile.profile_image ?? null);
    setStoreImageUri(sd.store_image ?? null);
    setName(profile.name ?? "");
    setUsername(profile.store_username ?? "");
    setBio(profile.bio ?? "");
    setStoreName(sd.store_name ?? "");
    setInstagramHandle(sd.instagram_handle ?? "");
    setDistrict(profile.address ?? ""); // profile.address holds the district
    setAddress(sd.address ?? "");
  }, [profile]);

  // ── Dirty detection ───────────────────────────────────────────────
  const sd = profile?.seller_data ?? {};
  const isDirty =
    imageUri !== (profile?.profile_image ?? null) ||
    storeImageUri !== (sd.store_image ?? null) ||
    name !== (profile?.name ?? "") ||
    username !== (profile?.store_username ?? "") ||
    bio !== (profile?.bio ?? "") ||
    storeName !== (sd.store_name ?? "") ||
    instagramHandle !== (sd.instagram_handle ?? "") ||
    district !== (profile?.address ?? "") ||
    address !== (sd.address ?? "");

  // ── Save handler ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user?.id) return;

    let hasError = false;

    if (!name.trim() || name.trim().length < 2) {
      setNameError("Name must be at least 2 characters.");
      hasError = true;
    } else {
      setNameError("");
    }

    const normalizedUsername = username.trim().toLowerCase();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      setUsernameError("3–30 characters: letters, numbers, or underscores.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (hasError) return;

    setSaving(true);

    try {
      // Check username uniqueness only if changed
      if (normalizedUsername !== profile?.store_username) {
        const taken = await checkUsernameExists(normalizedUsername);
        if (taken) {
          setUsernameError("This username is already taken.");
          setSaving(false);
          return;
        }
      }

      // Upload profile image if it's a new local URI
      let finalImage = imageUri;
      if (
        imageUri &&
        imageUri !== profile?.profile_image &&
        (imageUri.startsWith("file") || imageUri.startsWith("ph://"))
      ) {
        const upload = await uploadProfileImage(user.id, imageUri);
        if (upload.success && upload.url) {
          finalImage = upload.url;
        } else {
          toast.error("Failed to upload profile photo. Please try again.");
          setSaving(false);
          return;
        }
      }

      // Upload store display image if it's a new local URI
      let finalStoreImage = storeImageUri;
      if (
        storeImageUri &&
        storeImageUri !== sd.store_image &&
        (storeImageUri.startsWith("file") || storeImageUri.startsWith("ph://"))
      ) {
        const upload = await uploadProfileImage(user.id, storeImageUri);
        if (upload.success && upload.url) {
          finalStoreImage = upload.url;
        } else {
          toast.error("Failed to upload store photo. Please try again.");
          setSaving(false);
          return;
        }
      }

      // Build seller_data — merge with existing so we don't wipe other keys
      const updatedSellerData = {
        ...(profile?.seller_data ?? {}),
        district,
        address: address.trim(),
        store_image: finalStoreImage,
        ...(isStore && { store_name: storeName.trim() }),
        ...(isCloset && { instagram_handle: instagramHandle.trim() }),
      };

      const result = await updateUserProfile({
        userId: user.id,
        name: name.trim(),
        store_username: normalizedUsername,
        bio: bio.trim(),
        address: district, // profile.address = district (mirrors signup)
        seller_data: updatedSellerData,
        ...(finalImage !== profile?.profile_image && {
          profile_image: finalImage ?? undefined,
        }),
      });

      if (!result.success) {
        toast.error("Failed to save profile. Please try again.");
        return;
      }

      await dispatch(fetchUserProfile(user.id));
      toast.success("Profile updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout
      title="Edit Profile"
      paddingHorizontal={0}
      contentBackgroundColor="#F5F5F5"
    >
      <View className="pt-4 pb-8 gap-6">
        {/* ── Profile Photo ─────────────────────────────────────── */}
        <View className="mx-4">
          <Card variant="elevated">
            <ProfileImagePicker
              value={imageUri}
              onChange={setImageUri}
              name={name}
              label="Profile Photo"
            />
          </Card>
        </View>

        {/* ── Personal Info (Step 1) ────────────────────────────── */}
        <View className="mx-4">
          <Card variant="elevated">
            <View className="gap-4">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                Personal Info
              </Typography>

              <Input
                label="Full Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) setNameError("");
                }}
                autoCapitalize="words"
                placeholder="Your full name"
                errorMessage={nameError}
                variant={nameError ? "error" : "default"}
              />

              {/* Email — disabled */}
              <View>
                <Typography
                  variation="body"
                  className="text-input-label font-sans-semibold mb-2"
                >
                  Email
                </Typography>
                <View className="flex-row items-center rounded-3xl px-4 py-4 bg-brand-off-white border border-ui-border-light opacity-60">
                  <Typography
                    variation="body"
                    className="flex-1 text-ui-secondary"
                  >
                    {user?.email ?? ""}
                  </Typography>
                  <LockIcon width={24} height={24} color="#9CA3AF" />
                </View>
                <Typography variation="caption" intent="muted" className="mt-1">
                  Email cannot be changed
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* ── Account Type (Step 3) — read-only ────────────────── */}
        {sellerType !== "" && (
          <View className="mx-4">
            <Card variant="elevated">
              <View className="gap-3">
                <Typography
                  variation="caption"
                  intent="muted"
                  className="uppercase tracking-wider"
                >
                  Account Type
                </Typography>

                <View className="flex-row items-center gap-3 p-3 rounded-2xl bg-brand-off-white border border-ui-border-light">
                  <View className="w-10 h-10 rounded-full bg-brand-beige items-center justify-center">
                    {SELLER_TYPE_INFO[sellerType]?.icon}
                  </View>
                  <View className="flex-1">
                    <Typography variation="body" className="font-sans-semibold">
                      {SELLER_TYPE_INFO[sellerType]?.label}
                    </Typography>
                    <Typography variation="caption" intent="muted">
                      {SELLER_TYPE_INFO[sellerType]?.description}
                    </Typography>
                  </View>
                  <LockIcon width={24} height={24} color="#9CA3AF" />
                </View>

                <Typography variation="caption" intent="muted">
                  Account type cannot be changed after signup.
                </Typography>
              </View>
            </Card>
          </View>
        )}

        {/* ── Store Details (Step 4) ────────────────────────────── */}
        <View className="mx-4">
          <Card variant="elevated">
            <View className="gap-4">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                {isStore ? "Store Details" : "Creator Details"}
              </Typography>

              {/* Store Display Photo */}
              <ProfileImagePicker
                value={storeImageUri}
                onChange={setStoreImageUri}
                label={isStore ? "Store Avatar" : "Profile Avatar"}
              />

              {/* Store Name — store only */}
              {isStore && (
                <Input
                  label="Store Name"
                  value={storeName}
                  onChangeText={setStoreName}
                  autoCapitalize="words"
                  placeholder="e.g. The Vintage Archive"
                />
              )}

              {/* Username */}
              <Input
                label="Store Username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                  if (usernameError) setUsernameError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="yourstore"
                leftIcon={<AtSignIcon color={INPUT_COLORS.icon} />}
                errorMessage={usernameError}
                variant={usernameError ? "error" : "default"}
              />

              {/* Bio */}
              <View>
                <Typography
                  variation="body"
                  className="text-input-label font-sans-semibold mb-2"
                >
                  Bio
                </Typography>
                <Input
                  value={bio}
                  onChangeText={(text) => {
                    if (text.length <= BIO_MAX) setBio(text);
                  }}
                  placeholder={
                    isStore
                      ? "Share your thrift story, style aesthetic, and shipping info..."
                      : "Tell your story, your aesthetic, and what you're selling..."
                  }
                  multiline
                  numberOfLines={4}
                  containerClassName="flex-row items-start rounded-3xl px-4 py-4 bg-white border"
                  style={{ minHeight: 80, textAlignVertical: "top" }}
                />
                <Typography
                  variation="caption"
                  intent="muted"
                  className={`mt-1 text-right ${bio.length >= BIO_MAX ? "text-status-error" : ""}`}
                >
                  {bio.length}/{BIO_MAX}
                </Typography>
              </View>

              {/* Instagram Handle — closet only */}
              {isCloset && (
                <Input
                  label="Instagram Username"
                  value={instagramHandle}
                  onChangeText={setInstagramHandle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="@username"
                />
              )}
            </View>
          </Card>
        </View>

        {/* ── Location (Step 4) ─────────────────────────────────── */}
        <View className="mx-4">
          <Card variant="elevated">
            <View className="gap-4">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                Location
              </Typography>

              <Select
                label="District"
                value={district}
                options={districtOptions}
                onChange={setDistrict}
                searchable
                placeholder="Search districts..."
                searchPlaceholder="Search districts..."
                leftIcon={<LocationIcon color="#3b303099" />}
              />

              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
                placeholder="e.g. Tilottama-3, Drivertole"
              />
            </View>
          </Card>
        </View>

        {/* ── Unsaved indicator + Save ──────────────────────────── */}
        <View className="mx-4 gap-3">
          {isDirty && (
            <View className="flex-row items-center gap-2 justify-center">
              <View className="w-2 h-2 rounded-full bg-brand-espresso" />
              <Typography variation="caption" intent="muted">
                Unsaved changes
              </Typography>
            </View>
          )}
          <Button
            label="Save Changes"
            variant="primary"
            onPress={handleSave}
            isLoading={saving}
            disabled={!isDirty || saving}
          />
        </View>
      </View>
    </ScreenLayout>
  );
}
