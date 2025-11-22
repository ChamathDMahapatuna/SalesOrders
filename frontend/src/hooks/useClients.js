import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchClients } from '../redux/slices/clientsSlice';

export const useClients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  return { clients, loading, error };
};
