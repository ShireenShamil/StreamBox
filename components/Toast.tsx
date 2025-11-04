import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { Colors } from '../constants/theme';

type ToastContextType = {
  // show message, optional duration (ms), optional action label and callback
  show: (message: string, duration?: number, actionLabel?: string, actionCallback?: () => void) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [actionCb, setActionCb] = useState<(() => void) | null>(null);
  const anim = new Animated.Value(0);

  const show = useCallback((msg: string, duration = 3000, actLabel?: string, actCb?: () => void) => {
    setMessage(msg);
    setActionLabel(actLabel ?? null);
    setActionCb(() => actCb ?? null);
    setVisible(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setVisible(false);
        setMessage(null);
        setActionLabel(null);
        setActionCb(null);
      });
    }, duration);
  }, [anim]);

  // keep Animated.Value stable across renders
  useEffect(() => {
    // no-op
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && message ? (
        <Animated.View style={[styles.toast, { opacity: anim, backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.85)' }]} pointerEvents="box-none">
          <Text style={[styles.text, { color: '#fff' }]}>{message}</Text>
          {actionLabel && actionCb ? (
            <Text style={styles.action} onPress={() => { actionCb(); setVisible(false); setMessage(null); setActionLabel(null); setActionCb(null); }}>{actionLabel}</Text>
          ) : null}
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    right: 12,
    top: 48,
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  text: { color: '#fff' },
  action: { color: '#9cc7ff', marginLeft: 12, fontWeight: '700' },
});

export default ToastProvider;
