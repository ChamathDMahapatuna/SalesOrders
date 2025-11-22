import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchOrders, fetchOrderById } from '../redux/slices/ordersSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return { orders, loading, error };
};

export const useOrder = (id) => {
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  return { order: currentOrder, loading, error };
};
