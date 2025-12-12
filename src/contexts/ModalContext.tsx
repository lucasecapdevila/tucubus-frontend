import { UseModalReturn } from '@/types';
import { createContext } from 'react';

const ModalContext = createContext<UseModalReturn | null>(null);

export default ModalContext;