import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

export interface AppInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  required = false,
  error,
  leftIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const { colors, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

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
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
            borderRadius: spacing.borderRadius.md,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: colors.text, paddingVertical: spacing.sm },
            style,
          ]}
          placeholderTextColor={colors.textSecondary + '80'}
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
  input: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
