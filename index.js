const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { PrismaClient } = require("@prisma/client")
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient()


const resolvers = {
  Query: {
    // info : () => null
    info: () => `This is the API of a Hackernews Clone`,
    // 2
    feed: async (parent, args, context) => context.prisma.link.findMany(),

    link: (parent, args) => {
      const ans = links.findIndex(x => x.id === args.id)
      return links[ans]
      // return links[2]
    }
  },
  Mutation: {
    // 2
    post: async (parent, args, context) => {
       const newLink = await context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        }
      })
      console.log(newLink)
      return newLink
    },
    updateLink: async (parent, args ,context) => {
      // (id: ID!, url: String, description: String): Link
      const link = await context.prisma.link.update({
        where: { id: Number(args.id) },
        data: { url: args.url , description: args.description},
      })

      return link;

    },
    deleteLink: async (parent, args , context) => {
      // (id: ID!): Link
      const link = await context.prisma.link.delete({
        where: { id: Number(args.id) },
      })
      return link
    },
  },
  
  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // }
}

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma,
  }
})

// server
//   .listen()
//   .then(({ url }) =>
//     console.log(`Server is running on ${url}`)
//   );











async function ls() {
  try{

  const { stdout, stderr } = await exec('npx prisma studio');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  }catch (e){ console.log(e.message)}
}
ls();