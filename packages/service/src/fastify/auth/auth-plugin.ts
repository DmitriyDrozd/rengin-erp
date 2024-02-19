import {FastifyInstance, FastifyPluginAsync, FastifyPluginOptions} from 'fastify';
import fastifyPassport from '@fastify/passport';
import {Strategy} from 'passport-local';
import fastifySecureSession from '@fastify/secure-session';
import {ServerStore} from '../../store/buildServerStore.js';
import fp from "fastify-plugin";
import {httpErrors} from "../../errors";
import '../../typings'
import {toIndexedArray} from "@shammasov/utils";

const fs = require('fs')
const path = require('path')
interface User {
    email: string;
    password: string;
    id: string
    // Add other user info fields here
}



 const authRaw: FastifyPluginAsync<ServerStore & FastifyPluginOptions> = async  (fastify: FastifyInstance, opts) => {
    fastify.register(fastifySecureSession, {
        key: fs.readFileSync(path.join(__dirname, 'secret-key')),
        cookie: {
            path: '/'
        }
    });

    fastify.register(fastifyPassport.initialize());
    fastify.register(fastifyPassport.secureSession());
     const localStrategy = new Strategy({
         usernameField: 'email',
         passwordField: 'password'
     },(email, password, done) => {

         const user = toIndexedArray(fastify.store.getState().users.entities).find(u => u.email === email && u.password === password);

         if (user) {
             done(null, user);
         } else {
             done(null, false);
         }
     });

     fastifyPassport.use(localStrategy)

     fastifyPassport.registerUserDeserializer(async (userId, req) => {

         const users =  req.store.getState().users
         return toIndexedArray(users.entities).find(u => u.id === userId)
     })

     fastifyPassport.registerUserSerializer(async (user, req) => {

         return user.id
     })
    fastify.post('/api/login',
        {  preValidation: fastifyPassport.authenticate('local', { authInfo: false }) },
        (req, reply) => {
        console.log('post /login', req.user)

        return req.user
        // Implement your login logic here
    });


    fastify.get('/api/self',(req,reply) => {
        if(req.isUnauthenticated())
            throw new httpErrors.UnauthorizedError('Вы не авторизованы', {
                header: { 'X-Req-Id': req.id, cookies: req.cookies},

            })
        return reply.send(req.user ?  req.user : {Error:'Unauthorized'})
      })

  
      fastify.get('/login', async (req,reply) =>
         await reply.sendFile('index.html')
      )

  
      fastify.post('/api/logout',
          async (req, res) => {
              req.logout()
              //return entity.redirect('/login')
          }
      )


}

export const authPlugin  = fp(authRaw)