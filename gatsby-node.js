const fetch = require("node-fetch")

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // Helper function that processes a post to match Gatsby's node structure
  const processPost = post => {
    const nodeId = createNodeId(`backquote-post-${post.id}`)
    const nodeContent = JSON.stringify(post)
    const nodeData = Object.assign({}, post, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `BackquotePost`,
        content: nodeContent,
        contentDigest: createContentDigest(post),
      },
    })
    return nodeData
  }

  const token = configOptions.token
  const blogId = configOptions.blogId

  const apiUrl = `https://api.backquote.io/expose/v1/${blogId}/posts`

  const getPosts = async function (pageNo = 1) {
    let actualUrl = apiUrl + `?page=${pageNo}`;
    var apiResults = await fetch(actualUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(resp => {
        return resp.json();
      });

    return apiResults;
  }

  const getEntirePostList = async function (pageNo = 1) {
    const results = await getPosts(pageNo);
    if (results.length > 0) {
      return results.concat(await getEntirePostList(pageNo + 1));
    } else {
      return results;
    }
  };

  return (async () => {

    const entireList = await getEntirePostList();

    entireList.forEach(post => {
      // Process the post data to match the structure of a Gatsby node
      const nodeData = processPost(post)
      // Use Gatsby's createNode helper to create a node from the node data
      createNode(nodeData)
    })

  })();
}
