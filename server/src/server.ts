import express from 'express';
import cors from 'cors'

import { PrismaClient } from '@prisma/client';
import convertHourStringToMinutes from './utils/convert-hour-string-to-minutes';
import convertMinutestoHourString from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json());
app.use(cors())

const prisma = new PrismaClient({
  log: ['query'],
});

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return res.json(games);
});

app.get('/games/:id/ads', async (req, res) => {
  const { id } = req.params

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    }
    ,where: {
      gameId: id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutestoHourString(ad.hourStart),
      hourEnd: convertMinutestoHourString(ad.hourEnd),
    }
  }))
})

app.get('/ads/:id/discord', async (req, res) => {
  const AdId = req.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: AdId
    }
  })

  return res.json({
    discord: ad.discord
  })
})

app.post('/games/:gameId/ads', async (req, res) => {
  const { gameId } = req.params
  const {
    id,
    name,      
    yearsPlaying,
    discord,
    weekDays,
    hourStart,
    hourEnd,
    useVoiceChannel
  } = req.body

  const ad = await prisma.ad.create({
    data: {
      gameId,
      id,  
      name,      
      yearsPlaying,
      discord,
      weekDays: weekDays.join(','),
      hourStart: convertHourStringToMinutes(hourStart),
      hourEnd: convertHourStringToMinutes(hourEnd),
      useVoiceChannel,
    }
  })

  return res.json(ad)
})


app.listen(3333);
