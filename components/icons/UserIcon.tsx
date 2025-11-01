import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface UserIconProps {
  size?: number;
  color?: string;
}

export const UserIcon: React.FC<UserIconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => {
  return <Ionicons name="person" size={size} color={color} />;
};
