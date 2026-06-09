// src/components/ui/BottomSheet.tsx
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { colors } from '../../theme/designTokens';

export const useBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const present = useCallback(() => bottomSheetRef.current?.present(), []);
  const dismiss = useCallback(() => bottomSheetRef.current?.dismiss(), []);
  return { bottomSheetRef, present, dismiss };
};

export const CustomBottomSheet = ({ children, snapPoints = ['25%', '50%'], ref }: any) => {
  const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);
  return (
    <BottomSheetModal ref={ref} snapPoints={snapPointsMemo} backgroundStyle={{ backgroundColor: colors.surface }} handleIndicatorStyle={{ backgroundColor: colors.border }}>
      <BottomSheetView>
        <View style={{ padding: 16 }}>{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};