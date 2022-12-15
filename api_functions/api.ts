import type { AxiosRequestConfig, AxiosError } from 'axios'
import axios from 'axios'
import Fastify from 'fastify'
import { load as loadCheerio } from 'cheerio'
import httpProxy from '@fastify/http-proxy'
import awsLambdaFastify from '@fastify/aws-lambda'
import cors from '@fastify/cors'

const fastify = Fastify({})

fastify.register(cors, {
  // put your options here
})

const TMDB = 'https://api.themoviedb.org/3'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

const sanitize_str = (str: string) => str.replace(/(\r\n|\n|\r)/gm, '')

const imdb_root = 'https://www.imdb.com'

const get_reviews = async (imdb_id: string) => {
  try {
    const axiosConfig: AxiosRequestConfig = {
      url: `${imdb_root}/title/${imdb_id}/reviews`,
      method: 'get',
      params: {
        sort: 'helpfulnessScore',
        dir: 'desc',
      },
    }

    const { data } = await axios(axiosConfig)
    const $ = loadCheerio(data)
    const reviews = $('.review-container .lister-item-content')

    const final_reviews = reviews
      .map(function () {
        const score = Number.parseFloat(
          $(this).find('.rating-other-user-rating > span').first().text(),
        )
        const score_scale = Number.parseInt(
          $(this)
            .find('.rating-other-user-rating > .point-scale')
            .first()
            .text()
            .split('/')[1] as string,
        )
        const final_score = (() => {
          if (score && score_scale) {
            /** We want a score out of 10 each time */
            return (score / score_scale) * 10
          }

          return null
        })()

        const title_el = $(this).find('.title')
        const url = imdb_root + title_el.attr('href')
        const title = sanitize_str(title_el.text())
        const author = sanitize_str(
          $(this).find('.display-name-link > a').text(),
        )
        const author_details = {
          username: author,
          rating: score,
        }
        const content = $(this).find('.content > .text').html()
        const date = (() => {
          const container = $(this).find('.review-date')

          if (container.length) {
            const review_date = container.text()
            return new Date(review_date)
          }

          return null
        })()

        return {
          rating: final_score,
          title,
          author,
          author_details,
          url,
          content,
          date,
          created_at: date,
          updated_at: date,
        }
      })
      .toArray()

    return final_reviews
  } catch (error) {
    return []
  }
}

fastify.register(
  (app, _opts, next) => {
    app.get<{
      Params: {
        imdb_id: string
      }
    }>('/entry/:imdb_id/info', async (request, reply) => {
      try {
        const {
          params: { imdb_id },
        } = request

        const axiosConfig: AxiosRequestConfig = {
          url: `${imdb_root}/title/${imdb_id}`,
          method: 'get',
        }

        const get_info = async () => (await axios(axiosConfig)).data
        const reqs = [get_reviews(imdb_id), get_info()]

        const [reviews, page_html] = await Promise.all(reqs)

        const $ = loadCheerio(page_html)
        const score = $('[data-testid*="rating__score"] > span').text().trim()
        const scoreFloat = Number.parseFloat(score)

        return reply
          .status(200)
          .headers(headers)
          .send({
            data: {
              score: !Number.isNaN(scoreFloat) ? scoreFloat : null,
              reviews,
            },
          })
      } catch (error) {
        const err = error as AxiosError

        return reply
          .status(err.response?.status || 500)
          .headers(headers)
          .send(err.response?.data || {})
      }
    })

    next()
  },
  { prefix: '/.netlify/functions/api' },
)

fastify.register(httpProxy, {
  upstream: TMDB,
  prefix: '/.netlify/functions/api/tmdb',
  http: {}, // Need to be defined explicitly
  replyOptions: {
    rewriteRequestHeaders: (_originalReq, headers) => ({
      ...headers,
      Authorization: `Bearer ${process.env.TMDB}`,
    }),
  },
})

/**
 * Handles conversion to netlify function
 */
export const handler = awsLambdaFastify(fastify)
