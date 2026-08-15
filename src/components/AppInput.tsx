import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

export interface AppInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  required = false,
  error,
  leftIcon,
  rightIcon,
  isPassword,
  secureTextEntry,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const { colors, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword || secureTextEntry;
  const effectiveSecureTextEntry = isSecure ? !showPassword : false;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <AppText variant="caption" weight="semibold" color={colors.textSecondary}>
            {label}
          </AppText>
          {required && (
            <AppText variant="caption" color={colors.error} style={styles.asterisk}>
              *
            </AppText>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
            borderRadius: spacing.borderRadius.md,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, { color: colors.text, paddingVertical: spacing.sm }, style]}
          placeholderTextColor={colors.textSecondary + '80'}
          accessibilityLabel={label}
          secureTextEntry={effectiveSecureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          {...restProps}
        />

        {isSecure && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.rightIconWrapper}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}

        {!isSecure && rightIcon && (
          <View style={styles.rightIconWrapper}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <AppText variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  asterisk: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconWrapper: {
    marginLeft: 10,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
