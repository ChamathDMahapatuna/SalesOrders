import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchItems } from '../redux/slices/itemsSlice';

export const useItems = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  return { items, loading, error };
};
