// hooks/index.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { useDispatch as rdUseDispatch, useSelector as rdUseSelector } from 'react-redux';

export const useAppDispatch = () => rdUseDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = rdUseSelector;
