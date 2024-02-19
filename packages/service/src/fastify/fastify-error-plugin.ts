const fp = require('fastify-plugin')
const Youch = require('youch')

function fastifyErrorPage(fastify, options, next) {
    fastify.setErrorHandler((err, req, reply) => {
        try {
            const youch = new Youch(err, req.raw)
            youch.toHTML().then((html) => {
                reply.type('text/html')
                reply.send(html)
            })
        } catch (error) {
            reply.send(error)
        }
    })

    next()
}

module.exports = fp(fastifyErrorPage, {
    name: 'fastify-error-plugin'
})