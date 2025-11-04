import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

type ToastContextType = {
  show: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const anim = new Animated.Value(0);

  const show = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    setVisible(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setVisible(false);
        setMessage(null);
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
        <Animated.View style={[styles.toast, { opacity: anim }]} pointerEvents="none">
          <Text style={styles.text}>{message}</Text>
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
});

export default ToastProvider;
