import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  TextInput
} from '@ignite-ui/react'

import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { buildNextAuthOption } from '../../api/auth/[...nextauth].api'
import { unstable_getServerSession } from 'next-auth'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const updateProfileSchema = z.object({
  bio: z.string()
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema)
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/profile', {
      bio: data.bio
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Atualiza seu perfil | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text sm="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.username}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOption(req, res)
  )
  return {
    props: { session }
  }
}
