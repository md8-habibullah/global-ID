// lib/hashnode.ts
export const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";
export const HASHNODE_HOST = "habibullahs-blog.hashnode.dev";

export async function hashnodeRequest(query: string, variables: any = {}) {
  const res = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data from Hashnode");
  }

  const { data, errors } = await res.json();
  if (errors) {
    console.error("Hashnode GQL Errors:", errors);
    throw new Error(errors[0].message);
  }

  return data;
}

export async function getPosts(first: number = 10) {
  const query = `
    query GetPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              slug
              title
              brief
              publishedAt
              coverImage {
                url
              }
              author {
                name
                profilePicture
              }
            }
          }
        }
      }
    }
  `;

  const data = await hashnodeRequest(query, { host: HASHNODE_HOST, first });
  return data.publication.posts.edges.map((edge: any) => edge.node);
}

export async function getPost(slug: string) {
  const query = `
    query GetPost($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          title
          subtitle
          publishedAt
          coverImage {
            url
          }
          content {
            html
          }
          author {
            name
            profilePicture
          }
          tags {
            name
          }
        }
      }
    }
  `;

  const data = await hashnodeRequest(query, { host: HASHNODE_HOST, slug });
  return data.publication.post;
}
