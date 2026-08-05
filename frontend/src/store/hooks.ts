import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Typed version of useDispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed version of useSelector
export const useAppSelector = useSelector.withTypes<RootState>();
