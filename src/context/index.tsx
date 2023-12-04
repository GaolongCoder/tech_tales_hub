import { ReactNode, createContext, useContext, useState } from 'react';

const AuthContext = createContext<{
  user: IUser;
  setUser: (user: IUser) => void; // eslint-disable-line
} | null>(null);
AuthContext.displayName = 'AuthContext';

interface IUser {
  userId: number | string;
  avatar: string;
  nickname: string;
}

export const AuthProvider = ({
  value,
  children,
}: {
  value: IUser;
  children: ReactNode;
}) => {
  const [user, setUser] = useState(value);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must use in AuthProvider');
  }
  return context;
};
