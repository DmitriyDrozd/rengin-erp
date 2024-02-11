import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fastifyPassport from '@fastify/passport';
import { Strategy  } from 'passport-local';
import fastifySecureSession from '@fastify/secure-session';
import { ServerStore } from '../../store/configureServerStore.js';
import fp from "fastify-plugin";

interface User {
    username: string;
    password: string;
    // Add other user info fields here
}

const users: User[] = []; // Add your user data here

const localStrategy = new Strategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

 const authRaw: FastifyPluginAsync<ServerStore & FastifyPluginOptions> = async  (fastify: FastifyInstance, opts) => {
    fastify.register(fastifySecureSession, {
        key: 'your-secret-key'
    });

    fastify.register(fastifyPassport.initialize());
    fastify.register(fastifyPassport.secureSession());
    fastifyPassport.use(localStrategy)


    fastify.post('/login',
        {  preValidation: fastifyPassport.authenticate('local', { authInfo: false }) },
        (req, reply) => {
        console.log('post /login', req.user)

        return req.user
        // Implement your login logic here
    });


    fastify.get('/api/self', (req,res) => {
        return res.send(req.user)
      })

  
      fastify.get('/login', async (req,res) =>
         await res.sendFile('login.html')
      )
  
      fastify.get('/login/google', fastifyPassport.authenticate('google', {scope: ['profile', 'email']}))
  
      fastify.get('/logout',
          async (req, res) => {
              req.logout()
              return res.redirect('/login')
          }
      )


}

export const authPlugin  = fp(authRaw)