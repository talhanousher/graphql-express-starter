const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');
const _ = require('lodash');

const books = [
  { name: "book name 1", genre: 'Book genre 1', id: '1', authorId: '2' },
  { name: "book name 2", genre: 'Book genre 2', id: '2', authorId: '1' },
  { name: "book name 3", genre: 'Book genre 3', id: '3', authorId: '1' },
  { name: "book name 4", genre: 'Book genre 3', id: '3', authorId: '2' },
  { name: "book name 5", genre: 'Book genre 3', id: '3', authorId: '1' },
  { name: "book name 6", genre: 'Book genre 3', id: '3', authorId: '5' },
]

const authors = [
  { name: "authors name 1", age: 44, id: '1' },
  { name: "authors name 2", age: 44, id: '2' },
  { name: "authors name 3", age: 44, id: '3' },
]

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
})
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    books:{
      type: new GraphQLList(BookType),
      args: {},
      resolve(parent, args) {
        return books
      }
    },
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(books, { id: args.id })
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})