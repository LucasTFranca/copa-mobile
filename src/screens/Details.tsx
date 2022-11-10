import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useState, useEffect } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true)
  const [poolsDetails, setPoolsDetails] = useState<PoolCardProps>({} as PoolCardProps)

  const toast = useToast()

  const route = useRoute()
  const { id } = route.params as RouteParams

  async function fetchPoolDetails() {
    try {
      setIsLoading(true)

      const { data } = await api.get(`/pools/${id}`)

      setPoolsDetails(data.pool)
    } catch (err) {
      console.log(err)

      toast.show({
        title: 'Não foi possivel carregar os detalhes do bolões!',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id])

  async function handleCodeShare() {
    await Share.share({
      message: poolsDetails.code,
    })
  }

  if (isLoading) return <Loading />

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolsDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        poolsDetails._count?.participants > 0 
        ? <VStack px={5} flex={1}>
            <PoolHeader data={poolsDetails} />

            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5} >
              <Option
                title="Seus palpites"
                isSelected={optionSelected === 'guesses'}
                onPress={() => setOptionSelected('guesses')}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>

            <Guesses poolId={poolsDetails.id} code={poolsDetails.code} />
          </VStack>

        : <EmptyMyPoolList code={poolsDetails.code} />
      }
    </VStack>
  )
}