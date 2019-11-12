## Description

This plugin makes your Published Backquote Blog Posts available to be used in Gatsby.js to build your custom blog frontend.

## How to install

    npm install --save gatsby-source-backquote

## Configuration

The plugin needs to know your Backquote Blog ID and Blog Access Token.
You can get both from Backquote User Console.
Add following to the `plugins` array inside `gatsby-config.js` file.

    {
      resolve: "gatsby-source-backquote",
      options: {
        blogId: process.env.BACKQUOTE_BLOG_ID,
        token: process.env.BACKQUOTE_BLOG_TOKEN,
      },
    },

This example gets `blogId` and `token` variables from environment variables `BACKQUOTE_BLOG_ID` and `BACKQUOTE_BLOG_TOKEN`.
Be careful to not share the token with public.

## How to query for data

Try this example GraphQL query to get the imported posts:

    {
      allBackquotePost(sort: { fields: time_created, order: DESC }) {
        edges {
          node {
            id
            slug
            title
          }
        }
      }
    }
