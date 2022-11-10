import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true)

      await promptAsync()
    } catch (err) {
      console.log(err);
      
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(acess_token: string) {
    try {
      setIsUserLoading(true)

      const { data: tokenData } = await api.post('/users', {
        acess_token,
      })

      api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`

      const { data: infoData } = await api.get('/me')

      setUser(infoData.user)

    } catch (err) {
      console.log(err);
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response?.params?.access_token) {
      signInWithGoogle(response.params.access_token);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      { children }
    </AuthContext.Provider>
  )
}
