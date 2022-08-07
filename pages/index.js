import Head from 'next/head'
import { getVideos } from 'lib/data.js'
import prisma from 'lib/prisma'
import Videos from 'components/videos'
import Heading from 'components/heading'
import LoadMore from 'components/loadmore'
import { useState } from 'react'
import { amount } from 'lib/config'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos)
  const [reachedEnd, setReachedEnd] = useState(initialVideos.length < amount)
  const { data: session, status } = useSession()
  const router = useRouter()

  const loading = status === 'loading'

  if (loading) {
    return null
  }

  if (session && !session.user.name) {
    router.push('/setup')
  }

  return (
    <div>
      <Head>
        <title></title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Heading />

      {videos.length === 0 && (
        <p className='flex justify-center mt-20'>No videos found!</p>
      )}

      <Videos videos={videos} />
      {!reachedEnd && (
        <LoadMore
          videos={videos}
          setVideos={setVideos}
          setReachedEnd={setReachedEnd}
        />
      )}
    </div>
  )
}

export async function getServerSideProps() {
  let videos = await getVideos({}, prisma)
  videos = JSON.parse(JSON.stringify(videos))

  return {
    props: {
      initialVideos: videos,
    },
  }
}