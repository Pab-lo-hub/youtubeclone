import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(501).end()
  }

  const session = await getSession({ req })

  if (!session) return res.status(401).json({ message: 'Not logged in' })

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  if (!user) return res.status(401).json({ message: 'User not found' })

  const userToSubscribeTo = await prisma.user.findUnique({
    where: {
      id: req.body.unsubscribeTo,
    },
  })

  if (!userToSubscribeTo) {
    return res.status(401).json({ message: 'User not found' })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      subscribedTo: {
        disconnect: [{ id: req.body.unsubscribeTo }],
      },
    },
  })

  res.end()
}