import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface CameraIconProps {
  size?: number;
  color?: string;
}

export const CameraIcon: React.FC<CameraIconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => {
  return <Ionicons name="camera" size={size} color={color} />;
};
