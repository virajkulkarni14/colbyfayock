const path = require("path");

module.exports = ({ graphql, actions }) => {

    const { createPage } = actions;

    return new Promise((resolve, reject) => {

        graphql(`
            {
                allMarkdownRemark(
                    limit: 1000
                ) {
                    edges {
                        node {
                            frontmatter {
                                template
                                title
                            }
                            fields {
                                slug
                            }
                        }
                    }
                }
            }
        `).then(result => {

            if ( result.errors ) {
               return Promise.reject(result.errors);
            }

            result.data.allMarkdownRemark.edges.forEach(({ node }) => {

                createPage({
                    path: node.fields.slug,
                    component: path.resolve(`src/templates/${String(node.frontmatter.template)}.js`),
                    context: {
                        slug: node.fields.slug,
                    },
                });

            });

            resolve();

        });

    });
};